const express = require('express');
const path = require('path');
const fs = require('fs');
const generateUniqueId = require('generate-unique-id');
const { readAndAppend, readFromFile, deleteFromFile } = require('./helpers/fsUtils');
const PORT = process.env.port || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Delete route for note
app.delete('/api/notes/:id', (req, res) => {
    deleteFromFile(req.params.id, './db/db.json');
    res.sendFile(path.join(__dirname, '/public/notes.html'))
  });

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting notes
app.post('/api/notes', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    const randomNum = generateUniqueId({
        length: 32,
        useLetters: false
    });
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
        id: randomNum,
      };
  
      readAndAppend(newNote, './db/db.json');
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      res.json(response);
    } else {
      res.json('Error in posting note');
    }
  });





app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
