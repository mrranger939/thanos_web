const express = require("express");
require('dotenv').config();
const md5 = require('md5');
const path = require("path")
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const publicStaticPath = path.join(__dirname, "/public")
const temp_path = path.join(__dirname, "/views")
/* const partials_path = path.join(__dirname, "../templates/partials") */
const app = express();
/* connecting database */
const mongoose = require("mongoose");
const { error } = require("console");

const uri = process.env.MONGOAT;
mongoose.connect(uri).then(()=>{
    console.log("connection successful with database")
}).catch((error)=>{
    console.log(error);
});
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: String,
    email: String, 
    password: String,
    person_name: String,
    person_email: String,
    person_address: String,
    person_city: String
  });
const MyObject = mongoose.model('Erase', userSchema);

/* connecting db ends hahahaa */
app.set("view engine", "ejs");

app.set("views", temp_path);

app.use(express.static(publicStaticPath))


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/* code starts here */
/* getting count */

/* getting count */


app.get("/", (req, res)=>{
    res.render("index");
})
app.get("/ebony", (req, res)=>{
    res.render("ebony");
})

app.get("/proxima", (req, res) => {
    res.render("proxima");
});


app.get("/corvus", (req, res) => {
    res.render("corvus");
});


app.get("/cullobs", (req, res) => {
    res.render("cullobs");
});
app.get("/pricing", (req, res) => {
    res.render("pricing");
});


/* app.get("/eraser", (req, res)=>{
    res.render("eraser", {
        name: "Your Name",
        person_name: "Person Name",
        person_email: "Person Email",
        person_address: "Person Address",
        alertnow: false
    })  
}) */
app.get("/eraser", async (req, res) => {
    try {
        // Count documents in the MyObject collection
        const count = await MyObject.countDocuments({});
        
        // Render the "eraser" view and pass the count
        res.render("eraser", {
            name: "Your Name",
            person_name: "Person Name",
            person_email: "Person Email",
            person_address: "Person Address",
            documentCount: count  // Pass the count to the view
        });
    } catch (err) {
        console.error("Error counting documents:", err);
        res.status(500).send("Internal Server Error");
    }
});


app.get("/about", (req, res)=>{
    res.render("about")
})

/* registering to evil */
app.post("/erase", (req, res)=>{
    MyObject.findOne({email: req.body.email})
    .then(foundObject => {
      if (foundObject) {
        console.log('Object found:', foundObject);
        res.redirect("pricing")  
        
      } else {
      console.log('Object not found or authentication failed');
      const person_registeres = new MyObject({
        name: req.body.name,
        email: req.body.email, 
        password: md5(req.body.password),
        person_name: req.body.person_name,
        person_email: req.body.person_email,
        person_address: req.body.person_address,
        person_city: req.body.person_city
    })
      person_registeres.save()
      .then(savedObj => {
        console.log('Object saved successfully:', savedObj);
      })
      .catch(error => {
        console.error('Error saving object:', error);
      });
      res.redirect("/");
      }
    })
    .catch(error => {
      console.error('Error finding object:', error);
      res.status(500).json({ message: 'Internal server error' });
    });


})

/* registring ends */
/* the checking the person */
app.post("/erased", async (req, res) => {
    try {
        const foundObject = await MyObject.findOne({ email: req.body.check_email, password: md5(req.body.check_password) });

        let count;
        if (foundObject) {
            console.log('Object found:', foundObject);
            count = await MyObject.countDocuments({});
        } else {
            console.log('Object not found or authentication failed');
            count = await MyObject.countDocuments({});
        }

        res.render("eraser", {
            name: foundObject ? foundObject.name : "Your Name",
            person_name: foundObject ? foundObject.person_name : "Person Name",
            person_email: foundObject ? foundObject.person_email : "Person Email",
            person_address: foundObject ? foundObject.person_address : "Your email or password may be wrong",
            documentCount: count
        });
    } catch (error) {
        console.error('Error finding object:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



/* the checking the person */
/* the under cons */
app.get("/undc", (req, res)=>{
    res.render("under_construction")
})

/* the under cons */
/* listen port */
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
/* listen port */
