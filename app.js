const express = require("express");
const path = require("path");
const session = require("express-session");
const fs = require("fs");

const app = express();
const _dirname = path.resolve();

app.use(
  session({
    secret: "BETTER@LEAVE",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("views", path.join(_dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(_dirname, "public")));

const dashboardPages = require("./routes/dashboardPages");
const dashboardApis = require("./routes/dashboardApis");
app.use("/", dashboardPages);
app.use("/api", dashboardApis);

app.get("/images", function (req, res) {
  const imagePath = path.join(__dirname, "public", req.query.id);

  if (fs.existsSync(imagePath)) {
    res.setHeader("Content-Type", "image/jpeg");
    res.sendFile(imagePath);
  } else {
    res.status(404).send("Image not found");
  }
});

const http = require("http");

const port = process.env.PORT || 8022;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app };
