import express from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import cors from 'cors'

const app = express();
//const csv_parser = csv()

app.use(cors({
  origin: 'null'
}))

app.get('/', (req, res) => {
  const results = [];

  fs.createReadStream('NASAMiddleSchoolCSVData.csv') // Replace with your CSV file path
    .pipe(csv())
    .on('data', (data) => {
      Object.keys(data).forEach((key) => {
        if (data[key] === '') {
          data[key] = 0;
        }
      });
      results.push(data);
    })
    .on('end', () => {
      res.json(results);
    })
    .on('error', (err) => {
      console.log('Error reading CSV file:', err);
      res.status(500).json({ error: 'Internal Server Error' })
    });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});