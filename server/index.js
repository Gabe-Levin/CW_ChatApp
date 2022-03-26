"use strict";
const Express = require("express");
// const router = require("./router");
const app = Express();

const PORT = 5000;

app.use(Express.static("./client"));
app.use(Express.json());
// app.use(router);
app.listen(PORT, () => {
  console.log(`🍞 🍞 server running at http://localhost:${PORT}🍞 🍞 `);
});
