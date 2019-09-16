const toolRegistry = require('../data/tool-registration.json');
const platformData = require('../data/platform-data.json');
const userData = require('../data/user-data.json');

const jwt = require('jsonwebtoken');
const keys = require('../data/keys.json');

function handleOIDCRequest(params) {

    // Verify Signature ? 

    // Verify OIDC auth request 
    let tool = validateAuthRequest(params);

    // Construct launch request with id_token
    return constructAuthResponse(params, tool);
}

function validateAuthRequest(params) {

    const {
        scope,
        response_type,
        client_id,
        redirect_uri,
        login_hint,
        lti_message_hint,
        state,
        response_mode,
        nonce,
        prompt
    } = params;

    /****************************** VALIDATE MANDATORY PARAMS ARE PRESENT ******************************/
    // Ref - https://www.imsglobal.org/spec/security/v1p0/#step-2-authentication-request
    {

        if (!scope) {
            throw new Error('Bad request - "scope" missing');
        }

        if (!response_type) {
            throw new Error('Bad request - "response_type" missing');
        }

        if (!client_id) {
            throw new Error('Bad request - "client_id" missing');
        }

        if (!redirect_uri) {
            throw new Error('Bad request - "redirect_uri" missing');
        }

        if (!login_hint) {
            throw new Error('Bad request - "login_hint" missing');
        }

        if (!response_mode) {
            throw new Error('Bad request - "response_mode" missing');
        }

        if (!nonce) {
            throw new Error('Bad request - "nonce" missing');
        }

        if (!prompt) {
            throw new Error('Bad request - "prompt" missing');
        }
    }

    /****************************** VALIDATE FIXED PARAMETERS ******************************/
    // Ref - https://www.imsglobal.org/spec/security/v1p0/#step-2-authentication-request

   {
       if (scope !== 'openid') {
           throw new Error('Bad request - invalid "scope", must be "openid"');
       }

       if (response_type !== 'id_token') {
           throw new Error('Bad request - invalid "response_type", must have value "id_token"');
       }

       if (response_mode !== 'form_post') {
           throw new Error('Bad request - invalid "response_mode", must have value "form_post"');
       }

       if (prompt !== 'none') {
           throw new Error('Bad request - invalid "prompt", must have value "id_token"');
       }

       // TODO - verify lit_message_hint ? 
       // Ref - https://github.com/moodle/moodle/blob/master/mod/lti/auth.php#L55
   }

   /****************************** VALIDATE redirect_uri ******************************/
    // Validate the redirect_uri as a valid end point for the client_id, and 
    {
        const tool = toolRegistry.find(tool => tool.client_id === client_id);

        if (!tool) {
            throw new Error('Unauthorized client_id');
        }

        if (!tool.redirect_uri.includes(redirect_uri)) {
            throw new Error('Unregistered redirect_uri');
        }

        return tool;
    }
    //

    /****************************** VALIDATE login_hint ******************************/
    // Validate the current logged in user matches the login_hint
    {
        // TODO
    }

    
}

function constructAuthResponse(params, tool) {

    const {
        scope,
        response_type,
        client_id,
        redirect_uri,
        login_hint,
        lti_message_hint,
        state,
        response_mode,
        nonce,
        prompt
    } = params;

    const expirationWindow = 60*10 //10mins

    const time = parseInt(Date.now()/1000); //convert ms to sec
    const expirationTIme = time + expirationWindow;

    // Construct JWT payload / claims
    // Ref - https://www.imsglobal.org/spec/security/v1p0/#id-token
    const payload = {
        iss: platformData.iss, //platformData.issuer;
        aud: tool.client_id,
        iat: time,
        exp: expirationTIme,
        sub: "2",
        nonce: nonce,
    };    

    payload['https://purl.imsglobal.org/spec/lti/claim/message_type'] = 'LtiResourceLinkRequest';

    payload['https://purl.imsglobal.org/spec/lti/claim/version'] = '1.3.0';

    payload['https://purl.imsglobal.org/spec/lti/claim/target_link_uri'] = tool.tool_link; 

    payload['https://purl.imsglobal.org/spec/lti/claim/resource_link'] = { //save resource_link data somehow when user clicked so that it  can be passed here
        "id": "5949",
        "title": "Activity01",
        "description": "Test Activity"
    }; 

    if(tool.deployment_id){
        payload['https://purl.imsglobal.org/spec/lti/claim/deployment_id'] = tool.deployment_id; 
    }
    
    //add user data
    payload["name"] = userData.name;
    payload["given_name"] = userData.given_name;
    payload["family_name"] = userData.family_name;
    payload["middle_name"] = userData.middle_name;
    payload["email"] = userData.email;
    payload["https://purl.imsglobal.org/spec/lti/claim/roles"] = userData.roles;


    payload["https://purl.imsglobal.org/spec/lti/claim/context"]= {
        "id": "1697",
        "label": "Course01",
        "title": "Course01",
        "type": [
          "http://purl.imsglobal.org/vocab/lis/v2/course#CourseSection"
        ]
    };

    // Construct id_token
    // sign with RSA SHA256
    const id_token = createIDToken(payload);
    return {
        id_token: id_token,
        state: state,
        action: redirect_uri
    }
    

    // construct response id_token and state
}

function createIDToken(payload) {
    const kid = keys[0].kid;
    const privateKey = keys[0].privateKey;
    
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', keyid:kid});

    return token;
}


module.exports = {
    handleOIDCRequest: handleOIDCRequest
}