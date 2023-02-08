const mongoose = require("mongoose");
const db = require("../models");
const User = db.user;
const Role = db.role;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.updateUserRole = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .send({ message: "Data to update can not be empty." });
    }
    const id = mongoose.Types.ObjectId(req.query.id);
    const role = await Role.findOne({ name: req.body.roles });
    await User.findByIdAndUpdate(
      { _id: id },
      { $push: { roles: role._id } },
      { useFindAndModify: false }
    );
    res.send({ message: "User role updated successfully." });
  } catch (err) {
    res.status(500).send({ message: "Error updating user role: " + err });
  }
};
