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

// genres
const genres = [
  {
    name: "allbooks",
    address: "https://www.labirint.ru/books/",
  },
  {
    name: "english",
    address: "https://www.labirint.ru/genres/2829/",
  },
  {
    name: "fiction",
    address: "https://www.labirint.ru/genres/1852/",
  },
  {
    name: "non-fiction",
    address: "https://www.labirint.ru/genres/3000/",
  },
];

genres.forEach((genre) => {
  axios.get(genre.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $("span.product-title", html).each(function () {
      const title = $(this).text();
      list.push({
        title: title,
        //   url: url,
        name: "labyrinth",
        genresource: genre.name,
      });
    });
  });
});
// start page
app.get("/", (req, res) => {
  res.render("start");
});

// page with exact id
app.get("/:id", (req, res) => {
  res.render(`${req.params.id}`, { list });
});

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));

module.exports = list;
