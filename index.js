const express = require('express');
const cors = require('cors');
const brands = require('./brands.json');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Tech Titan server is running')
})

app.get('/brands', (req, res) => {
    res.send(brands)
})

app.listen(port, ()=> {
    console.log(`Tech Titan server is running on port: ${port}`);
})