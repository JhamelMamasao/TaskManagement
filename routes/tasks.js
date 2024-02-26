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


//Register Task
router.post('/task/register', authenticateToken, async (req, res) => {
  const { title, description, due_date, user_id, priority_id, status_id } = req.body;

  try {
    const insertTaskQuery = 'INSERT INTO tasks (title, description, due_date, user_id, priority_id, status_id) VALUES (?, ?, ?, ?, ?, ?)';

    await db.promise().execute(insertTaskQuery, [title, description, due_date, user_id, priority_id, status_id]);
    res.status(201).json({ message: 'Task registered successfully' });

  } catch (error) {
    console.error('Error registering task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



//Get All Tasks
router.get('/tasks', authenticateToken, (req, res) => {

  try{
    db.query('SELECT id, title, description, due_date, user_id, priority_id, status_id, created_at, updated_at FROM tasks', (err, result) => {

      if (err) {
        console.error('Error fetching items: ', err);
        res.status(500).json({message: 'Internal Server Error'});
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading tasks:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});



//Get 1 Task
router.get('/task/:id', authenticateToken, (req, res) => {
  let task_id = req.params.id;

  if (!task_id) {
    return res.status(400).send({ error: true, messsage: 'Please provide task_id'});
  }

  try {
    db.query('SELECT id, title, description, due_date, user_id, priority_id, status_id, created_at, updated_at FROM tasks WHERE id = ?', task_id, (err, result) => {

      if (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Internal Server Error'});
      
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
     console.error('Error loading task:', error);
     res.status(500).json({ error: 'Internal Server Error'});
  }
});


//Update Task
router.put('/task/:id', authenticateToken, async (req, res) => {

  let task_id =req.params.id;

  const {title, description, due_date, user_id, priority_id, status_id} = req.body;
  
  if (!title || !description || !due_date || !user_id || !priority_id || !status_id) {
    return res.status(400).send({ error: user, message: 'Please provide title, description, due_date, user_id, priority_id and status_id' });
  }
  
  try {
    db.query('UPDATE tasks SET title = ?, description = ?, due_date = ?, user_id = ?, priority_id = ?, status_id = ? WHERE id = ?', [title, description, due_date, user_id, priority_id, status_id, task_id], (err, result, fields) => {
      if (err) {
        console.error('Error updating item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading task:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});



//Delete Task
router.delete('/task/:id', authenticateToken, (req, res) => {
  let task_id = req.params.id;
  if (!task_id) {
    return res.status(400).send({ error: true, message: 'Please provide task_id' });
  }
  try {
    db.query('DELETE FROM tasks WHERE id = ?', task_id, (err, result, fields) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;