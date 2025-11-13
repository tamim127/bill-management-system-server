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

        app.get("/bills", async (req, res) => {
            const { category } = req.query;
            let query = {};
            if (category && category !== "All") {
                query.category = { $regex: new RegExp(`^${category}$`, "i") };
            }
            const bills = await billsCollection.find(query).toArray();
            res.send(bills);
        });

       

        app.get("/bills/:id", async (req, res) => {
            const id = req.params.id;
            const bill = await billsCollection.findOne({ _id: new ObjectId(id) });
            if (!bill) return res.status(404).json({ message: "Bill not found" });
            res.send(bill);
        });

        app.get("/recent-bills", async (req, res) => {
            const bills = await billsCollection.find().sort({ date: -1 }).limit(6).toArray();
            res.send(bills);
        });

        app.post("/myBills", async (req, res) => {
            const { billId, username, phone, address, email, amount, date } = req.body;
            if (!billId || !username || !phone || !address || !email || !amount || !date) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const billData = { billId, username, phone, address, email, amount, date, createdAt: new Date() };
            const result = await myBillsCollection.insertOne(billData);
            res.json({ success: true, insertedId: result.insertedId });
        });

        app.get("/my-bills", async (req, res) => {
            const { email } = req.query;
            if (!email) return res.status(400).json({ message: "Email is required" });
            const userBills = await myBillsCollection.find({ email }).sort({ createdAt: -1 }).toArray();
            res.send(userBills);
        });

        app.put("/my-bills/:id", async (req, res) => {
            const { id } = req.params;
            const updatedData = req.body;
            const result = await myBillsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedData }
            );
            if (result.modifiedCount > 0) {
                res.json({ success: true, message: "Bill updated successfully" });
            } else {
                res.json({ success: false, message: "No changes made" });
            }
        });

        app.delete("/my-bills/:id", async (req, res) => {
            const { id } = req.params;
            const result = await myBillsCollection.deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount > 0) {
                res.json({ success: true, message: "Bill deleted successfully" });
            } else {
                res.json({ success: false, message: "Bill not found" });
            }
        });

        app.get("/my-bills/download", async (req, res) => {
            const { email } = req.query;
            if (!email) return res.status(400).json({ message: "Email is required" });

            const bills = await myBillsCollection.find({ email }).sort({ createdAt: -1 }).toArray();
            const doc = new pdfkit();
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${email}-bills.pdf`);
            doc.pipe(res);
            doc.fontSize(18).text(`Billing Report for ${email}`, { underline: true });
            doc.moveDown();
            bills.forEach((bill, idx) => {
                doc.fontSize(12).text(`${idx + 1}. ${bill.username} - ${bill.amount} - ${bill.date}`);
            });
            doc.end();
        });



      
        
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });

    } catch (error) {
        console.error("Connection Error:", error);
    }
}

run().catch(console.dir);