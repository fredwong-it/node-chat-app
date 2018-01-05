const path = require('path');
const express = require('express');

// this will resolve \node-chat-app\server/../public to \node-chat-app\public
const publicPath = path.join(__dirname, '../public');
//console.log(__dirname + '../public');
//console.log(publicPath);

const port = process.env.PORT || 3000

var app = express();

app.use(express.static(publicPath));


app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

