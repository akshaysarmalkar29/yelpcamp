const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

router.get("/", function(req, res) {
    res.render("index", {pageTitle: "Home"});
})

router.get("/register", function(req, res) {
    res.render("register", {pageTitle: "Register"});
})

router.post("/register", async function (req, res) {
   try {
    const {username, email, password} = req.body;
    const newUser = await new User({username, email});
    const user = await User.register(newUser, password);
    req.logIn(user, err => {
        if(err) return res.redirect("/register");
    });
    req.flash("success", `Welcome to Yelpcamp, ${username}`);
    res.redirect("/campgrounds");
   } catch (error) {
       req.flash("error", error.message);
       res.redirect("/register");
   }
})

router.get("/login", function(req, res) {
    if (req.isAuthenticated()) return res.redirect('/');
    if (req.query.returnTo) req.session.returnTo = req.headers.referer;
    res.render("login", {pageTitle: "Login"});
})

router.post("/login", passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
}), function(req, res) {
    const {returnTo} = req.session;
    const redirectUrl = returnTo || "/campgrounds";
    req.flash("success", `Welcome back ${req.user.username}`);
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get("/logout", function(req, res) {
    req.logOut();
    req.flash("success", "Logged out Successfully");
    res.redirect("/campgrounds");
})

module.exports = router;