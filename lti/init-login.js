const toolRegistration = require('../data/tool-registration');
const platFormData = require('../data/platform-data');

const getTool = (toolId)=>{
    return toolRegistration.find((tool)=>{
        return (tool.id == toolId);
    })
}

const getInitLoginEndPoint = (toolData)=>{
    return toolData.init_login;
}

const getPlatformIssuer = ()=>{
    return platFormData.iss;
}

const getClientId = (toolData)=>{
    return toolData.client_id;
}

const getLtiDeploymentId = (toolData)=>{
    return toolData.deployment_id;
}

const getTargetLinkUri = (toolData)=>{
    return toolData.tool_link;
}

const getLoginHint = ()=>{
    return 1;
}

const getLtiMessageHint = ()=>{
    return 1;
}


/* References: 
    https://www.imsglobal.org/spec/security/v1p0/#step-1-third-party-initiated-login
    https://www.imsglobal.org/spec/lti/v1p3#additional-login-parameters
*/
function constructLoginParams(toolId){
    let toolData = getTool(toolId);
    if(!toolData){
        return null;
    }
    else{
        let loginURL = getInitLoginEndPoint(toolData);
        let loginParams = {
            "iss": getPlatformIssuer(),
            "client_id ": getClientId(toolData),
            "lti_deployment_id": getLtiDeploymentId(toolData),
            "target_link_uri": getTargetLinkUri(toolData),
            "login_hint": getLoginHint(),
            "lti_message_hint": getLtiMessageHint()
        }
        
        return {loginURL, loginParams}
    }
}

module.exports = {
    constructLoginParams: constructLoginParams
}