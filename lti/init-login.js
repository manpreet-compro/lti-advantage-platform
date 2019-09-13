const toolRegistration = require('../data/tool-registration');
const platFormData = require('../data/platform-data');

var getTool = (toolId)=>{
    return toolRegistration.find((tool)=>{
        return (tool.id == toolId);
    })
}

/* References: 
    https://www.imsglobal.org/spec/security/v1p0/#step-1-third-party-initiated-login
    https://www.imsglobal.org/spec/lti/v1p3#additional-login-parameters
*/

exports.constructLoginParams = (toolId)=>{
    let toolData = getTool(toolId);
    if(!toolData){
        return null;
    }
    else{
        let loginURL = toolData.init_login;
        let loginParams = {
            "iss": platFormData.iss,
            "login_hint": 1,
            "target_link_uri": toolData.tool_link,
            "lti_message_hint": 1,
            "lti_deployment_id": 1,
            "client_id ": 1
        }
        
        return {loginURL, loginParams}
    }
}