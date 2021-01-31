const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn, validateCampground, isCampgroundOwner} = require("../middlewares");
const {storage} = require("../cloudinary");
const multer = require("multer");
const upload = multer({storage});
const {campsIndex, campsNew, campsCreate, campsShow, campsEdit, campsUpdate, campsDelete} = require("../controllers/campgrounds");


router.get("/", catchAsync(campsIndex));

router.get("/new", isLoggedIn, campsNew);

router.post("/", isLoggedIn , upload.array("images", 4) , validateCampground, catchAsync(campsCreate));

router.get("/:id", catchAsync(campsShow))

router.get("/:id/edit", isLoggedIn, isCampgroundOwner ,catchAsync(campsEdit))

router.put("/:id", isLoggedIn, isCampgroundOwner, upload.array("images", 4), validateCampground, catchAsync(campsUpdate))

router.delete("/:id", isLoggedIn, isCampgroundOwner, catchAsync(campsDelete))

module.exports = router;