const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    productName : String,
    price : String,
    category : String,
    company : String,
    userID : String
});

module.exports = mongoose.model('products', productSchema, 'products');