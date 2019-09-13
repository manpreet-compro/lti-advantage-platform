const toolRegistry = require('../data/tool-registration.json');

function handleOIDCRequest(params) {

    // Verify Signature ? 

    // Verify OIDC auth request 
    validateAuthRequest(params);

    // Construct launch request with id_token
    constructAuthResponse();
}

function validateAuthRequest(params) {

    let {
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
            throw new Error('Mandatory parameter missing - "scope"');
        }

        if (!response_type) {
            throw new Error('Mandatory parameter missing - "response_type"');
        }

        if (!client_id) {
            throw new Error('Mandatory parameter missing - "client_id"');
        }

        if (!redirect_uri) {
            throw new Error('Mandatory parameter missing - "redirect_uri"');
        }

        if (!login_hint) {
            throw new Error('Mandatory parameter missing - "login_hint"');
        }

        if (!response_mode) {
            throw new Error('Mandatory parameter missing - "response_mode"');
        }

        if (!nonce) {
            throw new Error('Mandatory parameter missing - "nonce"');
        }

        if (!prompt) {
            throw new Error('Mandatory parameter missing - "prompt"');
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

function constructOIDCResponse() {
    // Construct id_token

    // construct response id_token and state
}

function createIDToken() {

}
