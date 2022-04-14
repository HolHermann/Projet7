const router = require("express").Router();
const auth = require("../middleware/auth");
const authController = require("../controllers/user.controllers");
const multer = require("../middleware/multer-config");

router.post("/register", multer, authController.signUp); // OK
router.post("/login", authController.signIn); // Ok
router.get("/logout/", authController.logout);
router.put("/update/:id", auth, authController.updateUser); // Ok
router.get("/:id", auth, authController.getOneUser); // Ok
router.get("/", auth, authController.getAllUsers); // OK
router.delete("/delete/:id", auth, multer, authController.deleteUser); // Ok
router.put("/update/avatar/:id", auth, multer, authController.updateAvatar);

module.exports = router;
