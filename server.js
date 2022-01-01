const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send("<h1>my app on heroku!</h1>")
});

app.listen(PORT, () => {
    console.log(`Start serwera na porcie ${PORT}`);
});