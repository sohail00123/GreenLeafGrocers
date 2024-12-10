const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(express.json());

// Serve static files (HTML, JS, CSS)
app.use(express.static('public'));

// Endpoint to get inventory data
app.get('/data/inventory.json', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'inventory.json');
  
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading inventory file:', err);
      res.status(500).send('Failed to load inventory');
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
});

// Endpoint to save inventory data
app.post('/data/inventory.json', (req, res) => {
    const inventory = req.body;
    const filePath = path.join(__dirname, 'data', 'inventory.json');
  
    fs.writeFile(filePath, JSON.stringify(inventory, null, 2), (err) => {
      if (err) {
        console.error('Error saving inventory:', err);
        res.status(500).send('Failed to save inventory');
      } else {
        console.log('Inventory saved successfully!');
        res.status(200).send('Inventory saved successfully!');
      }
    });
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });