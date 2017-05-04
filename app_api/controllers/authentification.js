var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.login = function(req, res) {
  console.log(req.body);
  sendJsonResponse(res, 200, req.body);
};

module.exports.register = function(req, res) {
  console.log(req.body);
};