const mongoose = require('mongoose');

const url = "mongodb://127.0.0.1:27017/E-Commerce";

mongoose
  .connect(url)
  .then(() => console.log("Connection SuccessFull"))
  .catch((err) => console.error(err));

