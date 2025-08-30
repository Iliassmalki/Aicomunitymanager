const querystring = require('querystring');
const axios = require('axios');

const Authorization = () => {
    console.log('[Authorization] Generating LinkedIn login URL...');
    const url = encodeURI(`https://www.linkedin.com/oauth/v2/authorization?client_id=${process.env.CLIENT_ID}&response_type=code&scope=${process.env.SCOPE}&redirect_uri=${process.env.REDIRECT_URI}`);
    console.log('[Authorization] URL:', url);
    return url;
};

const Redirect = async (code) => {
    console.log('[Redirect] Exchanging code for access token...');
    console.log('[Redirect] Code received:', code);

    const payload = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
        code: code,
    };

    try {
        console.log('[Redirect] Sending POST request to LinkedIn token endpoint...');
        const response = await axios.post(
            'https://www.linkedin.com/oauth/v2/accessToken',
            querystring.stringify(payload),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        console.log('[Redirect] Response received from LinkedIn:', response.data);
        return response.data;
    } catch (err) {
        console.error('[Redirect] Error in request:', err.message);
        if (err.response) {
            console.error('[Redirect] Response status:', err.response.status);
            console.error('[Redirect] Response data:', err.response.data);
        }
        throw err;
    }
};

module.exports = {
    Authorization,
    Redirect,
};