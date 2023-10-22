const Product = require("../Models/Product");
const {transformData} = require("../utils/ProductTransformData");
const {ObjectId} = require('mongoose').Types;
const multer = require("multer");
const {upload, fileFilter } = require("../utils/upload");
const path = require("path");
const appRoot = require("app-root-path");
const sharp = require("sharp");
const fs = require('fs');
const shortId = require("shortid");
const productValidation = require('../Models/Validation/productValidation');

exports.home = (req, res) => {
    res.status(200).json({toplearn: "Hello blog m"});
};
exports.store = async (req, res) => {
    try {
        const filePath = `./public/upload/images/${req.body.image}`;
        if (!fs.existsSync(filePath)) {
            return res.status(400).json({message: 'عکس مورد نظر یافت نشد'});
        }
        const {error, value} = productValidation.productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }

        const {name, price, quantity, image} = value;
        const product = await Product.create({name, price, quantity, image, user: req.userId});
        res.status(201).json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Product creation failed"});
    }
};
exports.list = async (req, res) => {
    const page = req.query.page || 1;
    const limit = 2;

    try {
        const options = {
            page, limit, sort: {_id: -1}, populate: 'user',
        };

        const searchQuery = {};

        if (req.body.quantity) {
            searchQuery.quantity = req.body.quantity;
        }


        if (req.body.price) {
            searchQuery.price = req.body.price;
        }


        if (req.body.name) {
            searchQuery.name = req.body.name;
        }

        const products = await Product.paginate(searchQuery, options);
        const productsCollection = transformData(products.docs, page, limit);
        res.status(200).json(productsCollection);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err});
    }
};
exports.single = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({error: 'Invalid product ID'});
        }
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({error: 'Product not found'});

        res.status(200).json(product);

    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
};
exports.edit = async (req, res) => {
    try {
        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({message: 'Invalid product ID'});
        }
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({message: 'Product not found'});


        const {error, value} = productValidation.productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({message: error.details[0].message});
        }

        const filePath = `./public/upload/images/${req.body.image}`;

        const fileExtension = path.extname(filePath).toLowerCase();
        const mimeTypeArray = [".jpeg", ".png"]
        if (!mimeTypeArray.includes(fileExtension)) {
            return res.status(400).json({message: 'پسوند عکس معتبر نیست '});
        }

        if (!fs.existsSync(filePath)) {
            return res.status(400).json({message: 'عکس مورد نظر یافت نشد'});
        }

        if (req.body.image !== product.image) {
            const filePath = `${appRoot}/public/upload/images/${product.image}`;
            fs.unlinkSync(filePath);
        }


        const {name, price, quantity, image} = value;
        product.name = name;
        product.price = price;
        product.quantity = quantity
        product.image = image;
        await product.save();
        res.status(200).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Internal server error'});
    }
};
exports.delete = async (req, res) => {

    try {
        const productId = req.params.id;
        if (!ObjectId.isValid(productId)) {
            const error = new Error("شناسه محصول صحیح نیست");
            error.statusCode = 400;
            throw error;   
        }

        const product = await Product.findById(productId);
        if (!product){
            const error = new Error("محصولی با این شناسه یافت نشد");
            error.statusCode = 404;
            throw error;   
            
        }

        const filePath = `${appRoot}/public/upload/images/${product.image}`;
        if (!fs.existsSync(filePath)) {
            const error = new Error("فایلی یافت نشد");
            error.statusCode = 400;
            throw error;   
        }

        fs.unlinkSync(filePath);
        product.deletedAt = true;
        await product.save();
        res.status(200).json({"message": "product has been successfully removed"})
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'مشکلی پیش امده'});
    }
}
exports.uploadImage = async (req, res) => {

    upload(req, res, async (err) => {
        if (err) {
          // Handle any errors
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(422).json({
              error: 'حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد',
            });
          }
          res.status(400).json({ error: err });
        } else {
          // Handle successful upload
          if (!req.file) {
            return res.status(400).json({ error: 'جهت آپلود باید عکسی انتخاب کنید' });
          }
    
          const fileName = `${shortId.generate()}_${req.file.originalname}`;
          await sharp(req.file.buffer)
            .jpeg({ quality: 60 })
            .toFile(`./public/upload/images/${fileName}`);
    
          res.status(200).json({
            image: `http://localhost:3000/uploads/${fileName}`,
          });
        }
      });
    }
    
  
