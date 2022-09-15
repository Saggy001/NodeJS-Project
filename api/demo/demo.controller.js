const Async = require('async');

module.exports = {
    AsyncWaterfall,
    AsyncParallel
};

function AsyncWaterfall(req, res){
 console.log("starting process");

 Async.waterfall([
     getIdFromDatabase,
     generateTokenFromId,
     setgeneratedTokenDatabase
 ], (error, result)=>{
     if(error){
         console.log("error caught"+error);
         return res.status(400).json({
             message: "error caught"
         })
     }
     console.log("completed process"+result);
     res.json({
         message: "completed process: "+result
    });
 });

 function getIdFromDatabase(cb){
     console.log("getting ID");
     cb(null, "8");
 }

 function generateTokenFromId(id, cb){
     console.log("generating token of id = "+ id);
     cb(null, "fjf09itm09tkrkgmndjg9=fid=gig9igidfgidofgfdgmfn");
 }

 function setgeneratedTokenDatabase(token, cb){
     console.log("token ", token , " is added in database");
     cb(null, "tokenization successful");
 }
}


function AsyncParallel(req, res){
    console.log("starting process");

    Async.parallel([
     getIdFromDatabase,
     generateTokenFromId,
     setgeneratedTokenDatabase
    ], (error, result)=>{
     if(error){
         console.log("error caught"+error);
         return res.status(400).json({
             message: "error caught"
         })
     }
     console.log("completed process"+result);
     res.json({
         message: "completed process: "+result
    });
 });

 function getIdFromDatabase(cb){
     console.log("getting ID");
     cb(null, "8");
 }

 function generateTokenFromId(cb){
     console.log("generating token");
     cb(null, "fjf09itm09tkrkgmgmfn");
 }

 function setgeneratedTokenDatabase( cb){
     console.log("token is added in database");
     cb(null, "tokenization successful");
 }
}


