const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const session = require("express-session");
var cors = require("cors");
const middleware = require("./middleware");
const aliveTime = 1000 * 60 * 30;

// Load Configurations
dotenv.config({ path: ".env" });

// Passport Configuration
require("./config/passport")(passport);

const app = express();
app.use(express.json());

var origin = "https://athlos.herokuapp.com";
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  origin = "http://localhost:3001";
}
console.log(origin);

app.use(cors({ credentials: true, origin: true }));
app.set("trust proxy", 1);

// Session Middleware
app.use(
  session({
    key: "session_id",
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: aliveTime,
      secure: true,
      httpOnly: true,
      sameSite: true,
    },
  })
);
app.use(cookieParser());

// Rate Limit Middleware
app.use(middleware.limiter);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/book", require("./routes/book"));
app.use("/facilities", require("./routes/facilities"));
app.use("/interests", require("./routes/interests"));
app.use("/promotion", require("./routes/promotion"));
app.use("/payment", require("./routes/payment"));
app.use("/chat", require("./routes/chat"));

module.exports = app;
