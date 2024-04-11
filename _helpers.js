/**
 * 取得用戶
 * @param {object} req 要取得用戶的 request 物件。
 * @return {object} 用戶物件。
 */
function getUser(req) {
  return req.user;
}

module.exports = {
  getUser,
};
