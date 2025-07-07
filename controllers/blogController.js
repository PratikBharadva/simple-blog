const Blog = require("../modals/blogModal");
const asyncHandler = require("../utils/asyncHandler");
const fs = require("fs");
const path = require("path");

const createBlog = asyncHandler(async (req, res) => {
  const { userId, title, content } = req.body;
  const image = req.file?.path;
  //   console.log(image);
  let newBlog;
  try {
    newBlog = await Blog.create({
      userId,
      title,
      content,
      image,
    });
  } catch (error) {
    if (image) {
      fs.unlinkSync(path.resolve(image));
    }

    return res.json({
      success: false,
      message: error.message,
    });
  }

  // deleting image if data isn't inserted
  if (!newBlog) {
    if (image) {
      fs.unlinkSync(path.resolve(image));
    }

    return res.json({
      success: false,
      message: "Failed to create blog",
    });
  }

  res.status(201).json({
    success: true,
    blog: newBlog,
  });
});

const fetchBlogs = asyncHandler(async (req, res) => {
  let allBlogs = await Blog.find({});

  if (!allBlogs) {
    return res.json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }

  res.status(200).json({
    success: true,
    blogs: allBlogs,
  });
});

const fetchBlogsPipeline = asyncHandler(async (req, res) => {
  let {query, page, limit, sortby} = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 3;
  const skip = (page - 1) * limit;
  let pipeline = [];

  if(query){
    pipeline.push({
      $search: {
        index: "title",
        text: {
          query: query,
          path: ["title"]
        }
      }
    })
  }

  // lookup is like left-join & flatten author field
  pipeline.push({
    $lookup: {
      from: "users", // collection name as per mongoDB
      localField: "userId",
      foreignField: "_id",
      as: "author"
    }
  }, {
    $unwind: "$author"
  })

  // sort by createAt date
  if(sortby)
  pipeline.push({
    $sort: {
      createdAt: sortby === "asc" ? -1 : 1
    }
  })

  // apply pagination
  pipeline.push({
    $limit: limit
  }, {
    $skip: skip
  })

  const blogs = await Blog.aggregate(pipeline);

  if(!blogs){
    return res.status(400).json({
      success: false,
      message: "Failed to fetch blogs",
    })
  }

  res.status(200).json({
    success: true,
    blogs,
  })
})

const fetchOneBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

const fetchBlogByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const blogs = await Blog.find({ userId });

  if (!blogs) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  res.status(200).json({
    success: true,
    blogs,
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, title, content } = req.body;

  const blog = await Blog.updateOne(
    { _id: id },
    { userId, title, content }
  );

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

const updateBlogImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const imagePath = req.file?.path;

  if(!imagePath){
    return res.json({
      success: false,
      message: "Can't find image to update"
    })
  }

  // checking for blog existance
  const oldImagePath = await Blog.findOne({ _id: id }).select("image");
  if (!oldImagePath) {
    fs.unlinkSync(path.resolve(imagePath));
    return res.json({
      success: false,
      message: "BlogId doesn't exists",
    });
  }

  // add new image
  const updatedBlog = await Blog.updateOne({ _id: id }, { image: imagePath });

  if (!updatedBlog) {
    return res.json({
      success: false,
      message: "failed to update image",
    });
  }
  // if new image is added then remove older one
  if (oldImagePath.image) {
    fs.unlinkSync(path.resolve(oldImagePath.image));
  }

  res.status(200).json({
    success: true,
    updatedBlog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blogToDelete = await Blog.findById(id).select("image");
  if(!blogToDelete){
    return res.status(404).json({
      success: false,
      message: "blog doesn't exists"
    })
  }

  const blog = await Blog.deleteOne({ _id: id });

  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
  // if data is removed successfully then remove image from local storage
  if(blogToDelete.image){
    fs.unlinkSync(path.resolve(blogToDelete.image));
  }

  res.status(200).json({
    success: true,
    blog,
  });
});

const searchBlog = asyncHandler(async (req, res) => {
  const {q} = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query is required" });
  }

  const blogs = await Blog.find({
    title: { $regex: q, $options: "i" }, // case-insensitive search
  });

  res.status(200).json({
    success: true,
    blogs
  });
});

module.exports = {
  createBlog,
  fetchBlogs,
  fetchOneBlog,
  fetchBlogByUserId,
  updateBlog,
  updateBlogImage,
  deleteBlog,
  searchBlog,
  fetchBlogsPipeline,
};
