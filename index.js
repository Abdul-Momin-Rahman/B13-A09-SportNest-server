const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const bookings = db.collection("Bookings")

        app.get("/all-facilities", async (req, res) => {
            const result = await facilities.find().toArray();
            res.json(result);
        })

        app.get('/all-facilities/:id', async (req, res) => {
            const { id } = req.params

            const result = await facilities.findOne({ _id: new ObjectId(id) })

            res.json(result)
        })

        app.post('/add-facility', async (req, res) => {
            const data = req.body;
            // console.log(data)

            const { name, type, email, location, price, capacity, description, image, slots } = data;

            const facility = {
                name,
                facility_type: type,
                location,
                price_per_hour: Number(price),
                capacity : Number(capacity),
                available_slots: slots,
                description,
                owner_email: email,
                booking_count: 0,
                image_url: image

            }

            const result = await facilities.insertOne(facility)

            res.json(result)
        })

        app.post('/all-facilities/:id', async(req ,res ) => {
            const booking = req.body;
            // console.log(data)

            const result = await bookings.insertOne(booking)
            res.json(result)
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