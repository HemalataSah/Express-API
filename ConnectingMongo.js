var express = require("express");
const path = require('path');
const {MongoClient} = require("mongodb");
var app = express();

// -e ME_CONFIG_MONGODB_URL="mongodb://admin:qwerty@mongo:27017" 
// var uri = 'mongodb://admin:qwerty@localhost:27017';
var uri = 'mongodb://admin:qwerty@localhost:27017/?authSource=admin';
const client = new MongoClient(uri);
var collection;

// 1) import mongodb library
// 2) define uri
// 3) Create an Object of mongodb passing the uri
// 4) connect the Object with Connect()
// 5) connect the object to the Database 
// 6) connect the object to the collection

async function connectMongo() {
    try{
        await client.connect();
        console.log("Connected to Mongodb");
        db = client.db("Student");
        collection = db.collection("Details");
        console.log("Connected to Collection");
    }
    catch (error){
        console.log("Connection Failed",error);
    }
}


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/Insertform', (req,res) =>
  {res.sendFile(path.join(__dirname,'public/InsertForm.html'));}
);

app.get('/FindOne', (req,res) =>
  {res.sendFile(path.join(__dirname,'public/FindOne.html'));}
);

app.get('/FindAll', (req,res) =>
  {res.sendFile(path.join(__dirname,'public/FindAll.html'));}
);

app.get('/UpdateOne', (req,res) =>
  {res.sendFile(path.join(__dirname,'public/UpdateOne.html'));}
);

app.get('/DropTable', (req,res) =>
  {res.sendFile(path.join(__dirname,'public/Drop.html'));}
);

// Insertion of one document
app.post('/api/insert/:id/:name/:qualification/:branch/:company', async function(req,res){
    try{
    // const query = { EmpCode: 8184 , Name: "Hemalata", Qualification: "MTech", Branch: "Computer Science", Company: "NIC" };
    const query = {
        EmpCode: parseInt(req.params.id) , 
        Name: req.params.name, 
        Qualification: req.params.qualification, 
        Branch: req.params.branch, 
        Company: req.params.company
    };
    const result = await collection.insertOne(query);
    res.json({
       message:"Data inserted Successfully",
       data:query});
    }catch(err){
        console.log(err);
    }
    });


// Find One Document
app.get('/api/find/:id', async function(req,res){
    try{
    const query = {EmpCode : parseInt(req.params.id)};
    const result = await collection.findOne(query);
    if (result) {
      res.json({
        message: "Data Found Successfully",
        data: result
      });
    } else {
      res.send("Data Not Found");
    }
    }
    catch(err){
        console.log(err);
    }
    });


// Find all documents
app.get('/api/findall', async (req, res) => {
  try {
    const documents = await collection.find({}).toArray();
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).send('Internal Server Error');
  } 
});

//Update document
app.put('/api/update/:id/:company', async(req, res)=>{
  try{
  const modifiedData = {EmpCode: parseInt(req.params.id)};
  const result = await collection.updateOne(modifiedData,{$set:{Company: req.params.company}});
  if(result)
  {
    res.json({message:"Updation Done Successfully"});
  }
  else
  {
    res.json({message:"Updation UnSuccessfull"});
  } 
  }catch(err)
  {
    console.log(err)
  }
});

//Drop all documents
app.delete("/api/drop",async(req,res)=>{
  try{
    const db = client.db("Student");
    const result= await collection.drop();
    if(result)
  {
    res.json({message:" Deletion Done Successfully"});
  }
  else
  {
    res.json({message:"Deletion UnSuccessfull"});
  } 
}catch(err){
    res.send(err);
  }
});

// Listening Port
var port = 3000;
app.listen(port,()=>{
    console.log("Listening to Port ", port);
})

connectMongo();