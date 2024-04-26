const recordServices = require("../services/record-services");

const recordController = {
  addRecord: (req, res, next) => {
    recordServices.addRecord(req, (err, data) =>
      err ? next(err) : res.status(200).json(data),
    );
  },
  getRecords: (req, res, next) => {
    recordServices.getRecords(req.user._id, (err, data) =>
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
