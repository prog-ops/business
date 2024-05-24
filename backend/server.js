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
const apiUrlDetail = process.env.YELP_API_URL_DETAIL;

// Define proxy route
app.get('/api/yelp', async (req, res) => {
    try {
        const {
            offset = 0,
            limit = 10,
            term = '',
            categories = '',
            price
        } = req.query; // Default values if not provided

        // Create params object and add only non-empty values
        const params = {
            location: 'san francisco',
            sort_by: 'best_match',
            limit,
            offset,
            // term, // search by term
            // Filter by categories and price
            // categories,
            // price
        };
        if (term) params.term = term;
        if (categories) params.categories = categories;
        if (price) params.price = price;

        // Request to Yelp API
        const response = await axios.get(apiUrl, {
            params: params,
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

// Route to fetch business details by ID
app.get('/api/yelp/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`${apiUrlDetail}/${id}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching business detail:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.toString() });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});
