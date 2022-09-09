const express = require('express');
const app = express();
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');




//Routes
app.use('/books', bookRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Home Page');
});


app.get('*', (req, res) => {
    res.send('Page not found');
});




//Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running and listening to requests at: http://localhost:${PORT}`));


module.exports = app;