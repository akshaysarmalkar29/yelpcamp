require('dotenv').config();

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const session = require("express-session");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user");
const flash = require("connect-flash");

// Routes
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const indexRoutes = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname + "/public")));

app.use(session({
    secret: "This is a very big secret!!",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// Merge Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err, pageTitle: "Error Page" })
})

app.listen(3000, () => {
    console.log("Server running on Port 3000");
})