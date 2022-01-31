const express = require('express');
const app = express();

const path = require('path');
const hbs = require('express-handlebars');
const formidable = require('formidable');

const PORT = 3000; // process.env.PORT ||

const uploadedFiles = [];
let fileId = 1;

// endpoints

app.get('/', (req, res) => {
    res.render('index.hbs', { text: 'multiupload' });
});

app.get('/filemanager', (req, res) => {
    console.log(uploadedFiles)
    res.render('filemanager.hbs', {
        files: uploadedFiles,
        text: 'filemanager',
        url: {
            text: 'usuń dane o plikach z tablicy',
            url: '/reset'
        }
    });
});

app.post('/upload', (req, res) => {
    let form = formidable({});

    form.uploadDir = `${__dirname}/static/uploads/`;
    form.keepExtensions = true;
    form.multiples = true;

    form.parse(req, (err, fields, { files }) => {

        if (!files.length)
            files = [files];

        files.forEach(file => {
            uploadedFiles.push({
                id: fileId,
                image: setImage(file.type),
                name: file.name,
                size: file.size,
                type: file.type,
                path: file.path,
                date: new Date().toLocaleString()
            });
            fileId++;
        });

        res.redirect('/filemanager');
    });
});

app.get('/download', (req, res) => {

    const { file } = req.query;
    const index = uploadedFiles.findIndex(f => f.id === +file);
    const fileObj = uploadedFiles[index];

    res.download(fileObj.path);
});

app.get('/upload', (req, res) => res.redirect('/'));

app.get('/info', (req, res) => {

    const { file } = req.query;

    if (!file)
        return res.render('info.hbs', { text: 'file info' });

    const index = uploadedFiles.findIndex(f => f.id === +file);
    const fileObj = uploadedFiles[index];

    res.render('info.hbs', { file: fileObj, text: 'file info' });
});

app.get('/delete', (req, res) => {

    const { file } = req.query;
    const index = uploadedFiles.findIndex(f => f.id === +file);
    console.log(uploadedFiles);
    uploadedFiles.splice(index, 1);
    

    res.redirect('/filemanager');
});

app.get('/reset', (req, res) => {
    uploadedFiles.length = 0;
    res.redirect('/filemanager');
});

// utils

function setImage(type) {

    let imgSrc = '/imgs/';

    switch (type) {
        case 'text/plain': imgSrc += 'txt.png'; break;
        case 'image/jpg': imgSrc += 'jpg.png'; break;
        case 'image/png': imgSrc += 'png.png'; break;
        default: imgSrc += 'unknown.png';
    }

    return imgSrc;
}

// config

app.use(express.static('static'))
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');

app.listen(PORT, () => {
    console.log(`Start serwera na porcie ${PORT}`);
});
