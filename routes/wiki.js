const express = require('express');
const router = express.Router();

router.get("/", function (res, req, next) {
    res.send("Wiki Home Page");
})
router.get("/about", function (res, req, next) {
    res.send("About this Wiki Page");
})
/*router.get("/about", (req, res, next) => {
    About.find({}).exec((err, queryResults) => {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("about_view", { title: "About", list: queryResults });
    });
  });
*///Code that checks for an error if queryResults cannot load

/*exports.get("/about", async function (req, res, next) {
  try {
    const successfulResult = await About.find({}).exec();
    res.render("about_view", { title: "About", list: successfulResult });
  } catch (error) {
    return next(error);
  }
});
*/// Same as above but with a try catch instead. This is for a db query that returns a promise

/* // Import the module
const asyncHandler = require("express-async-handler");

exports.get(
  "/about",
  asyncHandler(async (req, res, next) => {
    const successfulResult = await About.find({}).exec();
    res.render("about_view", { title: "About", list: successfulResult });
  }),
);
*/// We can also use the express-async-handler module to shorten the code without using the try catch block

module.exports = router;