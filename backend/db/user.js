const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    userName : String,
    email : String,
    password : String
});

module.exports = mongoose.model("users", userSchema, "Users");
