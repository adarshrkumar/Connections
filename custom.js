var catEles = document.querySelectorAll('.cat')
var inputs = document.querySelectorAll('.cat :is(.cat-name, .word)')

var clearBtn = document.querySelector('.clear')

clearBtn.addEventListener('click', clearCustom)
clearBtn.addEventListener('touchend', clearCustom)

function clearCustom(e) {
  inputs.forEach(function(i) {
    i.value = ''
  })
}

var createBtn = document.querySelector('.create')

createBtn.addEventListener('click', createCustom)
createBtn.addEventListener('touchend', createCustom)

function createCustom(e) {
  var categories = []
  
  catEles.forEach(function(category, i) {
    var words = []
    category.querySelectorAll('.word').forEach(function(word, i) {
      if (word.value) {
        words.push(word.value)
      }
    })

    var catName = ''
    var catNameEle = category.querySelector('.cat-name')
    if (catNameEle) {
      if (catNameEle.value) catName = catNameEle.value
    }

    if (!catName || words.length < 1) return
    
    categories.push({
      name: catName,
      words: words
    })
  })

  if (categories.length < 1) return

  var json = JSON.stringify(categories)
  var base64 = btoa(json)

  var url = `/createCustomGame?json=${base64}`
  console.log(url)

  fetch(url)
    .then(response => response.json())
    .then(json => {
      var status = json.code
      if (status === 201) {
        location.href = `/game/${json.message}`
      }
      else alert(`Error ${status}: ${json.message}`)
    })
}