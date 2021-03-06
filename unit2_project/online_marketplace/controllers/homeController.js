// DEPENDENCIES
const express = require("express");
const Product = require("../models/product");

const controller = express.Router();

// ROUTES
controller.get("/", async (req, res) => {
    try {
        let products = [];

        if (req.query.search) {
            products = await Product.find(
                {
                    $or: [
                        {
                            name: req.query.search
                        },
                        {
                            category: req.query.search
                        }
                    ]
                }
            )
            .populate(
                {
                    path: "sellerId",
                    select: "username",
                }
            )
            .sort(
                {
                    updatedAt: -1
                }
            );

        } else {
            products = await Product.find(
                {
                    status: {
                        $eq: "For Sale"
                    }
                }
            )
            .populate(
                {
                    path: "sellerId",
                    select: "username",
                }
            )
            .sort(
                {
                    updatedAt: -1
                }
            );
        };
        
        res.render("home.ejs", {
            products
        });

    } catch (err) {
        res.send(err);
    };
});

// EXPORTS
module.exports = controller;
