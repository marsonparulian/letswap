const http = require("http");

function checkLocalhost() {
  return new Promise((resolve, reject) => {
    http
      .get("http://localhost:3000", (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          reject(
            new Error(`Server responded with status code ${res.statusCode}`)
          );
        }
      })
      .on("error", (err) => {
        reject(
          new Error(
            'Server is not running. Please start the dev server with "npm run dev" first.'
          )
        );
      });
  });
}

checkLocalhost()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\x1b[31m%s\x1b[0m", err.message);
    process.exit(1);
  });
