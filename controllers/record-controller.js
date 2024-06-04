const recordServices = require("../services/record-services");


const recordController = {
  addRecord: (req, res, next) => {
    recordServices.addRecord(req, (err, data) =>
      err ? next(err) : res.status(200).json(data),
    );
  },

  // TODO: 舊的 getRecords 方法，前端遷移完成後刪除
  getRecords: (req, res, next) => {
    const {startDate, endDate} = req.query;
    recordServices.getRecords(
        req.user._id, new Date(startDate), new Date(endDate),
        (err, data) => err ? next(err) : res.status(200).json(data),
    );
  },

  // 新的 getRecords 方法
  getRawRecords: (req, res, next) => {
    const {startDate, endDate} = req.query;
    recordServices.getRawRecords(
        req.user._id, startDate, endDate, (err, data) =>
        err ? next(err) : res.status(200).json(data),
    );
  },
  getCategoryRecords: (req, res, next) => {
    const {startDate, endDate} = req.query;
    recordServices.getCategoryRecords(
        req.user._id, startDate, endDate, (err, data) =>
        err ? next(err) : res.status(200).json(data),
    );
  },
  getPeriodRecords: (req, res, next) => {
    const {periodType, startDate, endDate} = req.query;
    recordServices.getPeriodRecords(
        req.user._id, periodType, startDate, endDate, (err, data) =>
        err ? next(err) : res.status(200).json(data),
    );
  },

  updateRecord: (req, res, next) => {
    const recordId = req.params.id;
    recordServices.updateRecord(
        recordId, req.user._id, req.body, (err, data) =>
          err ? next(err) : res.status(200).json(data),
    );
  },

  deleteRecord: (req, res, next) => {
    const recordId = req.params.id;
    recordServices.deleteRecord(
        recordId, req.user._id, (err, data) =>
          err ? next(err) : res.status(200).json(data),
    );
  },
};

module.exports = recordController;
