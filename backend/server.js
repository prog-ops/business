import 'dotenv/config.js'
import express from "express";
import cors from "cors"
import axios from "axios";

const app = express();
const port =
    process.env.PORT ||
    3001;

app.use(cors()); // Enable CORS for all routes

const apiKey = process.env.YELP_API_KEY;
const apiUrl = process.env.YELP_API_URL;

// Define proxy route
app.get('/api/yelp', async (req, res) => {
    try {
        const { offset = 0, limit = 10, term = '' } = req.query; // Default values if not provided

        // Request to Yelp API
        const response = await axios.get(apiUrl, {
            params: {
                location: 'san fransisco',
                sort_by: 'best_match',
                limit,
                offset,
                term // search by term
            },
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        });
        // Send response data back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).send(error.toString());
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
