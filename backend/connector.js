const dotenv = require("dotenv");
const mongoose = require('mongoose');
const { bookMovieSchema } = require('./schema');
const MongoUrl= "mongodb+srv://Srijani:ninja1234@cluster0.9xu32xd.mongodb.net/ninjamovies";

mongoose.connect(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { 
        console.log("connection established with mongodb server online"); 
    })
    .catch(err => {
        console.log("error while connection", err)
    });
let connection = mongoose.model('bookings', bookMovieSchema)

exports.connection = connection;
