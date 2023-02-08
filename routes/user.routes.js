const { authJwt, verifyDuplicates } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/api/test/user-role-update",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.post(
    "/api/user/update-user-role",
    [
      authJwt.verifyToken,
      authJwt.isAdminOrModerator,
      verifyDuplicates.checkDuplicateUserRole,
      verifyDuplicates.checkRolesExisted,
    ],
    controller.updateUserRole
  );
};
