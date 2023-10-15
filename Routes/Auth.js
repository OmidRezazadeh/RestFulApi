const {Router} = require("express");
const UserController = require("../Controllers/UserController");
const router = new Router();
router.post("/register", UserController.register);
router.post("/login",UserController.login);
router.post("/logout",UserController.logout)

module.exports = router;