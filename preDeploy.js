var fName = 'data'
var request = require('request');
var fs = require('fs');

preDeploy()
function preDeploy() {
  request.get(
    {
      url: `https://connectionsgame.replit.app/${fName}.json`
    }, 
    function(error, response, body) {
      fs.writeFileSync(`${__dirname}/${fName}.json`, body)
    }
  )
}

module.exports = preDeploy