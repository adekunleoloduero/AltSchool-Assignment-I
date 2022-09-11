const express = require('express');
const booksRoute = express.Router();


booksRoute.get('/', (req, res) => {
    res.send('Books Page');
});


booksRoute.post('/create', (req, res) => {
    res.send('Add new book');
});


booksRoute.delete('/delete', (req, res) => {
    res.send('Delete a book');
});


booksRoute.post('/loan_out', (req, res) => {
    res.send('Loan out book');
});


booksRoute.post('/return', (req, res) => {
    res.send('Return book');
});

booksRoute.put('/update', (req, res) => {
    res.send('Update book');
});




module.exports = booksRoute;