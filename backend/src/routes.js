const express = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors')
app.use(cors())
const {Bookings } = require("./connector");
const Schema = require("./schema");
const router = express.Router();

//creating post api
  
router.post('/bookings', async(request, response) => {
    response.send("Input Booking");
});

//creating get api

router.get('/bookings', async(request, response) => {
    response.send("Show Booking");
});

//creating delete api

router.delete('/bookings', async(request, response) => {
    response.send("Booking Deleted");
});

module.exports = router;