let express = require("express")
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')

let app = express()
let db

let port = process.env.PORT
if (port == null || port == "") {
  port = 3000
}

app.use(express.static('public'))

let connectionString = 'mongodb+srv://CHKdbuser:fAgreB22@cluster0-g6dpu.mongodb.net/ToDoList?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  db = client.db()
  app.listen(port)
})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Authentication code
function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Simple ToDoApp"')
  console.log(req.headers.authorization)
  if (req.headers.authorization == "Basic Q1VLYXNzOndlYmVjY2E=") {
      next()
  } else {
      res.status(401).send("Authentication required")
  }
}

app.use(passwordProtected)

app.get('/', function(req, res) {
  db.collection('items').find().toArray(function(err, items) {
    res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags MUST come first in the head; any other head content must come AFTER these tags -->
       <link href="https://fonts.googleapis.com/css?family=Raleway&display=swap" rel="stylesheet">
       <link href="https://fonts.googleapis.com/css?family=Cormorant+Garamond|Raleway&display=swap" rel="stylesheet">
  <title>To-Do List</title>
       <link rel="stylesheet" href="style.css">
  </head>
  <body>
     <div class="container">
       <div class="content-area">
      <p class="top-head">TO-DO LIST</p>
  
       <form id="ourForm" action="/create-item" method="POST">
          <input id="ourField" name="item" class="input-box" type="text" placeholder="Write here" autocomplete="off">
          <button class="button">Add to list</button>
       </form>
          <ul id="ourList">
            
          </ul>
       </div>
  </div>
  <script>
  let items = ${JSON.stringify(items)}
  </script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script> 
  <script src="/browser.js"></script>       
 </body>
</html>`)
  })
	
})

app.post('/create-item', function(req, res) {
	let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
  db.collection('items').insertOne({text: safeText}, function(err, info) {
      res.json(info.ops[0])
  })	
})
app.post('/update-item', function(req, res) {
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: safeText}}, function() {
    res.send("Success")
  })
})

app.post('/delete-item', function(req, res) {
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, function() {
    res.send("Success")
  })
})

