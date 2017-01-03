// import modules
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// create database
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once("open", function(){
  console.log("DB connected!");
});
db.on("error", function(){
  console.log("DB ERROR : ", err);
});

// set models
var postSchema = mongoose.Schema({
  title : {type:String, required:true}, //제목
  body : {type:String, required:true}, //본문
  createdAt : {type:Date, default:Date.now}, //생성시간
  updatedAt : Date //수정시간
});
var Post = mongoose.model('post', postSchema);

// set views
app.set("view engine", 'ejs');

// set middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// set routes
// index
app.get('/posts', function(req, res){
  Post.find({}, function(err, posts){
    //에러이면 success에 false값 대입하여 제이슨 형성 후 리턴
    if(err) return res.json({success:false, message:err});
    //에러가 아니면 success에 true, data에 posts값 대입하여 제이슨 형성
    res.json({success:true, data:posts});
  });
});
// create
app.post('/posts', function(req, res){
  Post.create(req.body.post, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
});
// show
app.get('/posts/:id', function(req, res){
  Post.findById(req.params.id, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, data:post});
  });
});
// update
app.put('/posts/:id', function(req, res){
  req.body.post.updatedAt=Date.now();
  Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id+" updated"});    
  });
});
//destroy
app.delete('/posts/:id', function(req, res){
  Post.findByIdAndRemove(req.params.id, function(err, post){
    if(err) return res.json({success:false, message:err});
    res.json({success:true, message:post._id + " deleted"});
  });
});

// start server
app.listen(3000, function(){
  console.log('Server On!');
});
