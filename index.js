const express=require('express');
const app=express();
const bodyparser=require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');
const mongoclient=require('mongodb').MongoClient;
const path=require("path");
var dbo;
mongoclient.connect('mongodb+srv://karthik:karthik@cluster0.m6yhb.mongodb.net/ctf?retryWrites=true&w=majority',{useNewUrlParser:true},{useUnifiedTopology:true},(err,db)=>{
    if(err)
    {
        console.log("error in connection to the db");
    }
    else{
        dbo=db.db('ctf');
        console.log("database was connected with the object");
    }
});
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})
app.post("/create",(req,res)=>{
    var name=req.body.name;
    var link=req.body.link;
    var description=req.body.description;
    var data={
        '_id':'001',
        'name':name,
        'imagelink':link,
        'description':description
    };
    dbo.collection('products').insertOne(data,(err)=>{
        if(err)
        {
            throw err;
        }
        else{
            res.send("Successfully pushed to the database");
        }
    })
});
app.post("/edit",(req,res)=>{
    var id=req.body.product_id;
    var name_updated=req.body.product_name;
    var link_updated=req.body.updated_link;
    var description_updated=req.body.updated_description;
    var find={
        _id:id,
    };
    var value={
        name:name_updated,
        imagelink:link_updated,
        description:description_updated,
    };
    dbo.collection('products').update(find,value,(err)=>{
        if(err)
        {
            throw err;

        }
        else{
            res.send("successfully patched");
        }
    });
});
app.listen(3000,(err)=>{
    if(err)
    {
        console.log("server failed");
    }
    else{
        console.log("server started");
    }
})
