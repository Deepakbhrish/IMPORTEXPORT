const  cds = require("@sap/cds");
const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://deepak81:<BvjnwLqHrP2zNxXd>@ac-wkqvdzv-shard-00-00.8lriduv.mongodb.net:27017,ac-wkqvdzv-shard-00-01.8lriduv.mongodb.net:27017,ac-wkqvdzv-shard-00-02.8lriduv.mongodb.net:27017/IMPortDatabase?ssl=true&replicaSet=atlas-jqnu69-shard-0&authSource=admin&retryWrites=true&w=majority";
const db_name ="IMPortDatabase";
const client = new MongoClient(uri);
const ObjectId = require('mongodb').ObjectId

async function _createBooks(req){
    await client.connect();
    var db = await client.db(IMPortDatabase);
    var Books = await db.collection("Books");
    const results = await Books.insertOne(req.data);

    if(results.insertedId){
        req.data.id= results.insertedId;
    }
    return req.data
}
module.exports= cds.service.impl(function(){
    const {Books} = this.entities;
    this.on("INSERT", Books, _createBooks)
});