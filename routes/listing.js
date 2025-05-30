const express = require("express");
const router = express.Router();
const Listing = require("../models/listning.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

// Creating a new listing
router.get("/newlist", (req, res) => {
  res.render("listings/form.ejs");
});

// Posting the new listing to the database
router.post("/", (req, res) => {
  const { title, description, image, location, country, price } = req.body;
  const newData = new Listing({
    title: title,
    description: description,
    image: image,
    location: location,
    country: country,
    price: price,
  });
  newData
    .save()
    .then((res) => {
      console.log("Data saved successfully");
    })
    .catch((err) => {
      console.log("Error saving data", err);
    });
  res.redirect("/listings");
});

// Edit Form Rendering
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/editfrom.ejs", { listing });
  })
);

// Updating the listing
router.put(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, image, location, country, price } = req.body;
    let updatedData = await Listing.findByIdAndUpdate(id, {
      title: title,
      description: description,
      image: image,
      location: location,
      country: country,
      price: price,
    });
    res.redirect(`/listings/${id}`);
  })
);

// Deleting Form
router.get(
  "/:id/delete",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/deleteform.ejs", { listing });
  })
);

// Listing the Particular List in show.ejs from index.ejs
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { id, listing });
  })
);

// Deleting the listing
router.post(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);
module.exports = router;
