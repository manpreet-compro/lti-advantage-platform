const config = require('../config');
const courses = require('../data/courses');
const ltiInitLogin = require('../lti/init-login');

exports.launchDefault = (req, res)=>{
    res.render('index.ejs',{
        title: config.appName,
        courses: courses
    })
}

exports.initLogin = (req, res)=>{
    let toolId = req.query.toolId;
    if(!toolId){
        return res.status(400).send(`Bad Request, No tool exists with id = ${toolId}`)
    }

    let loginData = ltiInitLogin.constructLoginParams(toolId);
    if(!loginData){
        return res.status(400).send(`Bad Request, No tool exists with id = ${toolId}`)
    }
    
    return res.render('init-login.ejs',{
        title: config.appName,
        formFields: loginData.loginParams,
        action: loginData.loginURL
    })
}

exports.authOidc = (req, res)=>{
    res.json({
        "status": true
    })
}