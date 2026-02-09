import express from "express";
const router = express.Router();

// Пока пусто или пример:
router.get("/", (req, res) => {
  res.json({ message: "Dashboard route placeholder" });
});

export default router;
