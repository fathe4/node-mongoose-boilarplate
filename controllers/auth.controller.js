const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const mongoose = require("mongoose");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    await user.save();

    let roles = [];
    if (req.body.roles) {
      roles = await Role.find({ name: { $in: req.body.roles } });
      roles = roles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      roles = [role._id];
    }

    user.roles = roles;
    await user.save();

    res.send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
      .populate("roles", "-__v")
      .exec();
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid password." });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });
    req.session.token = token;

    const authorities = user.roles.map(
      (role) => "ROLE_" + role.name.toUpperCase()
    );
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
