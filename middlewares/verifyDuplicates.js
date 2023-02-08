const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUserRole = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.query.id }).populate(
      "roles",
      "-__v"
    );
    const hasDuplicates = user.roles.some((item) =>
      req.body.roles.includes(item.name)
    );

    if (hasDuplicates) {
      return res
        .status(400)
        .send({ message: `Role already exists for ${user.username}` });
    }
    next();
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

const checkRolesExisted = (req, res, next) => {
  if (!req.body.roles) {
    return next();
  }

  for (const role of req.body.roles) {
    if (!ROLES.includes(role)) {
      return res
        .status(400)
        .send({ message: `Failed! Role ${role} does not exist!` });
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUserRole,
  checkRolesExisted,
};

module.exports = verifySignUp;
