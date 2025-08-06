const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");

const scrapeProductDetails = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const descriptionItems = [];

    const rawHTML = $(".woocommerce-product-details__short-description").html();

    if (rawHTML) {
      const parts = rawHTML.split(/<br\s*\/?>/i);

      parts.forEach((part) => {
        const cleanText = cheerio.load(part).text().trim();
        if (cleanText) {
          descriptionItems.push(cleanText);
        }
      });
    }

    return descriptionItems;
  } catch (err) {
    console.error("Error fetching product details:", err.message);
    return [];
  }
};

const scrapeBDBudgetBeauty = async (product) => {
    console.log('scrapping')
  try {
    const searchUrl = `https://bdbudgetbeauty.com/?s=${product}&post_type=product&type_aws=true`;

    const response = await axios.get(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);
    const products = [];

    const productElements = $(".content-product");

    for (let i = 0; i < productElements.length; i++) {
      const el = productElements[i];
      const name = $(el).find(".product-title a").text().trim() || "Name not found";
      const price = $(el).find(".price span").first().text().trim() || "Out Of Stock";
      const img = $(el).find(".product-content-image img").attr("src") || "Image not found";
      const product_details_link = $(el).find(".product-content-image").attr("href");

      let description = [];

      if (product_details_link) {
        description = await scrapeProductDetails(product_details_link);
      }

      const id = crypto.randomUUID();
      products.push({ id, name, price, img, product_details_link, description });
    }

    return { products };
  } catch (error) {
    console.error("Error scraping BDBudgetBeauty:", error);
    return {
      products: [],
      logo: "logo not found",
    };
  }
};

module.exports = {
  scrapeBDBudgetBeauty,
};
