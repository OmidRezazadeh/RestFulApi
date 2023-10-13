const Product = require("../Models/Product");
const { transformData } = require('../utils/ProductTransformData');
exports.home = (req, res) => {
  res.status(200).json({ toplearn: "Hello blog m" });
};

exports.store = async (req, res) => {
  try {
    const { name, price, quantity, image } = req.body;
    const product = await Product.create({ name, price, quantity, image });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Product creation failed" });
  }
};

exports.list = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 2;

  try {
    const options = {
      page, limit,
      sort: { _id: -1 }  
  };
    const products = await Product.paginate({}, options);
    const productsCollection = transformData(products.docs, page, limit);
    res.status(200).json(productsCollection);
  } catch (err) {
    console.log(err);
    res.status(500).json( {error: err});
  }
};
 