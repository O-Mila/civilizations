const methodOverride = require('method-override'),
bodyParser 			 = require("body-parser"),   
mongoose 			 = require("mongoose"),
express 			 = require("express"),
flash				 = require("connect-flash"),
passport			 = require("passport"),
LocalStrategy		 = require("passport-local");

const secret = process.env.SECRET,
PORT 		 = process.env.PORT,
url = process.env.DATABASEURL;

mongoose.connect(url, { useNewUrlParser: true });

var Civilization = require("./models/civilization");
var Section = require("./models/section");
var Comment = require("./models/comment");
var Account = require("./models/account");

var civilizationRoutes = require("./routes/civilizations");
var sectionRoutes = require("./routes/sections");
var indexRoutes = require("./routes/index");
var commentRoutes = require("./routes/comments");

app = express();
      
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: secret,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Info about whether the user logged in (it's passed to the template through "res.locals")
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use(civilizationRoutes);
app.use(sectionRoutes);
app.use(indexRoutes);
app.use(commentRoutes);

// Listen requests
app.listen(PORT, () => console.log(`The server Has Started on port ${PORT}!`));