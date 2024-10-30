import express from 'express';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import cors from 'cors'

const app = express();
const csv_parser = csv()
const port = 3000;

app.use(cors({
  origin: 'null'
}))

app.get('/', (req, res) => {
  const results = [];

  createReadStream('NASAMiddleSchoolCSVData.csv') // Replace with your CSV file path
    .pipe(csv_parser)
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});