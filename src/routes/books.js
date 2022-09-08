const express = require('express');
const bookRoutes = express.Router();


bookRoutes.post('/', (req, res) => {
    res.send('Books Page');
});


bookRoutes.post('/add', (req, res) => {
    res.send('Add new book');
});


bookRoutes.delete('/delete', (req, res) => {
    res.send('Delete a book');
});


bookRoutes.post('/loan_out', (req, res) => {
    res.send('Loan out book');
});


bookRoutes.post('/return', (req, res) => {
    res.send('Return book');
});

bookRoutes.put('/update', (req, res) => {
    res.send('Update book');
});




module.exports = bookRoutes;