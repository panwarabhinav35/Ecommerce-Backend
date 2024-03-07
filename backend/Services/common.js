const passport = require('passport')

exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt')
};

exports.sanitizeUser = (user) => {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    addresses: user.addresses,
  };
};

exports.cookieExTractor = function(req) {
  let token = null;
  if(req && req.cookies){
    token = req.cookies['jwt'];
  }
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTc2M2MzYmM2NDk4MTgwY2M3OWFmNCIsImVtYWlsIjoicGFud2FyYWJoaW5hdjM1QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiYWRkcmVzc2VzIjpbXSwiaWF0IjoxNzA5ODI5ODU3fQ.veF6qENXg_7FnLAxV_mIEaqyDi6_DUqUCo3oty7U-3g"
  return token;
}
