const quizzesRouter = require("express").Router();
const User = require("../models/user.model.js");
const Quiz = require('../models/quiz.model')
const {
  getErrorBody,
  validateProperties,
  getSuccessBody,
} = require("./helper");

quizzesRouter.get("/", async (_, res) => {
  try {
    const quizzes = await Quiz.find({});
    res.status(200).send(quizzes);
  } catch (e) {
    res.status(500).send(getErrorBody(e.message));
  }
});

// quizzesRouter.post("/", async (req, res) => {
//   const { title, sellerID, categoryID, price, description } = req.body;
//   const checkMessage = validateProperties(req.body, [
//     "title",
//     "sellerID",
//     "categoryID",
//     "price",
//   ]);
//   if (checkMessage) {
//     res.status(400).send(getErrorBody(checkMessage));
//     return;
//   }
//   try {
//     const existingAd = await Ad.findOne({ title });
//     if (existingAd) {
//       res
//         .status(401)
//         .send(
//           getErrorBody(
//             "There is already an ad with the same title. Please change the title"
//           )
//         );
//       return;
//     }

//     const existingCategory = await Category.findOne({ _id: categoryID });
//     if (!existingCategory) {
//       res.status(401).send(getErrorBody("This category doesn't exist!"));
//       return;
//     }
//     if (!existingCategory.active) {
//       res
//         .status(401)
//         .send(
//           getErrorBody(
//             "This category is already deleted, cannot post ad to it!"
//           )
//         );
//       return;
//     }

//     const existingSeller = await User.findOne({ _id: sellerID });
//     if (!existingSeller) {
//       res
//         .status(401)
//         .send(
//           getErrorBody(
//             "This seller is not registered yet, please signup and then continue!"
//           )
//         );
//       return;
//     }

//     if (price < 0) {
//       res.status(401).send(getErrorBody("Please enter a valid selling price!"));
//       return;
//     }

//     const savedAd = await new Ad({
//       title,
//       price,
//       sellerID,
//       categoryID,
//       description,
//     }).save();
//     await existingSeller
//       .$set({ ads: [...existingSeller.ads, savedAd.id] })
//       .save();
//     res
//       .status(201)
//       .send({ message: "Ad Posted successfully!", id: savedAd.id });
//     return;
//   } catch (e) {
//     sendGeneralError(e, res);
//     return;
//   }
// });

// quizzesRouter.delete("/:id", async (req, res) => {
//   const { id } = req.params;
//   const checkMessage = validateProperties(req.params, ["id"]);
//   if (checkMessage) {
//     res.status(400).send(getErrorBody(checkMessage));
//     return;
//   }
//   try {
//     const existingAd = await Ad.findOne({ _id: id });
//     if (!existingAd) {
//       res.status(401).send(getErrorBody("There is no ad with this id."));
//       return;
//     }
//     const existingSeller = await User.findOne({ _id: existingAd.sellerID });
//     await existingSeller
//       .$set({
//         ads: existingSeller.ads.filter((ad) => {
//           return ad.toString() !== existingAd.id;
//         }),
//       })
//       .save();
//     await Ad.deleteOne({ _id: existingAd._id });
//     res.status(200).send(getSuccessBody("The ad is deleted successfully!"));
//   } catch (e) {
//     res
//       .status(401)
//       .send(getErrorBody("There is no ad with this id." + e.message));
//     return;
//   }
// });

// quizzesRouter.post("/:id", async (req, res) => {
//   const { buyerID } = req.body;
//   const { id } = req.params;
//   const checkBody = { ...req.body, ...req.params };
//   const checkMessage = validateProperties(checkBody, ["buyerID", "id"]);
//   if (checkMessage) {
//     res.status(400).send(getErrorBody(checkMessage));
//     return;
//   }
//   try {
//     const existingAd = await Ad.findById(id);
//     if (!existingAd) {
//       res.status(401).send(getErrorBody("There is no ad with this ID."));
//       return;
//     }

//     const existingBuyer = await User.findById(buyerID);
//     if (!existingBuyer) {
//       res
//         .status(401)
//         .send(
//           getErrorBody(
//             "This buyer is not registered yet, please signup and then continue!"
//           )
//         );
//       return;
//     }

//     await existingAd
//       .$set({
//         interestedBuyers: [...existingAd.interestedBuyers, existingBuyer.id],
//       })
//       .save();

//     res.status(201).send({ message: "Buyer is intereseted successfully!" });
//     return;
//   } catch (e) {
//     sendGeneralError(e, res);
//     return;
//   }
// });

// quizzesRouter.post("/:id/close/:buyerId", async (req, res) => {
//   const { id, buyerId } = req.params;
//   const checkMessage = validateProperties(req.params, ["buyerId", "id"]);
//   if (checkMessage) {
//     res.status(400).send(getErrorBody(checkMessage));
//     return;
//   }
//   try {
//     const existingAd = await Ad.findById(id);
//     if (!existingAd) {
//       res.status(401).send(getErrorBody("There is no ad with this ID."));
//       return;
//     }

//     const existingBuyer = await User.findById(buyerId);
//     if (!existingBuyer) {
//       res
//         .status(401)
//         .send(
//           getErrorBody(
//             "This buyer is not registered yet, please signup and then continue!"
//           )
//         );
//       return;
//     }

//     if (!existingAd.interestedBuyers.includes(buyerId)) {
//       res
//         .status(402)
//         .send(
//           getErrorBody(
//             "You should be interested first before closing a deal to you!"
//           )
//         );
//       return;
//     }

//     await existingAd
//       .$set({
//         finalBuyerID: buyerId,
//       })
//       .save();

//     res
//       .status(201)
//       .send({
//         message: "The deal is closed!",
//         adID: existingAd.id,
//         sellerID: existingAd.sellerID,
//         buyerID: buyerId,
//       });
//     return;
//   } catch (e) {
//     sendGeneralError(e, res);
//     return;
//   }
// });

module.exports = quizzesRouter;
