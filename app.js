// app.js

// Required Modules
const express = require('express');
const qr = require('qr-image');
const fs = require('fs');

// Initialize Express App
const app = express();

// Set up middleware for parsing JSON and URL encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the template engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Define a route to render the form
app.get('/', (req, res) => {
    res.render('index');
});

// Define a route to generate QR code
app.post('/generateQR', (req, res) => {
    const url = req.body.url; // Get URL from form input

    if (!url) {
        return res.status(400).send('URL parameter is missing');
    }

    // Generate QR code
    const qr_svg = qr.image(url, { type: 'svg', size: 20 });

    // Convert QR code SVG to HTML
    let qrHtml = '';
    qr_svg.on('data', chunk => {
        qrHtml += chunk;
    });

    qr_svg.on('end', () => {
        // Return the QR code as a string
        res.send(qrHtml);
    });
});

// Serve static files
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
