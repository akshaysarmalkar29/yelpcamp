const express = require("express");
const passport = require("passport");
const router = express.Router();
const {getHomePage, getRegister, postRegister, getLogin, postLogin, getLogout} = require("../controllers/index");

router.get("/", getHomePage)

router.get("/register", getRegister)

router.post("/register", postRegister)

router.get("/login", getLogin)

router.post("/login", passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
}), postLogin)

router.get("/logout", getLogout)

module.exports = router;