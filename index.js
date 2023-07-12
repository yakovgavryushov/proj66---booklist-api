const PORT = 4000;
const path = require("path");
const express = require("express");
const exphbr = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

// express-handlebars

app.engine("handlebars", exphbr.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// list of what will be recieved
const list = [];

app.get("/", (req, res) => {
  res.render("start");
});

app.get("/allbooks", (req, res) => {
  axios
    .get("https://www.labirint.ru/books/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $("span.product-title", html).each(function () {
        const title = $(this).text();
        // const url = $(this).attr("href");
        list.push({
          title: title,
          //   url: url,
          name: "labyrinth",
        });
      });

      console.log(list);
      res.render("allbooks", { list });
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));

module.exports = list;
