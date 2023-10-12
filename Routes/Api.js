const {Router} = require("express");
const ProductController = require("../Controllers/ProductController");
const router = new Router();
router.get("/", ProductController.home);
router.post("/store", ProductController.store);
router.get("/list", ProductController.list);  


module.exports = router;