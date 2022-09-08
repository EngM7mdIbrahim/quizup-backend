// const categoriesRouter = require("express").Router();
// const bcrypt = require("bcryptjs");
// const { default: mongoose } = require("mongoose");
// const Category = require("../models/template.model.js");
// const {
//   getErrorBody,
//   validateProperties,
//   sendGeneralError,
// } = require("./helper");

// categoriesRouter.get("/", async (_, res) => {
//   try {
//     const categories = await Category.find({});
//     res.status(200).send(categories);
//   } catch (e) {
//     res.status(500).send(getErrorBody(e.message));
//   }
// });

// categoriesRouter.post("/new", async (req, res) => {
//   const { name, active } = req.body;
//   const checkMessage = validateProperties(req.body, ["name"]);
//   if (!checkMessage) {
//     res.status(400).send(getErrorBody(checkMessage));
//     return;
//   }
//   try {
//     const existingCategory = await Category.findOne({ name });
//     if (existingCategory) {
//       res.status(401).send(getErrorBody("Category already exists!"));
//       return;
//     }
//   } catch (e) {
//     sendGeneralError(e, res);
//     return;
//   }

//   try {
//     const savedCategory = await new Category({
//       name,
//       active,
//     }).save();

//     res.status(201).send({ message: "Category Added!", id: savedCategory.id });
//     return;
//   } catch (e) {
//     sendGeneralError(e, res);
//     return;
//   }
// });

// categoriesRouter.post("/:id/delete", async (req, res) => {
//     const { id } = req.params;
//     const checkMessage = validateProperties(req.params, ["id"]);
//     if (!checkMessage) {
//       res.status(400).send(getErrorBody(checkMessage));
//       return;
//     }
//     let existingCategory = {};
//     try {
//         existingCategory = await Category.findOne({ _id:id });
//       if (!existingCategory) {
//         res.status(401).send(getErrorBody("Category doesn't exist!"));
//         return;
//       }

//       if(!existingCategory.active){
//         res.status(401).send(getErrorBody("This category is already deleted!"));
//         return;
//       }

//     } catch (e) {
//       sendGeneralError(e, res);
//       return;
//     }

//     try{
//         await existingCategory.$set({active: false}).save();
//         res.status(201).send({message: 'Category deleted successfully!'});
//         return;
//     }catch (e) {
//         sendGeneralError(e, res);
//         return;
//     }

// });

// module.exports = categoriesRouter;
