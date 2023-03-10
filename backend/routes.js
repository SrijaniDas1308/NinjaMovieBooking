const express = require('express');
const app = express();
app.use(express.json());
const { connection } = require('./connector');
const router = express.Router();

//Creating get api
router.get('/api/booking', async (req, res) => {
    const data = await connection.find().exec();
    return res.status(200).send(data[data.length - 1]);
  });

//Creating delete api
router.delete('/api/booking', async (req, res) => {
  await connection.deleteMany();
  return res.send('Previous data deleted successfully');
});

module.exports = router;