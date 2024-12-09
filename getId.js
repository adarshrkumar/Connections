var fs = require('fs');

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function genNewId() {
  var id = ''
  var length = 5
  for (var i = 0; i < length; i++) {
    id += `${Math.floor(Math.random() * chars.length)}`
  }
  return id
}

function getId() {
  var idS = fs.readdirSync(`${__dirname}/games`)
  idS.forEach(function(id, i) {
    if (id.endsWith('.json')) idS[i] = id.slice(-1*'.json'.length)
  })

  var newId = genNewId()
  if (idS.indexOf(newId) > -1) {
    return getId()
  }
  return newId
}

module.exports = getId