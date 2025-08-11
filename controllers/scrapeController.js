
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

            if (bdBudgetBeautyProducts.products.length > 0) {
                await Query.create({ query: [cleanedProduct] });
                const newProduct = {
                    name: cleanedProduct,
                    products: bdBudgetBeautyProducts.products,
                    logo: bdBudgetBeautyProducts.logo,
                };
                await Product.create(newProduct);

                const allProducts = await Product.find({ name: cleanedProduct });

               const sortedProducts = allProducts.map(prod => {
                    return {
                        ...prod._doc,
                        products: prod.products.sort((a, b) => {
                            const priceA = parseFloat(a.price.replace(/[^\d.]/g, ""));
                            const priceB = parseFloat(b.price.replace(/[^\d.]/g, ""));
                            return priceA - priceB;
                        })
                    };
                });
                return res.status(201).json({
                    success: true,
                    message: "Product Fetched successfully.",
                    data: sortedProducts,
                });
            }

            if (!bdBudgetBeautyProducts.products.length > 0) {
                return res.status(404).json({
                    success: false,
                    message: "No products found from scraper.",
                });
            }


        } else {
            const storedProduct = await Product.find({ name: cleanedProduct });

             const sortedStoredProduct = storedProduct.map(prod => {
                return {
                    ...prod._doc,
                    products: prod.products.sort((a, b) => {
                        const priceA = parseFloat(a.price.replace(/[^\d.]/g, ""));
                        const priceB = parseFloat(b.price.replace(/[^\d.]/g, ""));
                        return priceA - priceB;
                    })
                };
            });

            return res.status(200).json({
                success: true,
                message: "Product retrieved from database.",
                data: sortedStoredProduct,
            });
        }
    } catch (err) {
        console.error("Error in scrapeProduct:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};



exports.getProductByPrice = async (req, res) => {
    try {
        const products = await Product.find().sort({ price: 1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.home = (req, res) => {
    res.send("Welcome to the BDBudgetBeauty Scraper API!");
};
