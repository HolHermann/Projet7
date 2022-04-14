const router = require("express").Router();
const likeController = require("../controllers/like.controllers");
const auth = require("../middleware/auth");

router.post("/:id", auth, likeController.likePost);
router.get("/:id", auth, likeController.numberOfLikes);

module.exports = router;
