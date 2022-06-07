const jwt = require("jsonwebtoken");
const config = require("../config.json");


const verifyToken = (req ,res, next)=>{
//meka parameter ekata danna ona  token eka verify karanna
  const token =
  req.body.token || req.query.token || req.header["x-access-token"] || req.body.title.token;
  if(!token){
    return res.status(403).send("A token is required for authentication");
  }
  try{
    const decoded = jwt.verify(token, config.secret);
    req.user = decoded;
  }catch(e){
    console.log(e);
    return res.status(401).send("Invalid Token");
  };
  return next();
}

module.exports = verifyToken;
