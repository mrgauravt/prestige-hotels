var express = require("express"),
    index = express(),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    // Hotel = require("./models/hotel"),
    // Comment = require("./models/comment"),
    User = require("./models/user");

//requring routes
var commentRoutes = require("./routes/comments"),
    hotelRoutes = require("./routes/hotels"),
    authRoutes = require("./routes/auth");

var url = process.env.DATABASEURL || "mongodb://localhost/prestige_hotels";

mongoose.connect(url);
index.use(bodyParser.urlencoded({ extended: true }));
index.set("view engine", "ejs");
index.use(express.static(__dirname + "/public"));
index.use(methodOverride("_method"));
index.use(flash());

index.locals.moment = require("moment");

// PASSPORT CONFIGURATION
index.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
index.use(passport.initialize());
index.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

index.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

index.use("/", authRoutes);
index.use("/hotel_list", hotelRoutes);
index.use("/hotel_list/:id/comments", commentRoutes);

index.listen(process.env.PORT || "5500", process.env.IP || "127.0.0.1", function () {
    console.log("Server has started!!");
});