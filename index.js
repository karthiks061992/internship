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
    res.render('index');
})
app.get("/insert",(req,res)=>{
    res.render('insert');
});
app.get("/update",(req,res)=>{
    res.render('update');
});
app.get("/products",(req,res)=>{
    res.redirect("/getall");
});
app.get("/delete",(req,res)=>{
    res.render('delete');
})
app.post("/create",(req,res)=>{
    var name=req.body.name;
    var link=req.body.link;
    var description=req.body.description;
    var id= Math.floor(Math.random() * (300 - 1) + 1);
    var data={
        '_id':id,
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
            res.render('index');
        }
    })
});
app.post("/edit",(req,res)=>{
    var id=req.body.product_id;
    var name_updated=req.body.product_name;
    var link_updated=req.body.updated_link;
    var description_updated=req.body.updated_description;
    var find={
        _id:parseInt(id),
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
            res.render('index');
        }
    });
});
app.get("/getall",(req,res)=>{
    dbo.collection('products').find({},{projection:{_id:0}}).toArray(function(err,result){
        if(err)
        {
            throw err;
        }
        else{
            res.render('products',{data:JSON.stringify(result)});
        }
    })
})
app.post("/del",(req,res)=>{
    var q=req.body.omit
    console.log(q);
    dbo.collection("products").find({_id:{$ne:parseInt(q)}}).toArray(function(err,result){
        res.json(result);
    })
})
app.listen(3000,(err)=>{
    if(err)
    {
        console.log("server failed");
    }
    else{
        console.log("server started");
    }
})
