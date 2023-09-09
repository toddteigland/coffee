import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });


import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dbConnection from "./db/connection.mjs";
import bcrypt from "bcryptjs";
import http from "http";
import { Server } from "socket.io";
// import dbConnection from "./db/connection.mjs";
import { Sequelize } from "sequelize";

const app = express();
const port = 8080;
const { db, connectToDatabase } = dbConnection;

// Allow CORS for requests from localhost:3000
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Add OPTIONS method
    next();
  });
  
  app.use(bodyParser.json());
  
// Handle OPTIONS requests
app.options("*", (req, res) => {
  res.status(200).send();
});

// API endpoint to fetch coffee shop data from Google Places API
app.get("/coffee-shops", async (req, res) => {
  const { lat, lng } = req.query;
  const radius = 8000;
  const type = "cafe";
  const keyword = "coffee";
  const apiKey = process.env.BACK_END_GOOG_API;

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&keyword=${keyword}&key=${apiKey}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching coffee shop data:", error.message);
    res.status(500).json({ error: "Error fetching coffee shop data" });
  }
});

let lastOrderId = 0;

// SET UP WEB SOCKETS AND SERVER ------------------------------------------------------------------------------
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",  // allow to server to accept request from different origin
    methods: ["GET", "POST", "get", "post"]  // set allowed methods
  }
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("new_order", (order) => {
    // io.emit("new_order", order); // Broadcast to all stores
    // console.log('NEW ORDER RECEIVED', order);
  });

  socket.on("completed_order", (orderId) => {
    io.emit("completed_order", orderId); // Broadcast to all stores
  });

  socket.on("picked_up_order", (orderId) => {
    io.emit("picked_up_order", orderId); // Broadcast to all stores
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
  
  socket.on("error", (error) => {
    console.log("Socket Error: ", error);
  });

});
 
httpServer.listen(8080, () => {
  console.log("Web Socket Server running on port 8080");
}); 


async function startServer() {
  try {
    console.log('Database connection successful.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return;
  };

  setInterval(async () => {
    try {
      const res = await db.query(
        `
        SELECT 
          orders.id, orders.user_id, orders.created_at, orders.store_id, orders.storeinfo,
          order_items.id AS item_id, order_items.coffee_type, order_items.size, order_items.price, order_items.extras 
        FROM 
          orders 
        LEFT JOIN 
          order_items ON orders.id = order_items.order_id 
        WHERE 
          orders.id > $1
        ORDER BY 
          orders.id ASC, order_items.id ASC
        `,
        [lastOrderId]
      );
  
      const newOrders = res.rows;
  
      if (newOrders && newOrders.length > 0) {
        // Update lastOrderId for next polling cycle
        lastOrderId = newOrders[newOrders.length - 1].id;
  
        // Group the items by order ID
        const ordersGrouped = newOrders.reduce((acc, order) => {
          if (!acc[order.id]) {
            acc[order.id] = {
              id: order.id,
              user_id: order.user_id,
              created_at: order.created_at,
              store_id: order.store_id,
              storeinfo: order.storeinfo,
              items: [],
            };
          }
          if (order.item_id) {
            acc[order.id].items.push({
              id: order.item_id,
              coffee_type: order.coffee_type,
              size: order.size,
              price: order.price,
              extras: order.extras,
            });
          }
          return acc;
        }, {});
  
        // Convert the grouped orders into an array
        const ordersArray = Object.values(ordersGrouped);
  
        console.log(`Fetched new orders: ${JSON.stringify(ordersArray, null, 2)}`);
  
        // Emit new orders to all connected WebSocket clients
        io.emit('new_order', ordersArray);
      }
    } catch (error) {
      console.error('Error while polling for new orders:', error);
    }
  }, 5000);
   
}
connectToDatabase();
startServer();

// REGISTER USERS TO DB -------------------------------------------------------------------------------------------------------------
app.post("/user-register", async (req, res) => {
  console.log("Received user Registration Request:", {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
  });
  const { first_name, last_name, email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const emailCheckQuery = "SELECT * FROM users WHERE email = $1";
    const emailCheckResult = await db.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      // Email already exists, return an error
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashed_password = bcrypt.hashSync(password, 10);

    const query = `
      INSERT INTO users (first_name, last_name, email, hashed_password)
      VALUES ($1, $2, $3, $4)
      RETURNING id`;
    const values = [first_name, last_name, email, hashed_password]; // Hash the password before storing it in production

    const result = await db.query(query, values);

    res.status(201).json({ userId: result.rows[0].id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});

//FETCH USERS FROM DB -------------------------------------------------------------------------------------------------------------
app.get("/get-users", async (req, res) => {
  console.log("Received User Retreival request");

  try {
    const query = `Select * FROM users;`;
    const result = await db.query(query);
    console.log("RESULTS::: ", result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error Fetching Users:", error);
    res.status(500).json({ error: "Error Fetching Users" });
  }
});

//FETCH CURRENT USER -------------------------------------------------------------------------------------------------------------
app.get("/getUserInfo", async (req, res) => {
  const { email } = req.query;

  try {
    const userQuery = `
      SELECT * 
      FROM users
      WHERE email = $1`;

    const userResult = await db.query(userQuery, [email]);
    res.status(200).json(userResult.rows[0]);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Error fetching user info" });
  }
});

// USER LOGIN -------------------------------------------------------------------------------------------------------------
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user with the given email exists in the database
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await db.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid User credentials" });
    }

    const user = userResult.rows[0];

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = bcrypt.compareSync(password, user.hashed_password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid User credentials" });
    }

    // Successful login
    res.status(200).json( user );
  } catch (error) {
    console.error("Error logging in User:", error);
    res.status(500).json({ error: "Error logging in User" });
  }
});

// STORE LOGIN ------------------------------------------------------------------------------------------------------
app.post("/store-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user with the given email exists in the database
    const storeQuery = "SELECT * FROM stores WHERE email = $1";
    const storeResult = await db.query(storeQuery, [email]);

    if (storeResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid Store credentials" });
    }

    const store = storeResult.rows[0];

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = bcrypt.compareSync(password, store.hashed_password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Store credentials" });
    }

    // Successful login
    res.status(200).json({ message: "Login successful", storeId: store.email });
  } catch (error) {
    console.error("Error logging in Store:", error);
    res.status(500).json({ error: "Error logging in Store" });
  }
});

//FETCH CURRENTLY LOGGED IN STORE -------------------------------------------------------------------------------------------------------------
app.get("/getStoreInfo", async (req, res) => {
  const { email } = req.query;

  try {
    const storeQuery = `
      SELECT * 
      FROM stores
      WHERE email = $1`;

    const storeResult = await db.query(storeQuery, [email]);
    res.status(200).json(storeResult.rows[0]);
  } catch (error) {
    console.error("Error fetching store info:", error);
    res.status(500).json({ error: "Error fetching store info" });
  }
});
//REGISTER STORES -------------------------------------------------------------------------------------------------------------
app.post("/store-register", async (req, res) =>{
  console.log("Received Store Registration Request: ", {
    storeName: req.body.storeName,
    storeAddress: req.body.storeAddress,
    googleId: req.body.storeId,
    email: req.body.email
  });
  const { storeName, storeAddress, googleId, email, password } = req.body;

  try {
    //Check if store email is already in DB
    const emailCheckQuery = "SELECT * FROM stores WHERE email = $1";
    const emailCheckResult = await db.query(emailCheckQuery, [email]);

    if (emailCheckResult.rows.length > 0) {
      // Email already exists, return an error
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashed_password = bcrypt.hashSync(password, 10);
 
    const query = `
      INSERT INTO stores (store_name, store_address, google_id, email, hashed_password)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id`;
    const values = [storeName, storeAddress, googleId, email, hashed_password];
    const result = await db.query(query, values);

    res.status(201).json({ storeId: result.rows[0].id, Info: result.rows[0] });
  } catch (error) {
    console.error("Error registering store:", error);
    res.status(500).json({ error: "Error registering store" });
  }
})

//VERIFY STORE IS REGISTERED ---------------------------------------------------------------------------------------
app.get("/checkRegisteredShop", async (req, res) => {
  const { place_id } = req.query;

  try {
    const shopQuery = `SELECT * FROM stores WHERE google_id = $1`;
    const result = await db.query(shopQuery, [place_id]);

    if (result.rows.length > 0) {
      res.json({ isRegistered: true, id: result.rows[0].id });
    } else {
      res.json({ isRegistered: false });
    }
  } catch (error) {
    console.error("Error checking shop:", error);
    res.status(500).json({ error: "Error checking shop" });
  }
});

//ORDERS --------------------------------------------------------------------------------------------------------------------
app.post("/placeOrder", async (req, res) => {
  try {
    const { userId, items, storeId, storeInfo } = req.body;

    const orderQuery = `
      INSERT INTO orders (user_id, created_at, store_id, storeInfo)
      VALUES ($1, CURRENT_TIMESTAMP, $2, $3)
      RETURNING id, created_at`;

    const orderValues = [userId, storeId, JSON.stringify(storeInfo)];
    const orderResult = await db.query(orderQuery, orderValues);
    const { id: orderId, created_at: created_at } = orderResult.rows[0];

    // Insert items into the order_items table
    const itemQueries = items.map((item) => {
      return db.query(
        `
        INSERT INTO order_items (order_id, coffee_type, size, price, extras)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [
          orderId,
          item.coffee_type,
          item.size,
          parseFloat(item.price),
          JSON.stringify(item.extras),
        ]
      );
    });

    await Promise.all(itemQueries);

    // Commit the transaction
    await db.query("COMMIT");

    res.status(201).json({ orderId });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Error placing order" });
  }
});

//QUERY ORDERS FOR A USER -----------------------------------------------------------------------------------------------------------
app.get("/userOrders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Query to fetch orders by user ID
    const ordersQuery = `
      SELECT * 
      FROM orders
      WHERE user_id = $1`;

    const ordersResult = await db.query(ordersQuery, [userId]);

    // Query to fetch related order items for each order
    const itemQueries = ordersResult.rows.map((order) => {
      return db.query(
        `
      SELECT 
      orders.id AS order_id,
      orders.created_at AS order_created_at,
      order_items.id AS item_id,
      order_items.coffee_type,
      order_items.size,
      order_items.price,
      order_items.extras
  FROM 
      orders
  JOIN
      order_items ON orders.id = order_items.order_id
        WHERE order_id = $1
      `,
        [order.id]
      );
    });

    const itemsResults = await Promise.all(itemQueries);

    // Combining orders with their respective items
    const userOrders = ordersResult.rows.map((order, index) => {
      return {
        ...order,
        items: itemsResults[index].rows,
      };
    });

    res.status(200).json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Error fetching user orders" });
  }
});

// QUERY ORDERS FOR A STORE -----------------------------------------------------------------------------------
app.get("/storeOrders/:storeId", async (req, res) => {
  try {
    const {storeId} = req.params;
    //Query orders by storeId
    const ordersQuery = `
    SELECT * 
    FROM orders
    WHERE store_id = $1`;

  const ordersResult = await db.query(ordersQuery, [storeId]);

      // Query to fetch related order items for each order
      const itemQueries = ordersResult.rows.map((order) => {
        return db.query(
          `
        SELECT 
        orders.id AS order_id,
        orders.created_at AS order_created_at,
        order_items.id AS item_id,
        order_items.coffee_type,
        order_items.size,
        order_items.price,
        order_items.extras
    FROM 
        orders
    JOIN
        order_items ON orders.id = order_items.order_id
          WHERE order_id = $1
        `,
          [order.id]
        );
      });
  
      const itemsResults = await Promise.all(itemQueries);
  
      // Combining orders with their respective items
      const storeOrders = ordersResult.rows.map((order, index) => {
        return {
          ...order,
          items: itemsResults[index].rows,
        };
      });
      res.status(200).json(storeOrders);
      } catch (error) {
        console.error("Error fetching store orders:", error);
        res.status(500).json({ error: "Error fetching store orders" });
      }
});

//TRACK ORDERS PER MONTH ----------------------------------------------------------------------
app.get('/ordersPerMonth', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        DATE_TRUNC('month', created_at) as month,
        COUNT(*)
      FROM
        orders
      GROUP BY
        month
      ORDER BY
        month ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching monthly order data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//TRACK PRICE PER ORDER
app.get("/pricePerOrder", async (req, res) => {
  const { storeId } = req.query; // Get the storeId from the query parameters
  try {
    const query = `
      SELECT orders.id AS order_id, SUM(order_items.price) AS order_total
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      WHERE orders.store_id = $1
      GROUP BY orders.id
      ORDER BY orders.id;
    `;

    const result = await db.query(query, [storeId]);
    res.json(result.rows);

  } catch (error) {
    console.error("Error fetching price per order:", error);
    res.status(500).json({ error: "Error fetching price per order" });
  }
});


