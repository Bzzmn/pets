function setJSONBody(context, events, done) {
    try {
        context.vars.loginData = {
            email: 'admin@test.com',
            password: 'test123'
        };
        return done();
    } catch (error) {
        console.error('Error in setJSONBody:', error);
        return done(error);
    }
}

function setAuthHeader(context, events, done) {
    try {
        if (context.vars.authCookie) {
            return done();
        }

        if (!events || !events.response || !events.response.headers) {
            console.error('No response headers available');
            return done(new Error('No response headers'));
        }

        const cookies = events.response.headers['set-cookie'];
        if (!Array.isArray(cookies) || cookies.length === 0) {
            console.error('No cookies in response');
            return done(new Error('No cookies'));
        }

        context.vars.authCookie = cookies[0];
        console.log('Cookie set successfully');
        return done();
    } catch (error) {
        console.error('Error in setAuthHeader:', error);
        return done(error);
    }
}

module.exports = {
    setJSONBody,
    setAuthHeader
};