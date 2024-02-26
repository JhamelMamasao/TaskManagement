const authenticateToken = require('../config/authenticateToken');
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const secretKey = require("../config/secretKey");

function getSecretKey() {
  return secretKey;
}

const db = require('../config/database');

const router = express.Router();


router.use(bodyParser.json());


router.get('/status', authenticateToken, (req, res) => {

  try{
    db.query('SELECT id, status FROM status', (err, result) => {

      if (err) {
        console.error('Error fetching items: ', err);
        res.status(500).json({message: 'Internal Server Error'});
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading status:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});



router.get('/status/:id', authenticateToken, (req, res) => {
  let status_id = req.params.id;

  if (!status_id) {
    return res.status(400).send({ error: true, messsage: 'Please provide status_id'});
  }

  try {
    db.query('SELECT id, status FROM status WHERE id = ?', status_id, (err, result) => {

      if (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Internal Server Error'});
      
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
     console.error('Error loading status:', error);
     res.status(500).json({ error: 'Internal Server Error'});
  }
});


module.exports = router;