const express = require("express");
const { createUser, fetchUsers, fetchOneUser, updateUser, deleteUser, myDetails } = require("../controllers/userControllers")
const { createUserSchema, updateUserSchema } = require("../utils/validationSchemas")
const validate = require("../middlewares/userValidateMiddleware")
const {checkUserLogin, authorize} = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/", validate(createUserSchema), createUser)
router.get("/", checkUserLogin, fetchUsers)
router.get("/profile", checkUserLogin, myDetails)
router.get("/:id", checkUserLogin, authorize(["admin"]), fetchOneUser)
router.patch("/:id", checkUserLogin, validate(updateUserSchema), updateUser)
router.delete("/:id", checkUserLogin, deleteUser)

module.exports = router;