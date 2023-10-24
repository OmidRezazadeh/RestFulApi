const Product = require("../Models/Product");
const { transformData } = require("../utils/ProductTransformData");
const { ObjectId } = require("mongoose").Types;
const multer = require("multer");
const { upload, fileFilter } = require("../utils/upload");
const path = require("path");
const appRoot = require("app-root-path");
const sharp = require("sharp");
const fs = require("fs");
const shortId = require("shortid");
const productValidation = require("../Models/Validation/productValidation");

exports.home = (req, res) => {
  res.status(200).json({ toplearn: "Hello blog m" });
};
exports.store = async (req, res, next) => {
  try {
    const filePath = `./public/upload/images/${req.body.image}`;
    if (!fs.existsSync(filePath)) {
      const error = new Error("عکس مورد نظرذ یافت نشد");
      error.status = 404;
      throw error;
    }
    const { error, value } = productValidation.productSchema.validate(req.body);
    if (error) {
      const errors = new Error(error.details[0].message);
      errors.statusCode = 400;
      throw errors;
    }

    const { name, price, quantity, image } = value;
    const product = await Product.create({
      name,
      price,
      quantity,
      image,
      user: req.userId,
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
    console.log(err);
    res.status(500).json({ error: "خطای سرور رخ داد" });
  }
};
exports.list = async (req, res) => {
  const page = req.query.page || 1;
  const limit = 2;

  try {
    const options = {
      page,
      limit,
      sort: { _id: -1 },
      populate: "user",
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
    res.status(500).json({ error: err });
  }
};

exports.findUser =async (req, res) => {
  const userId = req.params.id;
  const products = await Product.findByUserIdMethod(userId);
  res.status(200).json(products);

};

exports.single = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!ObjectId.isValid(productId)) {
      const error = new Error("شناسه وارد شده صحیح  نیست");
      error.status = 400;
      throw error;
    }
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("محصولی یافت نشد");
      error.status = 404;
      throw error;
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
    console.error(err);
    res.status(500).json({ error: "خطای سرور" });
  }
};
exports.edit = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!ObjectId.isValid(productId)) {
      const error = new Error("شناسه محصول صحیح نیست");
      error.statusCode = 400;
      throw error;
    }
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("محصولی یافت نشد");
      error.statusCode = 404;
      throw error;
    }

    const { error, value } = productValidation.productSchema.validate(req.body);
    if (error) {
      const errors = new Error(error.details[0].message);
      errors.statusCode = 400;
      throw errors;
    }

    const filePath = `./public/upload/images/${req.body.image}`;
    const fileExtension = path.extname(filePath).toLowerCase();
    const mimeTypeArray = [".jpeg", ".png"];
    if (!mimeTypeArray.includes(fileExtension)) {
      const error = new Error("پسوند عکس معتبر نیست ");
      error.statusCode = 400;
      throw error;
    }

    if (!fs.existsSync(filePath)) {
      const error = new Error("عکس مورد نظر یافت نشد");
      error.statusCode = 400;
      throw error;
    }

    if (req.body.image !== product.image) {
      const filePath = `${appRoot}/public/upload/images/${product.image}`;
      fs.unlinkSync(filePath);
    }

    const { name, price, quantity, image } = value;
    product.name = name;
    product.price = price;
    product.quantity = quantity;
    product.image = image;
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    next(err);
  }
};
exports.delete = async (req, res, next) => {
  try {
    const productId = req.params.id;
    if (!ObjectId.isValid(productId)) {
      const error = new Error("شناسه محصول صحیح نیست");
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(productId);
    if (product.deletedAt === true) {
      const error = new Error("محصول حذف شده است");
      error.statusCode = 404;
      throw error;
    }

    if (!product) {
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
    res.status(200).json({ message: "product has been successfully removed" });
  } catch (err) {
    next(err);
  }
};
exports.uploadImage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      // Handle any errors
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(422).json({
          error: "حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد",
        });
      }
      res.status(400).json({ error: err });
    } else {
      // Handle successful upload
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "جهت آپلود باید عکسی انتخاب کنید" });
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
};
