import express from "express";
import { Task } from "../models/Task.js"; 

const router = express.Router();

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Task name is required" });
    }

    const task = new Task({ name: name.trim() });
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, completed } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name.trim();
    if (completed !== undefined) updates.completed = completed;

    if (updates.name === "") {
      return res.status(400).json({ error: "Task name cannot be empty" });
    }

    const task = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) return res.status(404).json({ error: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
