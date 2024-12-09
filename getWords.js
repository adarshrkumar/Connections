var fs = require('fs')

var config = require('./config')
var newRequest = require('./request')

function getWords(req, res) {
  var words = fs.readFileSync('data.json', 'utf-8')
  if (words.startsWith('{') && words.endsWith('}')) {
    words = JSON.parse(words)
  }

  var date = config.currentDate

  if (words[date]) {
    var theWords = words[date]
    words = {}
    words[date] = theWords
    fs.writeFileSync('data.json', JSON.stringify(words))
    
    res.send(words[date])
  }
  else {
    var prompt = config.startingPrompt
    newRequest(res, prompt)
  }
}

module.exports = getWords