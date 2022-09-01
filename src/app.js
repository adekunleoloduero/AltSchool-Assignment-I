const express = require('express');

const PORT = process.env.PORT || 5000;

const app = express();


//Users routes
app.post('/user/create', (req, res) => {

});

app.post('user/authenticate', (req, res) => {

});

app.get('user/getall', (req, res) => {

});


//Books routes
app.post('/book/create', (req, res) => {

});

app.delete('/book/delete', (req, res) => {

});

app.post('/book/loanout', (req, res) => {

});

app.post('/book/return', (req, res) => {

});

app.put('/book/update', (req, res) => {

});


app.listen(PORT, () => console.log(`Server is running and listening to requests at: http://localhost:${PORT}`));

//Start server