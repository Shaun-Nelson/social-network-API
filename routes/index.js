const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

// If no API routes are hit, send the error message
router.use((req, res) => res.send("Wrong route!"));

module.exports = router;
