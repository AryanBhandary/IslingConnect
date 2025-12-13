const express = require ("express")
const { getAllUsers, countUsers } = require ("../controllers/userControllers")

const router = express.Router();

router.get("/getAll", getAllUsers)
router.get("/count", countUsers)
module.exports = router;