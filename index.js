const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const PORT = process.env.PORT;

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        
        await client.connect();

        const db = client.db("SportNest");
        const facilities = db.collection("Facilities");

        app.get("/all-facilities", async(req,res)=> {
            const result = await facilities.find().toArray();
            res.json(result);
        })
        
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Hello how you doing!")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})