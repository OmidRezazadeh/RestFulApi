const {Router} = require("express");
const ProductController = require("../Controllers/ProductController");
const { authenticated } = require("../middlewares/auth");
const router = new Router();
router.get("/", ProductController.home);
router.post("/store",authenticated,ProductController.store);
router.get("/list", ProductController.list);
router.get("/:id",ProductController.single);
router.put("/:id", ProductController.edit);
router.delete("/:id",ProductController.delete);
router.post("/upload",ProductController.uploadImage)
router.get("/find-user/:id",ProductController.findUser);
module.exports = router;
 