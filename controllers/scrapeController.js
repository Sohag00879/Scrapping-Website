
const Product = require("../models/product");
const Query = require("../models/query");
const { scrapeBDBudgetBeauty } = require("../services/scraperService");

exports.scrapeProduct = async (req, res) => {
    try {
        let product = req.params.product;
        const cleanedProduct = product.replace(/\s+/g, "%20");

        const existingQuery = await Query.findOne({ query: cleanedProduct });

        if (!existingQuery) {
            const bdBudgetBeautyProducts = await scrapeBDBudgetBeauty(cleanedProduct);

            if (bdBudgetBeautyProducts.products.length>0) {
                await Query.create({ query: [cleanedProduct] });
            }

            if (!bdBudgetBeautyProducts.products.length > 0) {
                return res.status(404).json({
                    success: false,
                    message: "No products found from scraper.",
                });
            }

            const newProduct = {
                name: cleanedProduct,
                products: bdBudgetBeautyProducts.products,
                logo: bdBudgetBeautyProducts.logo,
            };

           if(bdBudgetBeautyProducts.products.length<0){
             await Product.create(newProduct);
           }else{
            await Product.create(newProduct);
           }

            return res.status(201).json({
                success: true,
                message: "Product Fetched successfully.",
                data: newProduct,
            });
        } else {
            const storedProduct = await Product.find({ name: cleanedProduct });

            return res.status(200).json({
                success: true,
                message: "Product retrieved from database.",
                data: storedProduct,
            });
        }
    } catch (err) {
        console.error("Error in scrapeProduct:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.home = (req, res) => {
    res.send("Welcome to the BDBudgetBeauty Scraper API!");
};
