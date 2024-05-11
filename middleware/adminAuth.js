module.exports = {
  verifyAdmin: (req, res, next) => {
    if (req.session.adminloged) next();
    else res.redirect("/admin/signin");
  },

  adminExsist: (req, res, next) => {
    if (req.session.adminloged) res.redirect("/admin");
    else next(); 
  }, 
};
