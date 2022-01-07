const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const { getAllUsers } = require('./database');
const cors = require('cors');
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const hostname = '127.0.0.1';
const port = process.env.PORT || 8000;
const Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control_Allow-Headers', "x-access token, Origin, Content-Type, Accept");
    res.setHeader("x-access-token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTYzNjQ5MTkyNzA5MiIsImVtYWlsIjoiY0BjIiwiaWF0IjoxNjM2NDkxOTI3LCJleHAiOjE2MzY0OTkxMjd9.3nKmcqEh9NSx8qLX-OaVjOqIeTSBFk4BjQxELrQf1O4");
    next();
})

app.use(require('./routes'));

const getAllAccount = async () => {
    var account = await web3.eth.getAccounts();
    console.log(account[0]);
}

const createAccount = async() => {
    
}

getAllAccount();

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});