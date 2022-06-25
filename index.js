const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion ,ObjectId} = require('mongodb');

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.trq2z.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
try {
       const database =  await client.connect()
       if(database){
        console.log("databasee connected");
       }

       const skillCollection = client.db("portfolio").collection("skills")




       app.post("/skill",async(req,res)=> {
        const obj = req.body
        const result = await skillCollection.insertOne(obj)
        console.log(obj)
        res.send(result)

    })
       app.patch("/skill/:id",async(req,res)=> {
        const id = req.params.id
        const obj = req.body
        const query = {_id:ObjectId(id)}
        const docs = {
            $set:{
                title:obj.title,
                label:obj.label
            }
        }
        const result = await skillCollection.updateOne(query,docs)
        console.log(obj,result)
        res.send(result)

    })

    app.get("/skill",async(req,res)=> {
        const data = await skillCollection.find().toArray()
        res.send(data)
    })
    app.get("/skill/:id",async(req,res)=> {
        const id = req.params.id
        const data = await skillCollection.findOne({_id: ObjectId(id)})
        res.send(data)
    })


    app.delete("/skill/:id",async(req,res)=> {
        const id = req.params.id
        const data = await skillCollection.deleteOne({_id: ObjectId(id)})
        res.send(data)
    })
    
} finally{

}


}

run().catch(console.dir)

app.get("/",(req,res)=> {
    res.send("hi im from server")
})

app.listen(port,()=> {
    console.log("server is running on port 5000");
})