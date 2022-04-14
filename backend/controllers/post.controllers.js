const db = require("../models/index");
const fs = require("fs");

exports.createPost = (req, res) => {
  if (req.body.content && req.body.content.trim().length === 0 && !req.file) {
    return res.status(400).json({
      message: "Les données saisis sont inccorects.",
    });
  }
  const newPost = req.file
    ? {
        ...JSON.parse(req.body.post),
        attachment: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body }; // On récupère le corps de la requête
  /*if (newPost.idUSERS !== req.auth.userId) {
    return res.status(401).json({ message: "Requête non autorisée" });
  }*/
  db.Post.create({ ...newPost, idUSERS: req.auth.userId })
    .then(() =>
      res.status(201).json({ message: "Le post a été crée", ...newPost })
    )
    .catch((err) => res.status(400).json({ err }));
};

exports.deletePost = (req, res) => {
  db.Post.findOne({
    where: { id: req.params.id },
  })
    .then((post) => {
      if (!post) {
        return res.status(400).json({ message: "Post inconnu !" });
      }

      if (post.idUSERS !== req.auth.userId && req.admin.isAdmin === false) {
        return res.status(401).json({ message: "Requête non autorisée" });
      }
      if (post.attachment && post.attachment !== "") {
        const oldImage = post.attachment.split("/images/")[1];
        fs.unlink(`images/${oldImage}`, () => console.log("image supprimée"));
      }
      post
        .destroy()
        .then(() => res.status(200).json({ message: "Post supprimé" }))
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};
exports.updatePost = (req, res) => {
  const postUpdate = req.file
    ? {
        ...JSON.parse(req.body.post),
        attachment: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  if (postUpdate.content.trim().length === 0 && !req.file) {
    return res.status(400).json({
      message: "Les données saisis sont inccorects.",
    });
  }
  db.Post.findOne({
    where: { id: req.params.id },
  })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ message: "Post introuvable" });
      }
      if (req.auth.userId !== post.idUSERS) {
        return res.status(401).json({ message: "Requête non autorisée" });
      }
      if (req.file && post.attachment !== "") {
        const oldImage = post.attachment.split("/images/")[1];
        fs.unlinkSync(`images/${oldImage}`);
      }
      db.Post.update({ ...postUpdate }, { where: { id: req.params.id } })
        .then(() =>
          res.status(200).json({ ...postUpdate, id: parseInt(req.params.id) })
        ) //
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};

exports.getAllPosts = (req, res) => {
  db.Post.findAll({
    include: [
      //{ model: db.User },
      //{ model: db.Like },
      //{ model: db.Comment, order: [["id", "ASC"]] },
    ],
    //du plus recent au plus ancien
    //order: [["id", "DESC"]],
  })
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(400).json({ error }));
};
