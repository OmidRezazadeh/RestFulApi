const {Router} = require("express");
const ProductController = require("../Controllers/ProductController");
const router = new Router();
router.get("/", ProductController.home);
router.post("/store", ProductController.store);
router.get("/list", ProductController.list);
router.get("/:id",ProductController.single);
router.put("/:id", ProductController.edit);
router.delete("/:id",ProductController.delete);


module.exports = router;
 