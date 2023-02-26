//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
const MONGODB_URL = 'mongodb+srv://niyatit:abcd@cluster0.oba68wb.mongodb.net/todolistDB?retryWrites=true&w=majority';
// const MONGODB_URL = "mongodb://127.0.0.1:27017/todolistDB";
mongoose.connect(MONGODB_URL)
  .then(()=>{
    console.log("Connected to MongoDB");
  })
  .catch((err)=>{
    console.log(err);
  });

const postSchema = new mongoose.Schema({
  heading: String,
  content: String
});

const Post = new mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  const psts = [];
  Post.find({}, function(err,result){
    if(err){
      console.log(err);
    }else{
      result.forEach(function(p){
        console.log(p.heading);
          psts.push({
            "title": _.capitalize(p.heading),
            "content" : p.content
          });
          // console.log(psts);
      });
      res.render("home", {
        content: homeStartingContent,
        posts : psts
      });
    }
  });

});

app.get("/about", function(req, res){
  res.render("about", {
    content: aboutContent
  });
});

app.get("/contact", function(req, res){
  res.render("contact", {
    content: contactContent
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});


app.get("/posts/:postName", function(req,res){
  const nm = _.kebabCase(_.toLower(req.params.postName));
  console.log("nm1"+nm);
  Post.findOne({heading : nm }, function(err,result){
    console.log("nm2"+nm);
    if(err){
      console.log(err);
      res.redirect("/");
    }else{
      // console.log(nm);
      res.render("post", {
        heading : _.capitalize(_.lowerCase(result.heading)),
        content: result.content
      });
    }
  });
});


app.post("/compose", function(req,res){
  try{
    const post = new Post({
    heading: _.kebabCase(_.toLower(req.body.title)),
    content: req.body.postBody
    });
    post.save();
  }catch(err){
    console.log(err);
  }
    res.redirect("/");
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
