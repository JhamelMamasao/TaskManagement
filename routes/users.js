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


//Get All Users
router.get('/users', authenticateToken, (req, res) => {

  try{
    db.query('SELECT id, name, username FROM users', (err, result) => {

      if (err) {
        console.error('Error fetching items: ', err);
        res.status(500).json({message: 'Internal Server Error'});
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading users:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});


//Get User
router.get('/user/:id', authenticateToken, (req, res) => {
  let user_id = req.params.id;

  if (!user_id) {
    return res.status(400).send({ error: true, messsage: 'Please provide user_id'});
  }

  try {
    db.query('SELECT id, name, username FROM users WHERE id = ?', user_id, (err, result) => {

      if (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Internal Server Error'});
      
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
     console.error('Error loading user:', error);
     res.status(500).json({ error: 'Internal Server Error'});
  }
});


//Update User
router.put('/user/:id', authenticateToken, async (req, res) => {

  let user_id =req.params.id;

  const {name, username, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  if (!user_id || !name || !username || !password) {
    return res.status(400).send({ error: user, message: 'Please provide name, username and password' });
  }
  
  try {
    db.query('UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?', [name, username, hashedPassword, user_id], (err, result, fields) => {
      if (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading user:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});


//Delete User
router.delete('/user/:id', authenticateToken, (req, res) => {
  let user_id = req.params.id;
  if (!user_id) {
    return res.status(400).send({ error: true, message: 'Please provide user_id' });
  }
  try {
    db.query('DELETE FROM users WHERE id = ?', user_id, (err, result, fields) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

    module.exports = router;