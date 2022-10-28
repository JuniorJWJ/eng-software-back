const express = require("express");

const userController = require("./controllers/UserController");

const { eAdmin } = require("../middlewares/auth");
const multer = require("multer");
const multerConfig = require("./config/multer");
const route = express.Router();

//User
// route.get('/api/user/list', eAdmin, userController.show_users)
route.get("/list", userController.show_users); // teste
route.get("/api/user/list", eAdmin, userController.show_users);
route.get("/api/user/show/:id", eAdmin, userController.show);
route.post(
  "/api/user/register",
  multer(multerConfig).single("file"),
  userController.create
);
route.post("/api/login", userController.log_user);
route.put("/api/user/update/:id", eAdmin, userController.update);
route.put(
  "/api/user/reset-password/:id",
  eAdmin,
  userController.update_password
);
route.delete("/api/user/delete/:id", eAdmin, userController.delete);

module.exports = route;
