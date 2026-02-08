import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, default: "todo" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dueDate: Date,
  overdueEmailSent: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
