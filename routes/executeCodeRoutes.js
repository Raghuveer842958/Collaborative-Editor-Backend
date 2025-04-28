const { executeCode } = require("../controllers/executeCodeController");

const executeCodeRouter = require("express").Router();

executeCodeRouter.post("/execute", executeCode);

module.exports = executeCodeRouter;