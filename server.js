const express = require('express');
const app = express();
const fs = require('fs')
const usersController = require('./controllers/users');
const expressSession = require('express-session')
const authController = require('./controllers/index')
require('dotenv').config();

const methodOverride = require("method-override")
app.use(methodOverride("_method"))

const {PORT=3000, SECRET} = process.env

app.use(express.urlencoded({
    extended: false
}));

app.use(expressSession({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))



app.use(express.static('public'));

app.use('/', authController)
app.use('/', usersController)




// Express web server
app.listen(PORT, () => {
    console.log(`listening on port`)
});

// //             <% for(let i = 2; i < races.length; i++) { %>
// <td><%= races[i].track.name %></td>
// <% } %>