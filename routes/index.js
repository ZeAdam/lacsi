const fetch = require('node-fetch'); // used by api/accountinit
const jsdom = require("jsdom"); // used by api/accountinit
var cookieParser = require('cookie-parser')
const randomstring = require("randomstring"); //  for generating nonce (for CSP policy)
const { JSDOM } = jsdom;
var express = require('express');
var router = express.Router();
const graphqlserver = "127.0.0.1:21727";
// ~~~ ---------------- ~~~ //
//          Views           //

// home page
router.get('/', function(req, res, next) {
  res.render('index', {nonce: randomstring.generate()});
});
// Reinitialize AuRA password
router.get('/accountinit', function(req, res, next) {
  res.render('accountinit', {nonce: randomstring.generate()});
});
// Main dashboard
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', {nonce: randomstring.generate()});
});
// !!! ---------------- !!! //
//          API             //

// - accountinit: reinitialize the id, by sending reset psswd to AuRA
// body must contain: id (a.k.a AuRA username)
router.post('/api/accountinit', function(req, res, next) {
  if (typeof req.body.id === 'undefined' || req.body.id.length === 0) {res.send({"content":"Veuillez saisir un identifiant."});return false;}
  async function accountinitrequest(login) {
  const request = await fetch(`https://csilyon.ent.auvergnerhonealpes.fr/sg.do?PROC=IDENTIFICATION_FRONT&ACTION=SENDPASS&login=${login}`, {
    method: 'POST',
    body: '',
    headers: {
      'PROC': 'IDENTIFICATION_FRONT',
      'ACTION': 'SENDPASS',
      '#FORMAT_login': '2;0;0;50;LIB=;0',
      'codeFournisseurIdentite': 'ATS-LYON',
    }
  })
  const response = await request.text();
  const domresponse = new JSDOM(response);
  content = domresponse.window.document.getElementsByClassName('msg__content')[0].textContent;
  res.send({content});
};
accountinitrequest(req.body.id);
});

// -  auth: get the graphQL session ID
// body must contain: username, password (AuRA credentials)
router.post('/api/auth', function(req, res, next) {
  async function authrequest(username, password) {
    const request = await fetch(`http://${graphqlserver}/auth/login`, {
      method: 'POST',
      body: `{"url": "https://0693446w.index-education.net/pronote/","cas": "ac-lyon","username": "${username}","password": "${password}"}`,
      headers: {"Content-Type": 'application/json', "connection": 'keep-alive'}
    });
    const data = await request.json();
    res.send(data);
  }
  authrequest(req.body.username, req.body.password);
})

// - logout: logout session
// body must contain: token (session token)
  router.post('/api/logout', function(req, res, next) {
    async function logoutreq(token) {
      const request = await fetch(`http://${graphqlserver}/auth/logout`, {
        method: 'POST',
        body: "",
        headers: {"Content-Type": 'application/json', "connection": 'keep-alive', "token": `${token}`}
      });
      const data = await request.json();
      res.send(data);
  }
  logoutreq(req.body.token);
})

// content: gets the needed content for requested web page
// body must contain: token (session token), for (web page requesting)
  router.post('/api/content', function(req, res, next) {
    async function contentreq(token, query) {
      const request = await fetch(`http://${graphqlserver}/graphql`, {
        method: 'POST',
        body: `{"query": "${query}"}`,
        headers: {"Content-Type": 'application/json', "connection": 'keep-alive', "token": `${token}`}
      });
      const data = await request.json();
      res.send(data);
    }
    if (!!req.body.token && !!req.body.for) {
      let token = req.body.token;
      let query
      if (req.body.for[0]=="dashboard") {query="{user { name studentClass { name }}}";}
      else if (req.body.for[0]=="timetable" && req.body.for[1] && req.body.for[2]) {query=`{ timetable(from: \\"${req.body.for[1]}\\", to: \\"${req.body.for[2]}\\") { room from to subject teacher isAway isCancelled isDetention color} }`;}
      else {res.send({"message": "Missing valid 'for' field"});return;}
      contentreq(token, query);
    }
    else {
      res.send({"message": "Missing 'token' or 'for' field"});return;
    }
  })

  // renderedschedule: returns HTML student schedule for a given week
  // body must contain: token (session token), week (viewing week)
  router.get('/api/renderedschedule', function(req, res, next) {
    res.render('schedule/index.ejs', {action: 'none'});
  })
module.exports = router;
