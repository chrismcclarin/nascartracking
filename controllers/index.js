const express = require('express');
const authRouter = express.Router();
const fs = require("fs");
const users = JSON.parse(fs.readFileSync('./models/users.js'))
const dNames = JSON.parse(fs.readFileSync('./models/drivers.js'))
const sched = JSON.parse(fs.readFileSync('./models/schedule.js'))
const fetch = require('node-fetch');


date = new Date().getFullYear()
api_key = '8sjzezj626j7ywkhzyqa6bxu'
race_id = ''

const driversURL = `https://api.sportradar.us/nascar-ot3/mc/${date}/drivers/list.json?api_key=${api_key}`
const pointsURL = `http://api.sportradar.us/nascar-ot3/mc/races/${race_id}/results.json?api_key=${api_key}`
const scheduleURL = `http://api.sportradar.us/nascar-ot3/mc/${date}/races/schedule.json?api_key=${api_key}`

const fetchAPI = async url => {
    const res = await fetch(url)
    const body = await res.json()
    return body
}

async function driversget(URL){
    if(dNames.length != 0){
        dNames.length = 0
    }
    driverNames = await fetchAPI(URL)
    dNames.push(driverNames)
    dNames[0]?.drivers.sort((a, b) => { 
        return b.full_name < a.full_name ?  1 
             : b.full_name > a.full_name ? -1 
             : 0;                   
    });
    fs.writeFileSync('./models/drivers.js', JSON.stringify(dNames, null, 2))
}

async function scheduleget(URL){
    if(sched.length != 0){
        sched.length = 0
    }
    schedule = await fetchAPI(URL)
    sched.push(schedule)
    fs.writeFileSync('./models/schedule.js', JSON.stringify(sched, null, 2))
}

authRouter.get('/', async (req, res) => 

    res.render('index.ejs', {
        allUsers: users,
        session: req.session.user,
        drivers: dNames[0]?.drivers,
        tracks: sched[0]?.events
    })
);

authRouter.post('/drivers', (req, res) => {
    driversget(driversURL)
    res.redirect('/');
});


authRouter.post('/tracks', (req, res) => {
    scheduleget(scheduleURL)
    res.redirect('/');
});

authRouter.post('/reset', (req, res) => {
    users.length = 0
    fs.writeFileSync('./models/users.js', JSON.stringify(users, null, 2))
    res.redirect('/');
});

authRouter.post('/selection', (req, res) => {
    let sessionuser = users.find(user => user.name == req.body.driv[4] && user.password == req.body.driv[5])
    let index = users.indexOf(sessionuser)
    users[index][req.body.driv[3]] = [req.body.driv[0],req.body.driv[1],req.body.driv[2]]
    fs.writeFileSync('./models/users.js', JSON.stringify(users, null, 2))
    res.redirect('/');
});

authRouter.post('/points', async (req, res) => {
    console.log(req.body)
    let sessionuser = users.find(user => user.name == req.body.points[0] && user.password == req.body.points[1])
    let index = users.indexOf(sessionuser)
    let race_id = req.body.points[2]
    let leaderboards = await fetchAPI(`http://api.sportradar.us/nascar-ot3/mc/races/${race_id}/results.json?api_key=${api_key}`)
    for (let i=0; i<leaderboards.results.length; i++){
        if (leaderboards.results[i].driver.full_name==req.body.points[3]){
            users[index]['points'] += leaderboards.results[i].points
        }
        if (leaderboards.results[i].driver.full_name==req.body.points[4]){
            users[index]['points'] += leaderboards.results[i].points
        }
        if (leaderboards.results[i].driver.full_name==req.body.points[5]){
            users[index]['points'] += leaderboards.results[i].points
        }
    }
    fs.writeFileSync('./models/users.js', JSON.stringify(users, null, 2))
    res.redirect('/');
});

module.exports = authRouter
