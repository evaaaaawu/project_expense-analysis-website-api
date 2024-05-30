const Record = require("../models/record");

const createError = require("http-errors");

const recordServices = {
  addRecord: async (req, cb) => {
    try {
      const {amount, mainCategory, subCategory, date, note} = req.body;
      const userId = req.user._id;

      if (!amount) {
        throw createError(400, "Amount is required.");
      }
      if (!mainCategory) {
        throw createError(400, "Main category is required.");
      }
      if (!subCategory) {
        throw createError(400, "Sub category is required.");
      }
      if (!date) {
        throw createError(400, "Date is required.");
      }
      const newRecord = await Record.create({
        userId,
        category: {mainCategory, subCategory},
        amount,
        date,
        note,
      });
      cb(null, {status: "success", record: newRecord});
    } catch (err) {
      console.error("Failed to add record:", err);
      cb(err);
    }
  },
  getRecords: async (userId, startDate, endDate, cb) => {
    try {
      // 建立聚合管道
      const pipeline = [
        {
          $match: {
            userId: userId,
            ...(startDate && endDate ?
              {date: {$gte: new Date(startDate), $lte: new Date(endDate)}}:
              {}),
          },
        },
        {$sort: {date: -1}}, // 按日期降序
        {
          $lookup: {
            from: "categories",
            localField: "category.mainCategory",
            foreignField: "_id",
            as: "mainCategoryDetails",
          },
        },
        {$unwind: "$mainCategoryDetails"},
        {
          $lookup: {
            from: "categories",
            localField: "category.subCategory",
            foreignField: "subCategories._id",
            as: "subCategoryDetails",
          },
        },
        {$unwind: "$subCategoryDetails"},
        {$unwind: "$subCategoryDetails.subCategories"},
        {
          $match: {
            $expr: {
              $eq: [
                "$category.subCategory",
                "$subCategoryDetails.subCategories._id",
              ],
            },
          },
        },
        {
          $addFields: {
            "mainCategoryName": "$mainCategoryDetails.mainCategory",
            "subCategoryName": "$subCategoryDetails.subCategories.name",
            "mainCategoryId": "$mainCategoryDetails._id",
            "subCategoryId": "$subCategoryDetails.subCategories._id",
          },
        },
        {
          $project: {
            _id: 1,
            amount: 1,
            date: 1,
            note: 1,
            mainCategoryName: 1,
            subCategoryName: 1,
            mainCategoryId: 1,
            subCategoryId: 1,
          },
        },
      ];

      const records = await Record.aggregate(pipeline);

      cb(null, {status: "success", records: records});
    } catch (err) {
      console.error("Failed to get records:", err);
      cb(err);
    }
  },
  updateRecord: async (recordId, userId, recordData, cb) => {
    try {
      const updatedRecord = await Record.findOneAndUpdate(
          {_id: recordId, userId: userId},
          {
            $set: {
              "category.mainCategory": recordData.mainCategory,
              "category.subCategory": recordData.subCategory,
              "amount": recordData.amount,
              "date": recordData.date,
              "note": recordData.note,
            },
          },
          {new: true},
      );
      if (!updatedRecord) {
        throw createError(404, "Record not found or user not authorized.");
      }
      cb(null, {status: "success", record: updatedRecord});
    } catch (err) {
      console.error("Failed to update record:", err);
      cb(err);
    }
  },
  deleteRecord: async (recordId, userId, cb) => {
    try {
      const deletedRecord = await Record.findOneAndDelete(
          {_id: recordId, userId: userId},
      );
      if (!deletedRecord) {
        throw createError(404, "Record not found or user not authorized.");
      }
      cb(null, {status: "success", record: deletedRecord});
    } catch (err) {
      console.error("Failed to delete record:", err);
      cb(err);
    }
  },
};

module.exports = recordServices;
