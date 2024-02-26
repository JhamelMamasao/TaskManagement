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


router.post('/attachments/register', authenticateToken, async (req, res) => {
  const { file_name, file_path, task_id } = req.body;

  try {
    const insertAttachmentQuery = 'INSERT INTO task_attachments (file_name, file_path, task_id) VALUES (?, ?, ?)';

    await db.promise().execute(insertAttachmentQuery, [file_name, file_path, task_id]);
    res.status(201).json({ message: 'File attached successfully' });

  } catch (error) {
    console.error('Error attaching file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/attachments', authenticateToken, (req, res) => {

  try{
    db.query('SELECT id, file_name, file_path, task_id FROM task_attachments', (err, result) => {

      if (err) {
        console.error('Error fetching items: ', err);
        res.status(500).json({message: 'Internal Server Error'});
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading attachments:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});




router.get('/attachments/:id', authenticateToken, (req, res) => {
  let attachment_id = req.params.id;

  if (!attachment_id) {
    return res.status(400).send({ error: true, messsage: 'Please provide attachment_id'});
  }

  try {
    db.query('SELECT id, file_name, file_path, task_id FROM task_attachments WHERE id = ?', attachment_id, (err, result) => {

      if (err) {
        console.error('Error fetching items:', err);
        res.status(500).json({ message: 'Internal Server Error'});
      
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
     console.error('Error loading attachment:', error);
     res.status(500).json({ error: 'Internal Server Error'});
  }
});



router.delete('/attachments/:id', authenticateToken, (req, res) => {

  let attachment_id = req.params.id;

  if (!attachment_id) {
    return res.status(400).send({ error: true, message: 'Please provide attachment_id' });
  }
  try {
    db.query('DELETE FROM task_attachments WHERE id = ?', attachment_id, (err, result, fields) => {
      if (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        res.status(200).json(result);
      }
    });
  } catch (error) {
    console.error('Error loading comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;