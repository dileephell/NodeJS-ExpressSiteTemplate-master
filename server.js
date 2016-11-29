
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
 // , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  hosts: [
    {
      protocol: 'http',
      host: '13.85.74.134',
      port: 9200
    }
  ]
});

client.ping({
  requestTimeout: 30000,

}, function (error) {
  if (error) {
    console.error('Cluster is not available !');
  } else {
    console.log('All clear!');
  }
});



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  //app.set('view engine', 'jade');
  app.set('view engine', 'ejs');
  app.engine('html', require('ejs').renderFile);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var databaseUrl = "13.85.74.134:27017/ecommerce"; // "username:password@example.com/mydb"
var collections = ["users"]
//var db = require("mongojs").connect(databaseUrl, collections);

var mongojs = require('mongojs');
var db = mongojs(databaseUrl, collections);
//app.get('/', routes.index);
//app.get('/users', user.list);

//CDN
var cloudinary = require('cloudinary');


cloudinary.config({ 
  cloud_name: 'rmishra', 
  api_key: '674386685933353', 
  api_secret: 'U-JdMPulnf3H1dKobheXevwjhio' 
});

//app.use(express.static('public'));


app.get('/index.htm', function (req, res) {
   res.sendfile( __dirname + "/" + "index.htm" );
});

app.get('/', function(request, response){
//	 console.log("I am here");
   response.sendfile( path.join(__dirname + "/" +'home.html'));
});


app.get('/process_get', function (req, res) {
	var age;
   // Prepare output in JSON format
   var searchItem;
   var displayVal
   response = {
      searchItem:req.query.searchItem
     //last_name:req.query.last_name
   };
  searchItem = response.searchItem;
 console.log("searchItem ElaStic"+searchItem);

client.search({
	
  index: 'hello',
  type: 'world',
  body: {
    query: {
      match: {
        desc: searchItem
      }
    }
  }
}).then(results => {
    console.log(results);
    console.log('returned article titles:');
    results.hits.hits.forEach(
      (hit, index) => console.log(++index +'****'+JSON.stringify(hit)
      )
    )
 
  });

});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});