const classesRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const { default: mongoose } = require("mongoose");
const Class = require("../models/class.model.js");
const {
  getErrorBody,
  validateProperties,
  sendGeneralError,
} = require("./helper");

classesRouter.get("/", async (req, res) => {
  try {
    const classes = await Class.find({teacherID: req.userID});
    res.status(200).send(classes);
  } catch (e) {
    res.status(500).send(getErrorBody(e.message));
  }
});

// classesRouter.post("/new", async (req, res) => {
//   const { name, active } = req.body;
//   const checkMessage = validateProperties(req.body, ["name"]);
//   if (!checkMessage) {
//     res.status(400).send(getErrorBody(checkMessage));
//     return;
//   }
//   try {
//     const existingCategory = await Class.findOne({ name });
//     if (existingCategory) {
//       res.status(401).send(getErrorBody("Category already exists!"));
//       return;
//     }
//   } catch (e) {
//     sendGeneralError(e, res);
//     return;
//   }

//   try {
//     const savedCategory = await new Class({
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

// classesRouter.post("/:id/delete", async (req, res) => {
//     const { id } = req.params;
//     const checkMessage = validateProperties(req.params, ["id"]);
//     if (!checkMessage) {
//       res.status(400).send(getErrorBody(checkMessage));
//       return;
//     }
//     let existingCategory = {};
//     try {
//         existingCategory = await Class.findOne({ _id:id });
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

module.exports = classesRouter;
