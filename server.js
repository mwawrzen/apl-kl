const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const me = {
  imie: 'Michał',
  nazwisko: 'Wawrzeń',
  klasa: '3i2',
  grupa: 'a'
};

app.get('/', (req, res) => {
    res.send('<h1>my app on heroku!</h1>');
});

app.get('/data', (req, res) => {
  res.send(me);
});

app.listen(PORT, () => {
    console.log(`Start serwera na porcie ${PORT}`);
});
