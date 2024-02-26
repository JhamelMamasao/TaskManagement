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


router.get('/priority', authenticateToken, (req, res) => {

  try{
    db.query('SELECT id, priority FROM priority', (err, result) => {

      if (err) {
        console.error('Error fetching items: ', err);
        res.status(500).json({message: 'Internal Server Error'});
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading priority:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});



router.get('/priority/:id', authenticateToken, (req, res) => {
  let priority_id = req.params.id;

  if (!priority_id) {
    return res.status(400).send({ error: true, messsage: 'Please provide priority_id'});
  }

  try {
    db.query('SELECT id, priority FROM priority WHERE id = ?', priority_id, (err, result) => {

      if (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Internal Server Error'});
      
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
     console.error('Error loading priority:', error);
     res.status(500).json({ error: 'Internal Server Error'});
  }
});


module.exports = router;