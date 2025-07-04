const express = require("express");
const {
  createBlogSchema,
  updateBlogSchema,
} = require("../utils/validationSchemas");
const validate = require("../middlewares/userValidateMiddleware");
const { checkUserLogin, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const {
  createBlog,
  fetchBlogs,
  fetchOneBlog,
  fetchBlogByUserId,
  updateBlog,
  updateBlogImage,
  deleteBlog,
  searchBlog,
} = require("../controllers/blogController");

const router = express.Router();

router.post(
  "/",
  checkUserLogin,
  validate(createBlogSchema),
  upload.single("image"),
  createBlog
);
router.get("/", checkUserLogin, fetchBlogs);
router.get("/search", checkUserLogin, searchBlog);
router.get("/:id", checkUserLogin, fetchOneBlog);
router.get("/user/:userId", checkUserLogin, fetchBlogByUserId);
router.patch("/:id", checkUserLogin, validate(updateBlogSchema), updateBlog);
router.patch("/image/:id", checkUserLogin, upload.single('image'), updateBlogImage);
router.delete("/:id", checkUserLogin, deleteBlog);

module.exports = router;
