const {Router} = require("express");
const UserController = require("../Controllers/UserController");
const { authenticated } = require("../middlewares/auth");
const router = new Router();
router.post("/register", UserController.register);
router.post("/login",UserController.login);
router.post("/logout",authenticated,UserController.logout);
router.get("/test",authenticated, UserController.test);

module.exports = router;