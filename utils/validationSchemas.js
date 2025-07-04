const Joi = require("joi");

const createUserSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  phone: Joi.number().required(),
  email: Joi.string().email().required(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  role: Joi.string().valid("admin", "user").optional(),
  password: Joi.string().min(4).required(),
});

const updateUserSchema = Joi.object({
  firstname: Joi.string().optional(),
  lastname: Joi.string().optional(),
  phone: Joi.number().optional(),
  email: Joi.string().email().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  role: Joi.string().valid("admin", "user").optional(),
  password: Joi.string().min(4).optional(),
}).min(1);

const createBlogSchema = Joi.object({
  userId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  // image: Joi.string().optional(),
});

const updateBlogSchema = Joi.object({
  userId: Joi.string().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  // image: Joi.string().optional(),
}).min(1);

module.exports = { createUserSchema, updateUserSchema, createBlogSchema, updateBlogSchema };