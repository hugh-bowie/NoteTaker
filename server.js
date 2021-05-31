// Dependencies
const fs = require('fs');
const uuid = require('uuid');
const express = require('express');
const path = require('path');

// database
const database = require('./db/db.json');

// port and express
const app = express();
const PORT = process.env.PORT || 8080;

// parse info
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));
app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/../db/db.json')));

// saving new notes
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', "utf8", function (err, data) {
        if (err) throw err;

        data = JSON.parse(data);

        let noteAdd =
        {
            title: req.body.title,
            text: req.body.text,
            id: uuid.v4()
        }

        var myNote = data.concat(noteAdd);

        fs.writeFile('./db/db.json', JSON.stringify(myNote), function (err) {
            if (err) return console.log(err);
            console.log("Note saved");
        });

    });

    res.json(data);
});

//BONUS DELETE NOTE
app.delete('/api/notes/:id', (req, res) => {

    let currentId = parseInt(req.params.id);

    for (let i = 0; i < database.length; i++) {
        let dbId = database[i].id;

        if (dbId === currentId) {
            database.splice(i, 1);
        }
    }

    fs.writeFile('./db/db.json', JSON.stringify(database), (err) =>
        err ? console.log(err) : console.log('Note deleted.'));

    res.json(database);
});

// start server
app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
});
