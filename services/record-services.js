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
  getRecords: async (userId, cb) => {
    try {
      // 使用 .populate() 來填充 mainCategory
      const records = await Record.find({userId}).populate({
        path: "category.mainCategory",
        model: "Category",
        select: "mainCategory",
      });
      // 轉換 records 為聚合管道可接受的格式
      const recordsWithSub = await Record.aggregate([
        {$match: {userId: userId}},
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
            "subCategoryName": "$subCategoryDetails.subCategories.name",
          },
        },
      ]);
      // 結合 mainCategory 的填充結果與 subCategory 聚合查詢的結果
      const combinedRecords = records.map((record) => {
        const subCategory = recordsWithSub.find(
            (sub) => sub._id.equals(record._id),
        );
        return {
          ...record.toObject(),
          subCategoryName: subCategory ? subCategory.subCategoryName : null,
        };
      });

      cb(null, {status: "success", records: combinedRecords});
    } catch (err) {
      console.error("Failed to get records:", err);
      cb(err);
    }
  },
  updateRecord: async (recordId, userId, recordData, cb) => {
    try {
      const updatedRecord = await Record.findOneAndUpdate(
          {_id: recordId, userId: userId},
          {$set: recordData},
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
