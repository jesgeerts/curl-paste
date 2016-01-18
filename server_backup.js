var argv = require('optimist')
    .usage('curlpaste\nUsage : $0')
    .demand('p')
    .describe('p','port')
    .describe('s','secret key on query')
    .argv;

var secret = argv.s;
var router = require('router-middleware');
var http = require('http');
var kb = 1024;// number of bytes in kb
var qs = require('querystring');
var url = require('url')
var concat = require('concat-stream');
var request = require('request');
var vu = require('valid-url');
var url = require('url')
var qs = require('querystring');
var fs = require('fs');
var store = require('./lib/store')({
    duration: 1000*60*60*168,
    checkfrequency: 1000*60
})
var lib = require('./lib/handle')(store)
var server = http.createServer(router);
server.listen(argv.p);

router.get('/f:id',lib.getFile)

router.get(function(path,req) {
  if (req.url.indexOf('/id/') === 0) {
    return true
  }
},lib.getWeb)

router.get(function(path,req) {
  var hostname = req.headers.host
  if (req.headers['user-agent'] && (req.headers['user-agent'].match(/mozilla|chrome|webkit/i) !== null))
    return true
}, lib.pageWeb)

router.get(function(path,req) {
  var hostname = req.headers.host
  if (req.headers['user-agent'] && (req.headers['user-agent'].match(/mozilla|chrome|webkit/i) !== null))
    return false
  else return true
},lib.curlWeb)



router.post('/', function(req,res,next) {
  req.setEncoding('utf8')
  req.pipe(concat(function(body) {
      lib.handleBody(req,res,body);
  }));
})

router.post('/pastetext', function(req,res,next) {
  req.setEncoding('utf8')
  req.pipe(concat(function(body) {
    var text = qs.parse(body).text;
    text = text.replace(/\r\n/g,'\n');
    lib.handleBody(req,res,text);
  }));
})