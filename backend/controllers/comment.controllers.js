const db = require("../models/index");

exports.createComment = (req, res) => {
  if (req.body.content.trim().length === 0)
    return res.status(400).json({
      message: "Les données saisis sont inccorects.",
    });
  db.Post.findOne({
    where: { id: req.params.idPOSTS },
  })
    .then((post) => {
      if (!post) {
        return res.status(400).json({ message: "Post inconnu" });
      }
      const comment = { ...req.body };
      db.Comment.create({
        ...comment,
        idUSERS: req.auth.userId,
        idPOSTS: req.params.idPOSTS,
      })
        .then(() =>
          res.status(201).json({
            message: "Le commentaire a été crée",
            comment,
          })
        )
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) => res.status(400).json(err));
};

exports.updateComment = (req, res) => {
  if (req.body.content.length === 0) {
    return res.status(400).json({
      message: "Les données saisis sont inccorects.",
    });
  }
  db.Comment.findOne({
    where: {
      id: req.params.id,
    },
  }).then((comment) => {
    if (!comment)
      return res.status(404).json({ message: "Commentaire inconnu" });
    if (req.auth.userId !== comment.userId)
      return res.status(403).json({ message: "Requête non autorisée" });
    comment
      .update({ content: req.body.content })
      .then(() => res.status(200).json(req.body.content));
  });
};

exports.getAllCommentsAboutPost = (req, res) => {
  db.Post.findOne({
    where: { id: req.params.idPOSTS },
  })
    .then((post) => {
      if (!post) {
        return res.status(400).json({ message: "Post inconnu" });
      }
      db.Comment.findAll({
        where: {
          idPOSTS: req.params.idPOSTS,
        } /*
        include: [
          {
            model: db.User,
            model: db.Post,
            model: db.Like,
            //idPOSTS: req.params.idPOSTS,
          },
        ],*/,
      })
        .then((comments) => res.status(200).json(comments))
        .catch((error) => res.status(404).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

//delete
exports.deleteComment = (req, res) => {
  db.Comment.findOne({
    where: { id: req.params.id },
  })
    .then((comment) => {
      if (!comment) {
        return res.status(400).json({ message: "Commentaire introuvable" });
      }

      if (comment.idUSERS !== req.auth.userId && req.admin.isAdmin === false) {
        return res.status(401).json({ message: "Requête non autorisée" });
      }
      comment
        .destroy()
        .then(() => res.status(200).json({ message: "Commentaire supprimé" }))
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((err) => res.status(500).json(err));
};
