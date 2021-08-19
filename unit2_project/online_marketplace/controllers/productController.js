// DEPENDENCIES
const express = require("express");
const controller = express.Router();

const Product = require("../models/product");

// SEED DATA FOR TESTING
// const seedData = require("../models/seed");

// controller.get("/seed", async (req, res) => {
//     Product.create(seedData);
    
//     res.send("Added Seed Data!")
// });

// INDEX ROUTE
controller.get("/", async (req, res) => {
    const allProducts = await Product.find();

    res.render("index.ejs", {
        allProducts 
    })
});

module.exports = controller;