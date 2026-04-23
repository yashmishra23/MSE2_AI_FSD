import express from "express";
import mongoose from "mongoose";
import { protect } from "../middleware/auth.js";
import { Item } from "../models/Item.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { itemName, description, type, location, date, contactInfo } = req.body;

    if (!itemName || !description || !type || !location || !date || !contactInfo) {
      return res.status(400).json({ message: "All item fields are required." });
    }

    const item = await Item.create({
      itemName,
      description,
      type,
      location,
      date,
      contactInfo,
      owner: req.user.id,
    });

    return res.status(201).json(item);
  } catch (error) {
    return res.status(500).json({ message: "Server error while adding item." });
  }
});

router.get("/", async (_req, res) => {
  try {
    const items = await Item.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching items." });
  }
});

router.get("/search", async (req, res) => {
  try {
    const name = req.query.name?.trim() || "";
    const type = req.query.type?.trim() || "";

    const filters = {};

    if (name) {
      filters.itemName = {
        $regex: name,
        $options: "i",
      };
    }

    if (type && ["Lost", "Found"].includes(type)) {
      filters.type = type;
    }

    const items = await Item.find(filters)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: "Server error while searching items." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const item = await Item.findById(id).populate("owner", "name email");

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching item." });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can update only your own entries." });
    }

    const allowedFields = ["itemName", "description", "type", "location", "date", "contactInfo"];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    }

    await item.save();

    const updatedItem = await Item.findById(item._id).populate("owner", "name email");
    return res.json(updatedItem);
  } catch (error) {
    return res.status(500).json({ message: "Server error while updating item." });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID." });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    if (item.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can delete only your own entries." });
    }

    await item.deleteOne();
    return res.json({ message: "Item deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error while deleting item." });
  }
});

export default router;
