const toolRegistry = require('../data/tool-registration.json');
const platformData = require('../data/platform-data.json');

function handleOIDCRequest(params) {

    // Verify Signature ? 

    // Verify OIDC auth request 
    validateAuthRequest(params);

    // Construct launch request with id_token
    return constructAuthResponse(params);
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
    }
    //

    /****************************** VALIDATE login_hint ******************************/
    // Validate the current logged in user matches the login_hint
    {
        // TODO
    }
}

function constructOIDCResponse(params) {

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

    const time = Date().now;

    // Construct JWT payload / claims
    const payload = {
        iss: 'https://lti-ri.imsglobal.org', //platformData.issuer;
        aud: "s6BhdRkqt3",
        iat: time,
        exp: 1568384061,
        sub: "300701fbc2ef172fc6b2",
        nonce: "425b58c3fd176b250ce1",
    };    

    payload['https://purl.imsglobal.org/spec/lti/claim/message_type'] = 'LtiResourceLinkRequest';

    payload['https://purl.imsglobal.org/spec/lti/claim/version'] = '1.3.0',

    payload['https://purl.imsglobal.org/spec/lti/claim/target_link_uri'] = ''; //

    // Construct id_token

    // construct response id_token and state
}

function createIDToken() {

}
