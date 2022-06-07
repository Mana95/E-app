const express=require('express');
const router=express.Router();
const userControllerApi = require('../api/user.controller')

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: "Express js web api"
    });
}); 

router.route('/user-api').post(userControllerApi.handleUserData);
router.route('/user-api').patch(userControllerApi.handleUserData);
router.route('/user-api').get(userControllerApi.handleUserData);

module.exports=router;