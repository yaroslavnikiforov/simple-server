const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

const mimeTypes = {
  html: "text/html",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  js: "text/javascript",
  css: "text/css"
};

http
  .createServer(function(req, res) {
    console.info("req.url: ", req.url);
    const uri = url.parse(req.url).pathname;
    console.info("uri: ", uri);
    const fileName = path.join(process.cwd(), unescape(uri));
    console.info("fileName: ", fileName);

    console.log("Loading " + uri);

    let stats;

    try {
      stats = fs.lstatSync(fileName);
      console.info("stats: ", stats);
    } catch (err) {
      res.writeHead(404, { "Content-type": "text/plain" });
      res.write("404 Not Found\n");
      res.end();

      return;
    }

    if (stats.isFile()) {
      const mimeType =
        mimeTypes[
          path
            .extname(fileName)
            .split(".")
            .reverse()[0]
        ];

      console.info("mimeType: ", mimeType);

      res.writeHead(200, { "Content-type": mimeType });

      const fileStream = fs.createReadStream(fileName);

      fileStream.pipe(res);
    } else if (stats.isDirectory()) {
      res.writeHead(302, { Location: "index.html" });
      res.end();
    } else {
      res.writeHead(500, {
        "Content-type": "text/plain"
      });
      res.write("500 Internal Error\n");
      res.end();
    }
  })
  .listen(3000);
