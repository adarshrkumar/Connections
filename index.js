var express =  require('express')
var app = express()
  
const fs = require('fs');

var getWords = require('./getWords')
var getCustomWords = require('./getCustomWords')

var getId = require('./getId')

// User inputs
app.get('/', function(req, res) {
  if (
    req.hostname.includes('.replit.dev') || 
    req.hostname.includes('.repl.co')
  ) {
    require('./preDeploy')()
  }
  res.redirect('/play')
})
app.get('/play', function(req, res) {
  res.redirect('/game')
})

app.get('/getWords', function(req, res) {
  getWords(req, res)
})

app.get('/getCustomWords', function(req, res) {
  var id = req.query.id
  getCustomWords(req, res, id)
})

app.get('/createCustomGame', function(req, res) {
  var json = atob(req.query.json)
  if (
    (json.startsWith('{') && json.endsWith('}')) || 
    (json.startsWith('[') && json.endsWith(']'))
  ) {
    json = JSON.parse(json)
  }

  var result = {
    status: 'Error', 
    code: 422, 
    statusBool: false, 
    message: 'Error game not created', 
  }
  if (typeof json === 'object' || Array.isArray(json)) {
    var id = getId()
    fs.writeFileSync(`${__dirname}/games/${id}.json`, JSON.stringify(json))
    result.status = 'OK'
    result.code = 201
    result.statusBool = true
    result.message = id.toString()
  }

  res.status(result.code).json(result)
})

app.get('/game/:game', function(req, res) {
  var fileContent = fs.readFileSync(`${__dirname}/game.html`, 'utf-8')
  if (fileContent.includes('<input class="game-id">')) {
    fileContent = fileContent.replace('<input class="game-id">', `<input class="game-id" value="${req.params.game}">`)
  }
  
  res.send(fileContent)
})

app.get('*', function(req, res) {
  var path = req.path
  if (!path.includes('.')) path = `${path}.html`
  if (!fs.existsSync(`${__dirname}/${path}`)) {
    path = '404.html'
  }
  res.sendFile(`${__dirname}/${path}`)
})

app.listen(8080)