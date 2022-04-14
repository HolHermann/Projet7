const router = require("express").Router();
const auth = require("../middleware/auth");
const postController = require("../controllers/post.controllers");
const multer = require("../middleware/multer-config");

router.post("/create", auth, multer, postController.createPost);
router.delete("/delete/:id", auth, multer, postController.deletePost);
router.get("/", auth, postController.getAllPosts);
router.put("/update/:id", auth, multer, postController.updatePost);

module.exports = router;
