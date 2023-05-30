const express = require("express");
const MongoClient = require("mongodb").MongoClient; // DB연결

require("dotenv").config();

let db;

const connect = () => {
  MongoClient.connect(
    process.env.DB_URI,
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
