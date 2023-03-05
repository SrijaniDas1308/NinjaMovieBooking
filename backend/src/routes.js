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
  
router.post("/booking", async (req, res) => {
    const { movie, slot, seats } = req.body;
    const myData = new Schema({ movie, slot, seats });
    const saved = await myData.save();
    const status = saved ? 200 : 500;
    const message = saved ? "Booking successful!" : "Something went wrong!. Please try again.";
    res.status(status).json({ data: myData, message });
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