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

router.post('/assign/register', authenticateToken, async (req, res) => {
  const { user_id, task_id} = req.body;

  try {
    const insertAssignQuery = 'INSERT INTO task_assignees (user_id, task_id) VALUES (?, ?)';

    await db.promise().execute(insertAssignQuery, [user_id, task_id]);
    res.status(201).json({ message: 'Task assigned successfully' });

  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/assign', authenticateToken, (req, res) => {

  try{
    db.query('SELECT id, user_id, task_id FROM task_assignees', (err, result) => {

      if (err) {
        console.error('Error fetching items: ', err);
        res.status(500).json({message: 'Internal Server Error'});
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading assignees:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});



router.get('/assign/:id', authenticateToken, (req, res) => {
  let assign_id = req.params.id;

  if (!assign_id) {
    return res.status(400).send({ error: true, messsage: 'Please provide assign_id'});
  }

  try {
    db.query('SELECT tasks.id, tasks.title, tasks.description, users.id, users.name FROM task_assignees JOIN tasks ON tasks.id = task_assignees.task_id JOIN users ON users.id = task_assignees.user_id WHERE tasks.id = ?', assign_id, (err, result) => {

      if (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Internal Server Error'});
      
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
     console.error('Error loading assigned task:', error);
     res.status(500).json({ error: 'Internal Server Error'});
  }
});




router.put('/assign/:id', authenticateToken, async (req, res) => {

  let assign_id =req.params.id;

  const {user_id, task_id} = req.body;
  
  if (!user_id || !task_id) {
    return res.status(400).send({ error: user, message: 'Please provide user_id and task_id' });
  }
  
  try {
    db.query('UPDATE task_assignees SET user_id = ?, task_id = ? WHERE id = ?', [user_id, task_id, assign_id], (err, result, fields) => {
      if (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading assigned task:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});



router.delete('/assign/:id', authenticateToken, (req, res) => {

  let assign_id = req.params.id;

  if (!assign_id) {
    return res.status(400).send({ error: true, message: 'Please provide assign_id' });
  }
  try {
    db.query('DELETE FROM task_assignees WHERE id = ?', assign_id, (err, result, fields) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading assignees:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;