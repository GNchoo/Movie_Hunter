const express = require("express");
const MongoClient = require("mongodb").MongoClient; // DB연결

let db;

const connect = () => {
  const uri =
    "mongodb+srv://admin:1q2w3e4r@cluster0.yvz01u3.mongodb.net/?retryWrites=true&w=majority";
  MongoClient.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, client) => {
      if (err) return console.log(err);
      db = client.db("Movie");
      console.log("Connected to MongoDB");
    }
  );
};
const getDB = () => {
  return db;
};

module.exports = { connect, getDB };
