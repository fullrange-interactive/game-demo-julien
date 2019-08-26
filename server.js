let express = require('express');
let path = require('path');
let fs = require('fs');

const PORT = 4242;

/*
 EXPRESS SERVER
 */
let app = express();

app.use(express.static(path.join(__dirname, '/public')));
app.listen(PORT);