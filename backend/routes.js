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
  
  router.get("/booking", async (req, res) => {
    const myData = await Schema.find().sort({ _id: -1 }).limit(1);
    const status = myData.length === 0 ? 200 : 200;
    const message = myData.length === 0 ? "No previous Booking found!" : undefined;
    res.status(status).json({ data: myData[0] || null, message });
  });

  //creating delete api
  
  router.delete('/booking', async (req, res) => {
    const deleted = await Schema.deleteMany();
    const message = deleted.deletedCount > 0 ? 'All bookings deleted successfully!' : 'No bookings found to delete.';
    res.status(deleted.deletedCount > 0 ? 200 : 404).json({ data: deleted, message });
  });

module.exports = router;