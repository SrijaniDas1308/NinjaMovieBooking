const express = require('express');
const app = express();
app.use(express.json());
const { connection } = require('./connector');
const router = express.Router();



//Creating delete api
router.delete('/api/booking', async (req, res) => {
  await connection.deleteMany();
  return res.send('Previous data deleted successfully');
});

module.exports = router;