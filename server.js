var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')

var app = express()

// Allow all requests from all domains & localhost
app.all('/*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'POST, GET')
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const rowsTemplate = [
  {
    'id': '234kjw',
    'email': 'abcdefg@gmail.com',
    'name': 'Alex',
    'phone': '1231231231',
    'adress': '43 DS SSS'
  },
  {
    'id': '1233ds',
    'email': 'jddsfhsd@aadw.com',
    'name': 'John',
    'phone': '23463421',
    'adress': 'dss DS SSS'
  },
  {
    'id': 'hjsd2d',
    'email': 'sdffgsdf@43.com',
    'name': 'Pavle',
    'phone': '63426234',
    'adress': 'AAD sdsdf SSS'
  },
  {
    'id': 'dhdsaf',
    'email': 'fgsdshsd@1ss.com',
    'name': 'Xin',
    'phone': '89546464',
    'adress': '2 DS 2'
  },
  {
    'id': 'otdfgs',
    'email': 'vsdfs@sdsdf.com',
    'name': 'Ahmed',
    'phone': '32422344',
    'adress': '6 DS 4'
  },
  {
    'id': 'hsdgs',
    'email': 's@aadw.com',
    'name': 'John',
    'phone': '23463421',
    'adress': 'dss DS SSS'
  },
  {
    'id': 'njdgfd',
    'email': 'thsdf@43.com',
    'name': 'Pavle',
    'phone': '63426234',
    'adress': 'AAD sdsdf SSS'
  },
  {
    'id': 'dhdsaf',
    'email': 'fgsdshsd@1ss.com',
    'name': 'Xin',
    'phone': '89546464',
    'adress': '2 DS 2'
  },
  {
    'id': 'gsf',
    'email': 'vsdfs@sdsdf.com',
    'name': 'Ahmed',
    'phone': '32422344',
    'adress': '6 DS 4'
  },
  {
    'id': '1233ds',
    'email': 'mdgdgf@aadw.com',
    'name': 'John',
    'phone': '23463421',
    'adress': 'dss DS SSS'
  },
  {
    'id': 'hjsd2d',
    'email': 'sdffgsdf@43.com',
    'name': 'Pavle',
    'phone': '63426234',
    'adress': 'AAD sdsdf SSS'
  },
  {
    'id': 'dhdsaf',
    'email': 'fgsdshsd@1ss.com',
    'name': 'Xin',
    'phone': '89546464',
    'adress': '2 DS 2'
  },
  {
    'id': 'otdfgs',
    'email': 'vsdfs@sdsdf.com',
    'name': 'Ahmed',
    'phone': '32422344',
    'adress': '6 DS 4'
  }
]
app.use(express.static(path.join(__dirname, '/my-table/dist/spa-mat/')))

app.get('/', function (req, res) {
  res.sendFile(path.join(`${__dirname}/my-table/dist/spa-mat/index.html`))
})


app.get('/api', function (req, res) {
  let page = req.param('page')
  let rowPerPage = req.param('row_per_page')
  let rows = req.param('rows')
  let result = []
  for (let i = 0; i < rows; i++) {
    let index = parseInt(Math.random() * rowsTemplate.length)
    let row = JSON.parse(JSON.stringify(rowsTemplate[index]))
    row ['no'] = (page - 1) * rowPerPage + 1 + i
    result.push(row)
  }
  res.send(result)
})


app.listen(3000)
console.log('Running at Port 3000')

