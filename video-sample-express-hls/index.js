const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require('cors');
const app = express();
const port = 3003;

app.use(cors())
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/video/:path", (request, response) => {
  
  
  var filePath = path.resolve(".", "public", "videos", request.params.path);
  console.log("request starting...", filePath);

  // response.send(filePath);

  fs.readFile(filePath, (error, content) => {
    response.writeHead(200, { "Access-Control-Allow-Origin": "*" });

    if (error) {
      if (error.code == "ENOENT") {
        response.end('Not found', "utf-8");
      } else {
        response.writeHead(500);
        response.end(
          "Sorry, check with the site admin for error: " + error.code + " ..\n"
        );
        response.end();
      }
    } else {
      response.end(content, "utf-8");
    }
  });

  // fs.readFile(filePath, function(error, content) {
  //     response.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
  //     if (error) {
  //         if(error.code == 'ENOENT'){
  //             fs.readFile('./404.html', function(error, content) {
  //                 response.end(content, 'utf-8');
  //             });
  //         }
  //         else {
  //             response.writeHead(500);
  //             response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
  //             response.end();
  //         }
  //     }
  //     else {
  //         response.end(content, 'utf-8');
  //     }
  // });
});

const server = app.listen(3000);

// new hls(server, {
//   provider: {
//       exists: (req, cb) => {
//           const ext = req.url.split('.').pop();

//           if (ext !== 'm3u8' && ext !== 'ts') {
//               return cb(null, true);
//           }

//           fs.access(__dirname + req.url, fs.constants.F_OK, function (err) {
//               if (err) {
//                   console.log('File not exist');
//                   return cb(null, false);
//               }
//               cb(null, true);
//           });
//       },
//       getManifestStream: (req, cb) => {
//           const stream = fs.createReadStream(__dirname + req.url);
//           cb(null, stream);
//       },
//       getSegmentStream: (req, cb) => {
//           const stream = fs.createReadStream(__dirname + req.url);
//           cb(null, stream);
//       }
//   }
// });
