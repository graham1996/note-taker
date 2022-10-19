// const express = require('express');
const router = require('express').Router();
const notesRoute = require('./notes');
// const router = express();

router.use(notesRoute);
module.exports = router;