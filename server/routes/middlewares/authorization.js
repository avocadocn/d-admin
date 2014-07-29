'use strict';

/**
 * Generic require Admin routing middleware
 * Basic Role checking - future release with full permission system
 */
exports.requiresAdmin = function(req, res, next) {
  //由于 req.user 无法存入数据库,暂时只能用session
  if(req.session){
    if(req.session.admin){
      if(req.session.admin.role === 'admin'){
        next();
      }else{
        return res.send(403,'Permission Denied!');
      }
    }else{
      return res.send(403,'Permission Denied!');
    }
  }else{
    return res.send(403,'Permission Denied!');
  }
  // if(req.user){
  //   if (!req.user.hasRole('admin')) {
  //     return res.send(401, 'User is not authorized');
  //   }
  // }else{
  //   return res.send(403,'Permission Denied!');
  // }
};