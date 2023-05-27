const app = require("./app");
const { serverPort } = require("./secret");
const connectDB = require("./config/db");

app.listen(serverPort, async () => {
  console.log('Server running at http://localhost:${serverPort}');
  await connectDB();
});
