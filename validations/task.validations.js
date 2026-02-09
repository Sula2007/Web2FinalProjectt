import Joi from "joi";

export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().optional(),
  status: Joi.string().valid("todo", "in-progress", "done"),
  assignedTo: Joi.string().optional(),
  dueDate: Joi.date().optional(),
});
