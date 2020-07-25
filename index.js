const app = require("express")();
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const Nexmo = require("nexmo");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
nunjucks.configure("views", { express: app });

const nexmo = new Nexmo({
  apiKey: process.env.apiKey,
  apiSecret: process.env.apiSecret,
});

app.get("/", (req, res) => {
  res.render("index.html", { message: "Hello,world!" });
});
app.post("/verify", (req, res) => {
  nexmo.verify.request(
    {
      number: req.body.number,
      brand: "ACME Corp",
    },
    (error, result) => {
      if (result.status != 0) {
        res.render("index.html", { message: result.error_text });
      } else {
        res.render("check.html", { requestId: result.request_id });
      }
    }
  );
});
app.post("/check", (req, res) => {
  nexmo.verify.check(
    {
      request_id: req.body.requestId,
      code: req.body.code,
    },
    (error, result) => {
      if (result.status != 0) {
        res.render("index.html", { message: result.error_text });
      } else {
        res.render("success.html");
      }
    }
  );
});
app.listen(3000, console.log("Server is listening on port 3000"));
