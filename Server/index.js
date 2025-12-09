const express = require('express');
const app = express();
const port = 5000;

const guests = [
  { name: "Max", phone: "+7" },
  { name: "Anna", phone: "+7926" },
  { name: "Igor", phone: "+7951" }
];

const cors = require('cors');
app.use(cors());

app.get('/guest-list', (req, res) => {
 return res.status(200).json({ data: guests });})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});