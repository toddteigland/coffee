import express from 'express';
import axios from 'axios';


const app = express();
const port = 8080; // Replace with the desired port number

// Allow CORS for requests from localhost:3000
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API endpoint to fetch coffee shop data from Google Places API
app.get('/coffee-shops', async (req, res) => {
  const { lat, lng } = req.query;
  const radius = 8000;
  const type = 'cafe';
  const keyword = 'coffee';
  const apiKey = 'AIzaSyAnpVMayNLao-lvX0H3_rOl-MbjcKAuaCw'; // Replace with your Maps API key

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&keyword=${keyword}&key=${apiKey}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
    console.log("Data = ", response.data);
  } catch (error) {
    console.error('Error fetching coffee shop data:', error.message);
    res.status(500).json({ error: 'Error fetching coffee shop data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});