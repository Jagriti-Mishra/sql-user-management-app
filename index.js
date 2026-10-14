
// CJS => faker is used to store the data in bulk to the database
const { faker } = require('@faker-js/faker');

// get the client
const mysql = require('mysql2');
const express= require("express");
const app = express();//express app
const path  = require("path");
const methodOverride = require("method-override");
const { connect } = require('http2');
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));//to parse the form data

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'sql_app',
  password: 'J@griti242006',
});

let getRandomUser = ()=>{
  return[
    faker.string.uuid(),
    faker.internet.username,
    faker.internet.email(),
    faker.internet.password(),
  ];
};
//Home Page Route
app.get("/",(req,res)=>{
  //show the total number of users count using sql query
  let q = `SELECT COUNT(*) AS Count FROM user`;//pass the sql query inside the routing
 //can't use the try catch block as it only catches the err and handles the event when it is already running
 //here the callback func takes time to run the query so when it returns there is no one to handles the err 
 //so we use if block
connection.query(q,(err,result) =>{
  if(err){
    console.log(err);
    return res.status(500).send("there is some error in db");
  }
  let count = result[0].Count;
  console.log(`Total users: ${result[0].Count}`);
  res.render("home.ejs",{count});
  });
});
  
//Show Route 
app.get("/user",(req,res)=>{
  let q = `SELECT * FROM user`;//data print from user table at /user route
  connection.query(q,(err,result) =>{
    if(err){
      console.log(err);
      return res.status(500).send("There is some err in db");
    }
    console.log(result);
    let data = result;
    res.render("showusers.ejs",{data});
  });
});
//Edit Route
app.get("/user/:id/edit",(req,res) =>{
  let {id} = req.params;
  // to search the desired user
  let q = `SELECT * FROM user WHERE id=?`;
  
  connection.query(q,[id],(err,result) =>{
    if(err){
      console.log(err);
      return res.status(500).send("There is some err in db");
    }
    if(result.length === 0){
      return res.status(500).send("User not found");
    }
    //if no err let the user edit 
    let user = result[0];
    res.render("edit.ejs",{user});
  })
});
//Update route =>run even though the browser send a POST
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {password : formPass,username:newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id=?`;

  connection.query(q,[id],(err,result) =>{
    if(err){
    console.log(err);
    return res.status(500).send("There is some err in the db");
    }
    if(result.length === 0) return res.status(404).send("user not found");
    let user = result[0];
    if(formPass !== user.password){
      res.send("Wrong Password");
    }else{//if the password matches the formpassword the username will get updated
      let q2 = `UPDATE user SET username=? WHERE id=?`;//nested query to update the username
      connection.query(q2,[newUsername,id],(err,result)=>{
        if(err){
          console.log("there is some err");
          return res.send("Username not updated");
        }
        //show the updated username 
        res.redirect("/user");
      });
    }
  });
  
});
//show the signup form
app.get("/user/new",(req,res)=>{
  res.render("newuser.ejs");
});
app.post("/user",(req,res)=>{
  let{username,email,password} = req.body;
  let id = faker.string.uuid();//the user doesn't type the id,the server generates it

 let q = `INSERT INTO user(id,username,email,password) VALUES (?,?,?,?)`;
  connection.query(q,[id,username,email,password],(err,result)=>{
    if(err){
      console.log(err);
      return res.status(500).send("The new user is not signed up");
    }
    res.redirect("/user");//show the list with the new user
  });
});
//show the delete confirmation page
app.get("/user/:id/delete",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = ?`;
  connection.query(q,[id],(err,result) =>{
    if(err){
      console.log(err);
      return res.send("There is some error in db");
    }
    if(result.length === 0) return res.status(404).send("user not found");
    let user = result[0];
    res.render("delete.ejs",{user});
  });
});
//delete the data of user from the db
app.delete("/user/:id",(req,res) =>{
  let {id} = req.params;
  let {password:formPassword} = req.body;

  let q = `SELECT * FROM user WHERE id = ?`;
  connection.query(q,[id],(err,result) =>{
    if(err){
      console.log(err);
      return res.status(500).send("There is some err in db");
    }
    if(result.length === 0) return res.status(404).send(`NO user found`);
    let user = result[0];
    if(user.password !== formPassword){
      return res.send("Incorrect Password");
    }
    else{//when the enter password matched the db password
      let q=`DELETE FROM user WHERE id = ? `;
      connection.query(q,[id],(err,result)=>{
        if(err){
          console.log(err);
          return res.send("User data is not deleted");
        }
        res.redirect("/user");
      });
    }
  });
});
app.listen("8080",()=>{
  console.log("server is listening to port 8080");
});

console.log(getRandomUser());
