const User = require("../models/user");

module.exports = {
    getHomePage: function(req, res) {
        res.render("index", {pageTitle: "Home"});
    },
    getRegister: function(req, res) {
        res.render("register", {pageTitle: "Register"});
    },
    postRegister: async function (req, res) {
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
     },
     getLogin: function(req, res) {
        if (req.isAuthenticated()) return res.redirect('/');
        if (req.query.returnTo) req.session.returnTo = req.headers.referer;
        res.render("login", {pageTitle: "Login"});
    },
    postLogin: function(req, res) {
        const {returnTo} = req.session;
        const redirectUrl = returnTo || "/campgrounds";
        req.flash("success", `Welcome back ${req.user.username}`);
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    },
    getLogout: function(req, res) {
        req.logOut();
        req.flash("success", "Logged out Successfully");
        res.redirect("/campgrounds");
    }
}