var gameId = document.querySelector('.game-id')
var customGame = gameId.value !== '' && gameId.value !== null && !!gameId

var date = Math.floor(Date.now()/1000/60/60/24)
var checkBtn = document.querySelector('.check')

var categories = []
var choicesEle = document.querySelector('.choices')

window.addEventListener('DOMContentLoaded', function (e) {
  startGame()
});

function startGame() {
  var xhr = new XMLHttpRequest()

  var reqPath = 'getWords'
  if (customGame) reqPath = `getCustomWords?id=${gameId.value}`
  
  xhr.open('GET', `/${reqPath}`)
  xhr.addEventListener('load', function() {
    var json = xhr.responseText
    while (json[0] === '`' || json[0] === 'j' || json[0] === 's' || json[0] === 'o' || json[0] === 'n' || json[0] === '\n') {
      json = json.slice(1)
    }
    while (json.slice(-1) === '`') {
      json = json.slice(0, -2)
    }
    if (
      (json.startsWith('[') && json.endsWith(']')) || 
      (json.startsWith('{') && json.endsWith('}'))
    ) json = JSON.parse(json)
    else json = [json]
    categories = json

    var words = []
    categories.forEach(function(category) {
      if (category.words) {
        category.words.forEach(function(word) {
          words.push(word)
        })
      }
      else location.reload()
    })

    var newWords = []
    while (words.length > 0) {
      var index = Math.floor(Math.random()*words.length)
      newWords.push(words[index])
      words.splice(index, 1)
    }
    words = newWords
    
    displayWords(words)
    document.getElementById('loading').remove()
  })
  xhr.send()  
}

function displayWords(words) {
  words.forEach(function(word, i) {
    var btn = createBtn([{id: 'textContent', value: word}])
    choicesEle.appendChild(btn)
    btn.addEventListener('click', onBtnClick)
    btn.addEventListener('touchend', onBtnClick)
  })

  var won = localStorage.getItem('won')
  if (won) {
    if (won.startsWith('{') && won.endsWith('}')) {
      won = JSON.parse(won)
      if (won.date === date && won.status === true) {
        var btns = choicesEle.querySelectorAll('.btn')

        var cI = 0
        var wI = 0
        var bI = 0
        var cInt = setInterval(function() {
          var category = categories[cI]
          if (!category) return
          if (category.words) {
            var word = category.words[wI]
            var btn = btns[bI]
            if (btn.textContent === word) {
              btn.click()
            }
            wI++
            if (wI >= category.words.length) {
              wI = 0
              cI++
            }
            bI++
            if (bI >= btns.length) {
              setTimeout(function() {
                checkBtn.click()
              }, 500)
            }
          }
          if (cI >= categories.length) {
            clearInterval(cInt)
          }
        }, 500)
      }
    }
  }
}

function createBtn(params) {
  var btn = document.createElement('button')
  btn.classList.add('btn')

  params.forEach(function(p, i) {
    if (typeof btn[p.id] === 'function') btn[p.id](p.value)
    else btn[p.id] = p.value
  })
  
  return btn
}

function onBtnClick(e) {
  var btn = e.target
  if (btn.parentNode.querySelectorAll('.selected').length < 4) {
    btn.classList.toggle('selected')
  }
  else {
    btn.classList.remove('selected')
  }
}

var clearBtn = document.querySelector('.clear')
clearBtn.addEventListener('click', clear)
clearBtn.addEventListener('touchend', clear)

function clear(e) {
  var btns = choicesEle.querySelectorAll('.btn.selected')
  btns.forEach(function(btn) {
    btn.classList.remove('selected')
  })
}

checkBtn.addEventListener('click', check)
checkBtn.addEventListener('touchend', check)

function check(e) {
  var btns = choicesEle.querySelectorAll('.btn.selected')

  if (btns.length !== 4) return
  
  var answers = []
  btns.forEach(function(btn) {
    answers.push(btn.textContent)
  })

  var matchesCat = false
  var matchedCat = null
  categories.forEach(function(category) {
    var words = category.words

    var isGood = true
    answers.forEach(function(answer) {
      if (words.indexOf(answer) === -1) isGood = false
    })

    if (isGood) {
      matchesCat = true
      matchedCat = category.name
    }
  })

  if (matchesCat) {
    btns.forEach(function(btn) {
      btn.remove()
    })

svg     if (categories[getIndexOfValue(categories, 'name', matchedCat)]) {
      answers = categories[getIndexOfValue(categories, 'name', matchedCat)].words
    }
    
    var answerEle = document.createElement('button')
    answerEle.classList.add('answer')
    answerEle.setAttribute('tabindex', -1)
    
    var catEle = document.createElement('b')
    catEle.classList.add('categories')
    catEle.textContent = matchedCat
    answerEle.appendChild(catEle)
    
    var answersEle = document.createElement('span')
    answersEle.classList.add('answers')
    answersEle.textContent = answers.join(', ')
    answerEle.appendChild(answersEle)
    
    choicesEle.appendChild(answerEle)
  }
  else {
    clear(e)
  }

  if (choicesEle.querySelectorAll('.btn').length < 1) {
    endGame(e)
  }
}

function endGame(e) {
  clearBtn.disabled = true
  clearBtn.removeEventListener('click', clear)
  clearBtn.removeEventListener('touchend', clear)
  checkBtn.disabled = true
  checkBtn.removeEventListener('click', check)
  checkBtn.removeEventListener('touchend', check)

  localStorage.setItem('won', JSON.stringify({date: date, status: true}))
}

function getIndexOfValue(arr, key, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === value) return i
  }
  return -1
}