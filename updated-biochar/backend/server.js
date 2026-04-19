const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (status, res) => {
  res.status(200).json({ status: 'GreenASHA Biochar Backend is running' });
});

// Placeholder for biochar data API
app.get('/api/biochar-info', (req, res) => {
  res.json({
    project: "GreenASHA Biochar Explainer",
    version: "1.0.0",
    description: "Engineering permanence from agricultural residues."
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
