const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs')
const usersController = require('./controllers/users');
const expressSession = require('express-session')
const authController = require('./controllers/index')


const methodOverride = require("method-override")
app.use(methodOverride("_method"))

app.use(express.urlencoded({
    extended: false
}));

SECRET = 'jakdsjf'
app.use(expressSession({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))



app.use(express.static('public'));

app.use('/', authController)
app.use('/', usersController)




// Express web server
app.listen(port, () => {
    console.log(`listening on port`, port)
});

// //             <% for(let i = 2; i < races.length; i++) { %>
// <td><%= races[i].track.name %></td>
// <% } %>