const app = require("./app");
const pool = require("./utils/dbConnection");

const port = process.env.PORT;
console.log('Hello')
app.listen(port, () => {
  console.log("App is running on port", port);
});
