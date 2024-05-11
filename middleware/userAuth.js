module.exports = {
  verifyUser: (req, res, next) => {
    if (req.session.logged) {
      next();
    } else {
      res.redirect("/guest");
    }
  },

  userExist: (req, res, next) => {
    if (req.session.logged) {
      res.redirect("/");
    } else {
      next();
    }
  },

  userAllowed : (req,res,next)=>{
    if(req.session.logged){
      next()
    }
    else{
      res.redirect('/signin')
    }
  }
};
 