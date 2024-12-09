const date = Math.floor(Date.now()/1000/60/60/24)

var config = {
  startingPrompt: `Please create four sets of four related words. Please return the words in a json object like this: 
\`\`\`
[
  {
    name: "category1Name", 
    words: ["word1", "word2", "word3", "word4"]
  },
  {
    name: "category2Name", 
    words: ["word1", "word2", "word3", "word4"]
  },
  {
    name: "category3Name", 
    words: ["word1", "word2", "word3", "word4"]
  },
  {
    name: "category4Name", 
    words: ["word1", "word2", "word3", "word4"]
  }
]
\`\`\`
ONLY RETURN THE JSON.`, 
  currentDate: date, 
}

module.exports = config