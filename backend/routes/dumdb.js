const express = require("express");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

// اتصال به MongoDB
const uri =
  "mongodb://admin:jk13676974@db1.timino.co:27017/vueapp?authSource=admin&directConnection=true"; // آدرس MongoDB
const client = new MongoClient(uri);
let mongo;

client.connect().then(() => {
  mongo = client;
  console.log(" Connected to MongoDB (raw)");
});

//  مسیر داینامیک: /api/dumdb/:database/:collection
router.post("/dumdb/:database/:collection", async (req, res) => {
  const { database, collection } = req.params;
  const { action, filter = {}, data = {}, objectIdField } = req.body;

  if (!action) {
    return res
      .status(400)
      .json({ error: "Action is required (get/create/edit/delete)" });
  }

  try {
    const db = mongo.db(database);
    const col = db.collection(collection);

    // اگر لازم بود فیلدی رو به ObjectId تبدیل کن
    if (objectIdField && filter[objectIdField]) {
      filter[objectIdField] = new ObjectId(filter[objectIdField]);
    }

    let result;

    switch (action) {
      case "get":
        result = await col.find(filter).toArray();
        break;
      case "create":
        result = await col.insertOne(data);
        break;
      case "edit":
        result = await col.updateMany(filter, { $set: data });
        break;
      case "delete":
        result = await col.deleteMany(filter);
        break;
      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    res.json({ success: true, result });
  } catch (err) {
    console.error(" dumdb error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
