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

  // TODO: 舊的 getRecords 方法，前端遷移完成後刪除
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

  // 新的 getRecords 方法
  getRawRecords: async (userId, startDate, endDate, cb) => {
    try {
      const query = {userId};
      if (startDate && endDate) {
        query.date = {$gte: new Date(startDate), $lte: new Date(endDate)};
      }
      const records = await Record.find(query).sort({date: -1});
      cb(null, {status: "success", records});
    } catch (err) {
      console.error("Failed to get records:", err);
      cb(err);
    }
  },
  getCategoryRecords: async (userId, startDate, endDate, cb) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const records = await Record.aggregate([
        {$match: {userId, date: {$gte: start, $lte: end}}},
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
          $group: {
            _id: "$mainCategoryDetails.mainCategory",
            totalAmount: {$sum: "$amount"},
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            totalAmount: 1,
          },
        },
      ]);

      const totalAmount =
        records.reduce((acc, record) => acc + record.totalAmount, 0);
      const recordsWithPercentage = records.map((record) => ({
        category: record.category,
        totalAmount: record.totalAmount,
        percentage: Math.round((record.totalAmount / totalAmount) * 100),
      }));

      cb(null, {status: "success", records: recordsWithPercentage});
    } catch (err) {
      console.error("Failed to get category records:", err);
      cb(err);
    }
  },
  getPeriodRecords: async (userId, periodType, startDate, endDate, cb) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let groupByPeriod;

      switch (periodType) {
        case "month":
          groupByPeriod = {$dateToString: {format: "%Y-%m", date: "$date"}};
          break;
        case "quarter":
          groupByPeriod = {
            $concat: [
              {$toString: {$year: "$date"}},
              "-Q",
              {$toString: {$ceil: {$divide: [{$month: "$date"}, 3]}}},
            ],
          };
          break;
        case "year":
          groupByPeriod = {$dateToString: {format: "%Y", date: "$date"}};
          break;
        default:
          throw new Error("Invalid period type");
      }

      const records = await Record.aggregate([
        {$match: {userId, date: {$gte: start, $lte: end}}},
        {
          $group: {
            _id: groupByPeriod,
            totalAmount: {$sum: "$amount"},
          },
        },
        {
          $project: {
            _id: 0,
            period: "$_id",
            totalAmount: 1,
          },
        },
      ]);

      const totalAmount =
        records.reduce((acc, record) => acc + record.totalAmount, 0);
      const recordsWithPercentage = records.map((record) => ({
        period: record.period,
        totalAmount: record.totalAmount,
        percentage: Math.round((record.totalAmount / totalAmount) * 100),
      }));

      cb(null, {status: "success", records: recordsWithPercentage});
    } catch (err) {
      console.error("Failed to get period records:", err);
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
