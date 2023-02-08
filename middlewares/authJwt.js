const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  const token = req.session.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const checkRole = async (userId, roleName) => {
  const user = await User.findById(userId).exec();
  if (!user) {
    return false;
  }
  const roles = await Role.find({ _id: { $in: user.roles } }).exec();
  return roles.some((role) => roleName.includes(role.name));
};

const isAdmin = async (req, res, next) => {
  if (!(await checkRole(req.userId, ["admin"]))) {
    return res.status(403).send({ message: "Require Admin Role!" });
  }
  next();
};

const isModerator = async (req, res, next) => {
  if (!(await checkRole(req.userId, ["moderator"]))) {
    return res.status(403).send({ message: "Require Moderator Role!" });
  }
  next();
};

const isAdminOrModerator = async (req, res, next) => {
  if (!(await checkRole(req.userId, ["moderator", "admin"]))) {
    return res
      .status(403)
      .send({ message: "Require Moderator or admin Role!" });
  }
  next();
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isAdminOrModerator,
};

module.exports = authJwt;
