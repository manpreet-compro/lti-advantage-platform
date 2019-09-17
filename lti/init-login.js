const toolRegistration = require('../data/tool-registration');
const platFormData = require('../data/platform-data');
const userData = require('../data/user-data');

const getTool = (toolId)=>{
    return toolRegistration.find((tool)=>{
        return (tool.id == toolId);
    })
}

const getInitiateLoginUri = (toolData)=>{
    return toolData.initiate_login_uri;
}

const getIssuerIdentifier = ()=>{
    return platFormData.iss;
}

const getClientId = (toolData)=>{
    return toolData.client_id;
}

const getLtiDeploymentId = (toolData)=>{
    return toolData.deployment_id;
}

const getTargetLinkUri = (toolData)=>{
    return toolData.tool_url;
}

const getLoginHint = ()=>{
    return userData.id;
}

const getLtiMessageHint = (resLinkId)=>{
    return resLinkId;
}


/* References: 
    https://www.imsglobal.org/spec/security/v1p0/#step-1-third-party-initiated-login
    https://www.imsglobal.org/spec/lti/v1p3#additional-login-parameters
*/
function constructLoginParams(toolId, resLinkId){
    let toolData = getTool(toolId);
    if(!toolData){
        return null;
    }
    else{
        let loginURL = getInitiateLoginUri(toolData);
        let loginParams = {
            "iss": getIssuerIdentifier(),
            "client_id ": getClientId(toolData),
            "lti_deployment_id": getLtiDeploymentId(toolData),
            "target_link_uri": getTargetLinkUri(toolData),
            "login_hint": getLoginHint(),
            "lti_message_hint": getLtiMessageHint(resLinkId)
        }
        
        return {loginURL, loginParams}
    }
}

module.exports = {
    constructLoginParams: constructLoginParams
}