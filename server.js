const express = require('express');
const app = express();
const path = require('path');
const hbs = require('express-handlebars');

app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const users = [
  { id: 1, username: 'admin', password: '@', age: 100, gender: 'male', student: false }
];

let usersSortedByAgeAsc, usersSortedByAgeDesc, maleUsers, femaleUsers;

const sortUsers = () => {
  usersSortedByAgeAsc = [...users].sort((a, b) => Number(a.age) - Number(b.age));
  usersSortedByAgeDesc = [...users].sort((a, b) => Number(b.age) - Number(a.age));

  maleUsers = users.filter(({ gender }) => gender === 'male');
  femaleUsers = users.filter(({ gender }) => gender === 'female');
};

let isUserLogged = false;
let userSortOrder = true;

let idToAssign = 2;

sortUsers();

app.get('/', (req, res) => res.render('main.hbs'));
app.get('/register', (req, res) => res.render('register.hbs'));
app.get('/login', (req, res) => res.render('login.hbs'));
app.get('/logout', (req, res) => {
  isUserLogged = false;
  res.redirect('/');
});
app.get('/admin', (req, res) => {
  if (isUserLogged)
    res.render('admin.hbs', { layout: 'main-logout.hbs'});
  else
    res.render('admin-cannot.hbs', { layout: 'admin-cannot.hbs'});
});

app.get('/sort', (req, res) => {
  if (!isUserLogged) res.redirect('/admin');
  sortUsers();
  res.render('sort.hbs', {
    asc: userSortOrder,
    desc: !userSortOrder,
    users: userSortOrder ? usersSortedByAgeAsc : usersSortedByAgeDesc,
    layout: 'sort.hbs'
  });
});
app.get('/gender', (req, res) => {
  if (!isUserLogged) res.redirect('/admin');
  sortUsers();
  res.render('gender.hbs', { maleUsers, femaleUsers, layout: 'sort.hbs' });
});
app.get('/show', (req, res) => {
  if (!isUserLogged) res.redirect('/admin');
  res.render('show.hbs', { users, layout: 'sort.hbs' });
});
app.get('/order', (req, res) => {
  if (!isUserLogged || !req.query.order) res.redirect('/admin');
  userSortOrder = JSON.parse(req.query.order);
  res.redirect('/sort');
});

app.post('/register', (req, res) => {

  const { username, password, age, gender, student } = req.body;

  if (
    username.length < 3 ||
    password.length < 3 ||
    age < 0 ||
    !gender
  ) {
    res.redirect('/register');
  }

  const userObj = {
    id: idToAssign++,
    username,
    password,
    age: Number(age),
    gender,
    student: student ? true : false
  };

  users.push(userObj);

  res.send(`Witaj <b>${username}</b>! Jesteś zarejestrowan${gender === 'male' ? 'y' : 'a'}`);
});

app.post('/login', (req, res) => {

  const { username, password } = req.body;

  isUserLogged = users.some(user => {
    return user.username === username && user.password === password;
  });

  res.redirect('/admin');
});

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static('static'));

app.listen(PORT, () => console.log(`Start serwera na porcie ${PORT}`));
