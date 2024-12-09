var fs = require('fs');
var request = require('request'); 
var path = require('path');

var config = require('./config')
// OpenAI API Key
var api_key = process.env['OPENAI_API_KEY']

function getOutputFromBody(response) {
  if (response.error) {
    var error = response.error
    output = error.message
  }
  else {
    var choices = response.choices
    choices.forEach(function(choice) {
      var finish_reason = choice.finish_reason
      if (finish_reason == 'stop') {
        var message = choice.message
        output = message.content
      }
    })
  }
  return output
}

function newRequest(res, prompt) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${api_key}`,
  };

  var model = 'gpt-4-turbo'
  textRequest(headers, res, prompt, model)
}

function textRequest(headers, res, prompt, model) {
  const pContent = [
    {
      "type": "text",
      "text": prompt
    },
  ]

  // console.log(pContent)

  var payload = {
    "model": model,
    "messages": [
      {
        "role": "user",
        "content": pContent
      }
    ],
    "max_tokens": 300
  }

  request.post(
    {
      headers: headers, 
      url: "https://api.openai.com/v1/chat/completions", 
      body: JSON.stringify(payload), 
    }, 
    function(error, result, body) {
      body = JSON.parse(body)
      var output = getOutputFromBody(body)

      var date = config.currentDate
      var words = fs.readFileSync('data.json', 'utf-8')
      if (words.startsWith('{') && words.endsWith('}')) {
        words = JSON.parse(words)
      }
      words[date] = output
      fs.writeFileSync('data.json', JSON.stringify(words))

      res.send(output)
    }
  )
}


module.exports = newRequest