var express = require('express');
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/project");
const app = express();
app.use(express.urlencoded())
var session=require('express-session');
app.use(express.json());
app.use(express.static('public'));
app.use(session({'secret':'fghvcdhshhgvjhfsbhvvh746ghjb',saveUninitialized:true,resave:true}));
var flag=0;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');


 mongoose.connection.on('error', (err) => {
    console.log('DB connection Error');
  });
  
  mongoose.connection.on('connected', (err) => {
    console.log('DB connected');
  });

  
var Schema=mongoose.Schema;
let Pro=new Schema({
    name:String,
    description:String,
    price:Number,
   quantity:Number
});
let Cart=new Schema({
  cname:String,
    cdescription:String,
    cprice:Number,
   cquantity:Number
});

let Users=new Schema({
  name:String,
  username:String,
  password:String,
  email:String,
  
});

let Logedinuser=new Schema({

  username:String,
  password:String,
 
  
});


var pro = mongoose.model("pros",Pro);
var cart =mongoose.model("carts",Cart);
var logedinuser = mongoose.model('logedinuser', Logedinuser);
var user = mongoose.model('users', Users);



/*app.get('/add', function (req, res, next) {
  if(flag==1)
  res.render('header');
  else res.redirect('/login.html')
});*/



app.get("/",function(req,res)
       {
    res.sendFile(__dirname+"/user.html");
});

app.get("/login.html",function(req,res)
       {
    res.sendFile(__dirname+"/login.html");
});

app.get("/adminPanel1.html",function(req,res)
       {
    res.render('adminPanel');
});


app.get('/add', function (req, res, next) {
  if(flag==1) 
  res.render('adminPanel');

 else res.redirect('/login.html')

});

app.get("/signup.html",function(req,res)
       {
    res.sendFile(__dirname+"/signup.html");
});

app.get('/checkout', function (req, res) {
 
  cart.deleteMany({}, function(err){
    if (err){
        throw err;
        
    }
    cart.find(function(err,carts){
      if(err)
      {
        console.log(error);
      }
      else{
        res.render('cart',{carts:carts});
        
      }
    });
    
});
});


app.get('/continueshopping', function (req, res) {
  pro.find(function(err,pros){
    if(err)
    {
      console.log(error);
    }
    else{
      res.render('userview',{pros:pros});
     /// console.log(pros);
    }
  });
});






app.post("/addpro", (req, res) => {
    var myData = new pro(req.body);
    myData.save()
      .then(item => {
        res.render('adminPanel');
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      });
  });









 







  app.get('/userview', function (req, res) {
    pro.find(function(err,pros){
      if(err)
      {
        console.log(error);
      }
      else{
        res.render('userview',{pros:pros});
       /// console.log(pros);
      }
    });
  });


app.get('/display',function(req,res){
  pro.find(function(err,pros){
    if(err)
    {
      console.log(error);
    }
    else{
      res.render('display-table',{pros:pros});
      //console.log(pros);
    }
  });
});

app.get('/cartview',function(req,res){
  cart.find(function(err,carts){
    if(err)
    {
      console.log(error);
    }
    else{
      res.render('cart',{carts:carts});
      
    }
  });
});
app.get('/edit/:id',function(req,res){
  pro.findById(req.params.id,function(err,pros){
    if(err){
      console.log(err);
    }
    else{
      res.render('edit-form',{pros:pros});
    }
  });
});

app.post('/addtocart/:id',function(req,res){
  pro.findById(req.params.id,function(err,pros){
    if(err){
      console.log(err);
    }
    else{
      if(req.body.total>pros.quantity)
      {
       pro.find(function(err,pros){
        if(err)
        {
          console.log(error);
        }
        else{
          res.render('userview',{pros:pros});
         /// console.log(pros);
        }
      });
      }
      else{
      const myData=new cart({
        cname:pros.name,
        cdescription:pros.description,
        cprice:pros.price,
        cquantity:req.body.total
      })
      myData.save();


      const updatepro={
        name:pros.name,
        description:pros.description,
        price:pros.price,
        quantity:(pros.quantity-req.body.total)
      }
      if(updatepro.quantity>0)
      {
      pro.findByIdAndUpdate(req.params.id,updatepro,function(err){
        if(err){
          console.log("cant update");
          console.log(err);
        }else{
          
          pro.find(function(err,pros){
            if(err)
            {
              console.log(error);
            }
            else{
              res.render('userview',{pros:pros});
             /// console.log(pros);
            }
          });
          }
        });
      }
      else{
        pro.findOneAndDelete(req.params.id,function(err,pros)
  {
    if(err){
      console.log("cant delete");
    }
    else{
     console.log("product deleted");
     pro.find(function(err,pros){
      if(err)
      {
        console.log(error);
      }
      else{
        res.render('userview',{pros:pros});
       /// console.log(pros);
      }
    });
    }
  });
    }
  }
}
  });
});





  


app.get('/delete/:id',function(req,res){
  pro.findOneAndDelete(req.params.id,function(err,pros)
  {
    if(err){
      res.redirect('../display'); 
    }
    else{
      res.redirect('../display');
    }
  });
});

app.get('/removefromcart/:id',function(req,res){
  
  cart.findOneAndDelete(req.params.id,function(err,carts)
  {
    if(err){
      res.redirect('../cartview'); 
    }
    else{
      res.redirect('../cartview');
    }
  });
});



app.post('/edit/:id',function(req,res){
  const mydata={
    name:req.body.name,
    description:req.body.description,
    price:req.body.price,
    quantity:req.body.quantity
  }
  pro.findByIdAndUpdate(req.params.id,mydata,function(err){
    if(err){
      res.redirect('/edit/'+req.params.id);
    }else{
        res.redirect('../display');
      }
    
  });
});










app.post('/adduser',(req,res)=>{
  var len=JSON.parse(req.body.userList).length;
  var sData=new user();
  sData.name=JSON.parse(req.body.userList)[len-1].name;
  sData.username=JSON.parse(req.body.userList)[len-1].username;
  sData.email=JSON.parse(req.body.userList)[len-1].email;
  sData.password=JSON.parse(req.body.userList)[len-1].password;

  sData.save(function(err)
{
if(err)
   {
       console.log("Error");
   }
   res.redirect('/login.html');
});
})


app.post('/loginarray',(req,res)=>{


  var len=JSON.parse(req.body.logarray).length;
  var sData=new logedinuser();
   if(JSON.parse(req.body.logarray)[len-1].username=='chitkara')
   flag=1;

   console.log("login array flag is: "+flag);
  sData.username=JSON.parse(req.body.logarray)[len-1].username;
  
  sData.password=JSON.parse(req.body.logarray)[len-1].password;

  sData.save(function(err)
{
if(err)
   {
       console.log("Error");
   }
   res.redirect('/adminPanel.html');
});
})

app.post('/setSession',(req,res)=>{
  
  req.session.username=JSON.parse(req.body.username);
 

 if(req.session.username=='rahul'){
     flag=1;
     
 }
 else if(req.session.username=='logout'){
     flag=0;
 }
 else flag=0;
})

app.get('/loginarray',(req,res)=>{
 console.log('running it');
 logedinuser.find({},function(err,docs){
     if(err)
         {
             console.log("error");
         }
     console.log(docs);
     res.send(docs);
    
 });
});
app.get("/adminPanel",function(req,res)
{
   if(flag==1)
res.render('adminPanel');

else res.redirect('/login.html')
});


app.listen(8000);