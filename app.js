const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('express-flash');

const dbConfig = require('./config/db');

// Database
mongoose.connect(dbConfig.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection to MongoDB failed:', err));

// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(session({
  secret: 'secret_key', 
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Routes
const adminRoutes = require('./src/routes/adminRoutes');
const staffRoutes = require('./src/routes/staffRoutes');
const systemRoutes = require('./src/routes/systemRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

app.use('/admin', adminRoutes);
app.use('/staff', staffRoutes);
app.use('/system', systemRoutes);
app.use('/report', reportRoutes);

// Set
app.get('/', (req, res) => {
  res.redirect('/staff/login-staff')
});

app.get('/404', (req, res) => {
  res.redirect('other/404');
});

app.get('*', (req, res) => {
  res.status(404).render('other/404');
});

// Set up the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});