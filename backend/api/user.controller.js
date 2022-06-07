const jwt = require("jsonwebtoken");
const config = require('../config.json')
const bcrypt = require("bcryptjs");
const AppConstants = require("../constants/AppConstants");
const db = require('../helpers/db');
const { Role } = require("../constants/enum");
const User = db.User;
function UserControllerApi() {}

UserControllerApi.prototype.handleUserData  = (req ,res)=>{
        const action = req.query.action;
        switch(action){
            case "register":
                new UserControllerApi().registerUserData(req, res);
            break;
            case "authentication":
                new UserControllerApi().authenticationUser(req, res);
                break;
            case "updateUserData":
              new UserControllerApi().updateUserInfomation(req, res);
            break;
            case "getuserInfomation":
              new UserControllerApi().getuserInfomation(req, res);
            break;
                default:
             res.send("Api route is not found!");
        }
}

UserControllerApi.prototype.getuserInfomation = async (req, res, next)=>{
      const _user = req.query;
      console.log(_user.id)
      let _query = (_user.role == Role.ADMIN)? {} :(_user.id !== undefined)?{_id:_user.id} :{userName:_user.userName};
      try{
        await User.find(_query ,function(err , result){
          if(!err){
            res.status(200).json(result)
        }else{
            res.status(500).json(err)
        } 
          }).clone().catch(function(error){ console.log(error)})
      }catch(e){
        return res.status(401).json({
          message: e
        });
      }
}

UserControllerApi.prototype.updateUserInfomation = async (req, res, next)=>{
        await User.updateOne(
          {id:req.body.id} , {$set:{
            email:req.body.email , userName:req.body.userName
          }} , function(err ,result){
            if(!err){
              res.status(200).json(AppConstants.USER_UPDATED);
            }else{
              res.status(200).json(AppConstants.USER_Failed_MESSAGE);
            }
          }
        )
}

UserControllerApi.prototype.registerUserData = async  (req, res, next)=>{
    var _userObj = req.body;
    console.log(_userObj)
    const user = new User(_userObj);
    if (_userObj.password) {
      user.hash = await hashPassword(_userObj.password);
    }
    if (await user.save()) {
      res.status(200).json(AppConstants.USER_SAVE_MESSAGE);
    }
};

UserControllerApi.prototype.authenticationUser = async  (
    req,
    res
  )=>{
    console.log(req.body.userName)
    let fetchedUser;
    try{
      User.findOne({ userName: req.body.userName })
      .then(user => {
        if (!user) {
        
          // Failed request
          return res.status(401).json({
            message: 'Invalid authentication credentials!'
          });
        }
        // console.log(user)
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.hash) // Comparing passwords 
      })
      .then( result => {
        // console.log(fetchedUser)
        if(!result) {
          // Failed request
          return res.status(401).json({
            message: 'Invalid authentication credentials!'
          });
        }
        // Creating a token
        const token = jwt.sign({
          userName: fetchedUser.userName,
          userId: fetchedUser._id
        },
         config.secret, // getting JWT secret key from .env
        {expiresIn: '1h'} // Setting token Expiration duration 
        );
        fetchedUser['hash'] = null;
        // Succeeded request
        res.status(200).json({
          accessToken: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          user:fetchedUser.userName,
          roles:fetchedUser.role
        });
      })
      .catch(err => {
        console.log(err)
        // Failed request
        return res.status(401).json({
          message: 'Invalid authentication credentials!'
        });
      });
    }catch(e){
      throw e;
    }
    
  };
  
  function hashPassword(password) {
    return new Promise((resolve) => {
      bcrypt.hash(password, 10, (err, hash) => {
        resolve(hash);
      });
    });
  }
  
module.exports = new UserControllerApi();