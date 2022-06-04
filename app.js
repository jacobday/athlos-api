const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const session = require("express-session");
var cors = require("cors");
const middleware = require("./middleware");
const aliveTime = 1000 * 60 * 30;

//Load Configurations
dotenv.config({ path: ".env" });

//Passport Configuration
require("./config/passport")(passport);

connectDB();

const app = express();

var origin = "https://athlos-ui.herokuapp.com";
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  origin = "http://localhost:3001";
}
console.log(origin);
app.use(cors({ credentials: true, origin: true }));
app.set("trust proxy", 1);

//Session Middleware
app.use(
  session({
    key: "session_id",
    secret: "mySecretKeylxinseqgh21sas98yhb",
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

//Passport Middle-ware
app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.json());
//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/book", require("./routes/book"));
app.use("/facilities", require("./routes/facilities"));
app.use("/interests", require("./routes/interests"));
app.use("/promotion", require("./routes/promotion"));
app.use("/payment", require("./routes/payment"));
app.use("/chat", require("./routes/chat"));

const PORT = process.env.PORT || 3000;

app.listen(
  PORT,
  console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
