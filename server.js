const express = require('express');
const path = require('path');
const { addAbortSignal } = require('stream');
const fs = require('fs');
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data))
        }
    });
});

app.post('/api/notes', (req, res) => {
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        // Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Convert string into JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new review
                parsedNotes.push(newNote);

                // Write updated reviews back to the file
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated notes!')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        // console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting review');
    }
});

// DELETE Route for a particular note
app.delete('/api/notes/:id', (req, res) => {
    // let params = req.params;
    console.log(`${req.method} request received to add a review`);
    const noteId  = req.params.id;
    console.log("Note ID here : " + noteId);
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);


// fs.readFile('./db/db.json', 'utf8', (err, data) => {
    //     if (err) {
    //         console.error(err);
    //     } else {
    //         for (let x = 0; x < data.length; x++) { 
    //             console.log("inside for loop" + data[x].note_id);
    //             if (noteId === data[x].note_id) { 
                    
    //                 console.log("1 : " + noteId + "2 : " + data[x].note_id)
    //             }
    //         }
    //         // const parsedNotesArray = JSON.parse(data);
    //         // parsedNotesArray = parsedNotesArray.filter((note) => note.note_id !== noteId);
    //         // console.log("Here" + newNoteArray);
    //         // fs.writeFile(
    //         //     './db/db.json',
    //         //     JSON.stringify(newNoteArray, null, 4),
    //         //     (writeErr) =>
    //         //         writeErr
    //         //             ? console.error(writeErr)
    //         //             : console.info('Successfully updated notes!')
    //         // );
    //         // res.json(JSON.parse(newNoteArray))
    //     }
    // });