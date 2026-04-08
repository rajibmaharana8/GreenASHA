const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'GreenASHA AI API is running' });
});

// Mock ROI Calculation endpoint
app.post('/api/calculate-roi', (req, res) => {
  const { feedstockType, amountPerDay, electricityCost } = req.body;
  
  // Basic mock calculation logic
  const biocharYield = amountPerDay * 0.3; // 30% yield
  const carbonCredits = biocharYield * 2.5; // 2.5 tCO2e per ton of biochar
  const annualRevenue = (biocharYield * 150 + carbonCredits * 40) * 365; // $150/ton biochar, $40/credit

  
  res.json({
    biocharYield: biocharYield.toFixed(2),
    carbonCredits: carbonCredits.toFixed(2),
    totalAnnualRevenue: annualRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    co2Removed: (carbonCredits * 365).toFixed(0)
  });
});

// Contact/Inquiry endpoint
app.post('/api/contact', (req, res) => {
  console.log('Received inquiry:', req.body);
  res.json({ success: true, message: 'Thank you for your interest. We will contact you soon.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
