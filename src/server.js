const { PORT = 5000 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

app.listen(PORT, () => console.log("Listening on port 5000"));
