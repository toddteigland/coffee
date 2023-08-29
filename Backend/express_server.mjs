import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { db, connectToDatabase } from "./db/connection.cjs"; // Import the default export
import bcrypt from "bcryptjs";
import { log } from "console";

const app = express();
const port = 8080; // Replace with the desired port number
// const bcrypt = require("bcryptjs");

app.use(bodyParser.json());

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
  const apiKey = "AIzaSyAnpVMayNLao-lvX0H3_rOl-MbjcKAuaCw"; // Replace with your Maps API key

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&keyword=${keyword}&key=${apiKey}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
    console.log("Data = ", response.data);
  } catch (error) {
    console.error("Error fetching coffee shop data:", error.message);
    res.status(500).json({ error: "Error fetching coffee shop data" });
  }
});

// Start the server -------------------------------------------------------------------------------------------------------------
async function startServer() {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

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
    res.status(200).json({ message: "Login successful", userId: user.email });
  } catch (error) {
    console.error("Error logging in User:", error);
    res.status(500).json({ error: "Error logging in User" });
  }
});

// STORE LOGIN ------------------------------------------------------------------------------------------------------
app.post("/store-login", async (req, res) => {
  const { email, password } = req.body;
  console.log("STORE LOGIN REQ BODY: ", req.body);

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
    email: req.body.email
  });
  const { storeName, storeAddress, email, password } = req.body;

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
      INSERT INTO stores (store_name, store_address, email, hashed_password)
      VALUES ($1,$2,$3,$4)
      RETURNING id`;
    const values = [storeName, storeAddress, email, hashed_password];
    const result = await db.query(query, values);

    res.status(201).json({ storeId: result.rows[0].id });
  } catch (error) {
    console.error("Error registering store:", error);
    res.status(500).json({ error: "Error registering store" });
  }
})


//ORDERS --------------------------------------------------------------------------------------------------------------------
app.post("/placeOrder", async (req, res) => {
  try {
    const { userId, items, storeInfo } = req.body;

    const orderQuery = `
    INSERT INTO orders (user_id, created_at, storeInfo)
    VALUES ($1, CURRENT_TIMESTAMP, $2)
    RETURNING id`;

    const orderValues = [userId, JSON.stringify(storeInfo)];
    const orderResult = await db.query(orderQuery, orderValues);
    const orderId = orderResult.rows[0].id;

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
app.get('/store-dashboad/:storeId'), async (req, res) => {
  try {
    const {storeId} = req.params;

    //Query orders by storeId
    const ordersQuery = `
    SELECT * 
    FROM orders
    WHERE user_id = $1`;

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
}