const db = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      db.User.create({
        email: req.body.email,
        username: req.body.username,
        password: hash,
        bio: req.body.bio,
        avatar: `${req.protocol}://${req.get(
          "host"
        )}/images/AvatarProfile/random-user.png`,
      });
    })
    .then((user) => {
      res.status(201).json({ message: "Utilisateur créé !" });
    })
    .catch((err) =>
      res.status(400).json({
        error: err.parent.errno,
        sqlMessage: err.parent.sqlMessage,
      })
    )
    .catch((err) => res.status(500).json({ err }));
};

exports.signIn = (req, res) => {
  db.User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user.id,
            token: jwt.sign(
              {
                userId: user.id,
                isAdmin: user.isAdmin,
              },
              process.env.Token,
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
};

exports.logout = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);
  if (token) {
    jwt.destroy(token);
    res.status(200).json({ message: "Déconnexion réussi" });
  }
};

exports.updateUser = (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé " });
      }
      if (req.auth.userId !== user.id) {
        return res.status(401).json({ message: "Requête non autorisée" });
      }

      user
        .update({ bio: req.body.bio, username: req.body.username })
        .then(() => {
          res.status(200).json({ message: "Profil mit à jour" });
        })
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => res.status(500).json({ err }));
};

exports.getOneUser = (req, res) => {
  db.User.findOne({
    attributes: { exclude: ["password", "email"] },
    where: { id: req.params.id },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json(user);
    })
    .catch((err) => res.status(500).json({ err }));
};

exports.getAllUsers = (req, res, next) => {
  db.User.findAll({
    attributes: { exclude: ["password", "email", "isAdmin"] },
  })
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json({ err }));
};
exports.deleteUser = (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      if (user.id !== req.auth.userId && req.admin.isAdmin == false) {
        return res.status(401).json({ message: "Requête non authorisée" });
      }
      user
        .destroy()
        .then(() => {
          res.status(200).json({ message: "Utilisateur supprimé" });
        })
        .catch((err) => res.status(400).json({ err }));
    })
    .catch((err) => res.status(400).json({ err }));
};
exports.updateAvatar = (req, res) => {
  db.User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(400).json({ message: "Utilisateur inconnu !" });
      }
      if (req.auth.userId !== user.id) {
        return res.status(401).json({ message: "Requête non autorisée" });
      }
      const filename = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
      user
        .update({
          avatar: filename,
        })
        .then(() =>
          res.status(201).json({ message: "avatar mis à jour avec succés ! " })
        )
        .catch((err) => res.status(500).json({ err }));
    })
    .catch((err) => res.status(501).json({ err }));
};
