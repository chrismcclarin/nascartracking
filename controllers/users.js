const express = require('express');
const usersRouter = express.Router();
const fs = require('fs')
const users = JSON.parse(fs.readFileSync('./models/users.js'))

usersRouter.get('/login', (req, res) => {
    res.render('login.ejs', {error: ''});
});

usersRouter.post('/login', (req, res) => {
    let sessionuser = users.find(user => user.name == req.body.name && user.password == req.body.password)
    let index = users.indexOf(sessionuser)
    if (sessionuser.name != req.body.name) return res.render('login.ejs', {error: 'Invalid Credentials'});
    if (sessionuser.password != req.body.password) return res.render('login.ejs', {error: 'Invalid Credentials'});
    req.session.user = index;
    res.redirect('/');
});

usersRouter.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

usersRouter.post('/signup', (req, res) => {
    users.push(req.body)
    let index = users.length - 1
    users[index]['points'] = 0
    users.sort((a, b) => { 
        return b.name < a.name ?  1 
             : b.name > a.name ? -1 
             : 0;                   
    });
    fs.writeFileSync('./models/users.js', JSON.stringify(users, null, 2))
    res.redirect('/login')
})

// Logout Routes
usersRouter.get('/logout', (req, res) => {
    req.session.destroy(function() {
        res.redirect('/');
    });
});

module.exports = usersRouter;

// app.get("/signup", (req, res) => {
//     res.render("signup.ejs");
// });

// app.get("/signin", (req, res) => {
//     res.render("signin.ejs");
// });

// // delete route
// app.delete("/:userindex", (req, res) => {
//     users.splice(req.params.userindex, 1)
//     fs.writeFileSync('./models/users.js', JSON.stringify(users, null, 2))
//     res.redirect("/")
// })

// // update route
// app.put('/:userindex', (req, res) => {
//     users[req.params.userindex] = req.body;
//     fs.writeFileSync('./models/users.js', JSON.stringify(users, null, 2))
//     res.redirect('/');
// })

// // post route
// app.post('/', (req, res) => {
//     users.push(req.body)
//     fs.writeFileSync('./models/users.js', JSON.stringify(users, null, 2))
//     res.redirect('/')
// })