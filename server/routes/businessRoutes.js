const express = require("express");
const router = express.Router();
const {
  createBusiness,
  getBusinesses,
  getBusinessById,
  getBusinessByOwner,
  updateBusiness,
  deleteBusiness,
} = require("../controllers/businessController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middleware/upload");

// Public routes
router.get("/", getBusinesses);
router.get("/:id", getBusinessById);

// Protected routes
router.post("/", protect, upload.array("images", 5), createBusiness);
router.get("/owner/my-business", protect, getBusinessByOwner);
router.put("/", protect, upload.array("images", 5), updateBusiness);
router.delete("/", protect, deleteBusiness);

module.exports = router;
