const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const pdfkit = require("pdfkit");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// CONNECT TO MONGODB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vormdea.mongodb.net/?appName=Cluster0`;
const client = new MongoClient(uri);

async function run() {
    try {
        // await client.connect();
        const database = client.db("bill-management");
        const billsCollection = database.collection("bills");
        const myBillsCollection = database.collection("myBills");

        console.log("Connected to MongoDB successfully!");

        //  ALL ROUTES BELOW 

        app.get("/", (req, res) => {
            res.send("Bill Management Server is Running...");
        });

      
        
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });

    } catch (error) {
        console.error("Connection Error:", error);
    }
}

run().catch(console.dir);