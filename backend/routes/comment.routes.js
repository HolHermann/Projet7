const router = require("express").Router();
const auth = require("../middleware/auth");
const commentController = require("../controllers/comment.controllers");

router.post("/create/:idPOSTS", auth, commentController.createComment);
router.put("/update/:id", auth, commentController.updateComment);
router.get("/:idPOSTS", auth, commentController.getAllCommentsAboutPost);
router.delete("/delete/:id", auth, commentController.deleteComment);

module.exports = router;
