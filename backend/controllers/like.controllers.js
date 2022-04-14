const db = require("../models/index");

exports.likePost = (req, res) => {
  db.Like.findOne({
    where: { idUSERS: req.auth.userId, idPOSTS: req.params.id },
  })
    .then((like) => {
      if (like) {
        db.Like.destroy({
          where: { idUSERS: req.auth.userId, idPOSTS: req.params.id },
        })
          .then(() =>
            res.status(200).json({
              message: "Like supprimé pour ce post",
              ...req.body,
              idPOSTS: parseInt(req.params.id),
              idUSERS: req.auth.userId,
            })
          )
          .catch((err) => res.status(400).json(err));
      } else {
        const newLike = {
          ...req.body,
          idPOSTS: parseInt(req.params.id),
          idUSERS: req.auth.userId,
        };
        db.Like.create({
          ...newLike,
        })
          .then(() =>
            res
              .status(201)
              .json({ message: "Nouveau like sur le post ", newLike })
          )
          .catch((err) => res.status(400).json({ err }));
      }
    })
    .catch((err) => res.status(500).json({ err }));
};

exports.numberOfLikes = (req, res) => {
  db.Like.count({
    where: { idPOSTS: req.params.id },
  })
    .then((number) => res.status(200).json({ number }))
    .catch((err) => res.status(400).json(err));
};
