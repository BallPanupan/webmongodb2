var express = require("express"); //
var bodyParser = require('body-parser'); //
var mongoose = require('mongoose') //
var cookieParser = require('cookie-parser'); //
var csrf = require('csurf'); //

var app = express(); //
app.use(express.static(__dirname + '/public')); //
app.set('view engine','ejs'); //

var csrfProtection = csrf({cookie:true});
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost/dbweb',{useMongoClient:true});
var Schema = mongoose.Schema;
var UserSchema = new Schema({fname:String,lname:String});
var Users = mongoose.model("users",UserSchema);

app.get('/',function(req,res){
  Users.find('users',function(ree,users){
    res.render('list',{data:users});
	//console.log(users);
  });
});

app.get('/insert',function(req,res){
  res.render('insert');
});
app.post('/insert',function(req,res){
  var users = new Users({
    fname : req.body.fname,
    lname : req.body.lname
  })
  users.save();
  res.redirect('/')
});
app.get('/update/:_id',function(req, res){
  _id=req.params._id;
  Users.findById(_id,function(err, users){
    res.render('update',users);
  });
});

app.post('/update',function(req, res){
  Users.findById(req.body._id,function(err, users){
    users.fname = req.body.fname;
    users.lname = req.body.lname;
    users.save();
  });
  res.redirect('/');
});
app.get('/delete/:_id',function(req,res) {
  Users.findById(req.params._id,function(err,users){
    users.remove();
  });
  res.redirect('/');
});

app.listen(3000,function(){
  console.log('\n Server Started on localhost:3000...\n');
});
