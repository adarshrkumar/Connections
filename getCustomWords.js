var fs = require('fs')

function getWords(req, res, id) {
  var path = `${__dirname}/games/${id}.json`
  
  var fileContent = fs.existsSync(path) ? fs.readFileSync(path, 'utf-8') : '{}'
  // console.log(isJSON(fileContent))

  fileContent = JSON.parse(fileContent)
  res.json(fileContent)  
}

module.exports = getWords