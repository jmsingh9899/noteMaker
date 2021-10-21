const notes = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


// const writeToFile = (destination, content) =>
//     fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
//         err ? console.error(err) : console.info(`\nData written to ${destination}`)
//     );
// const readAndAppend = (content, file) => {
//     fs.readFile(file, 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//         } else {
//             const parsedData = JSON.parse(data);
//             parsedData.push(content);
//             writeToFile(file, parsedData);
//         }
//     });
// };

// const readAndRemove = (content, file) => {
//     fs.readFile(file, 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//         } else {
//             console.log('hello')
//             const parsedData = JSON.parse(data);
//             parsedData.splice(content, 1);
//             writeToFile(file, parsedData);
//         }
//     });
// };
const notesy = require('../db/notes.json');


notes.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '../db/notes.json')));


notes.post('/', (req, res) => {
    console.log(req.body);
    const { title, text } = req.body;
    console.log(title);
    if (req.body) {
        const newerNote = {
            title,
            text,
            id: uuidv4(),
        }
        notesy.push(newerNote);
        fs.writeFileSync( path.join(__dirname, '../db/notes.json'), JSON.stringify(notesy, null, 4));
        return res.json('ok');
    } else {
        res.json("notes not being retrieved from front end.")
    }

});
notes.delete(`/:id`, (req, res) => {
    if (req.params.id) {
        console.log("Deleting Note " + req.params.id);
        const remover = notesy.findIndex((note)=>note.id === req.params.id);
        notesy.splice(remover, 1);
        fs.writeFileSync( path.join(__dirname, '../db/notes.json'), JSON.stringify(notesy, null, 4));
        return res.json('deleted');
        // readAndRemove(req.params.id, path.join(__dirname, '../db/notes.json'))
    } else {
        res.status(400).send("Please specify a noteId");
    }

});
module.exports = notes;