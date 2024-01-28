// Middleware implementation taken from https://www.youtube.com/watch?v=dX_LteE0NFM

const jwt = require("jsonwebtoken");

//middleware func takes token out of cookie and verifies it
function cookieJwtAuth(req, res, next) {
  const token = req.cookies.token;
  try {
    const agent = jwt.verify(token, process.env.SECRET_AGENT_KEY);
    req.agent = agent;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.redirect("/agent/login");
  }
}

module.exports = cookieJwtAuth;