const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
    const secret = process.env.JSON_WEB_SECRET_KEY;
    return jwt({
        secret: secret,
        algorithms: ["HS256"]
    }).unless({
        path: [
            { url: /\/api\/user\/signup/, methods: ['POST', 'OPTIONS'] },
            { url: /\/api\/user\/signin/, methods: ['POST', 'OPTIONS'] },
            { url: /\/api\/user\/verify-otp/, methods: ['POST', 'OPTIONS'] },
            { url: /\/api\/user\/resend-otp/, methods: ['POST', 'OPTIONS'] },
            { url: /\/api\/user\/forgot-password/, methods: ['POST', 'OPTIONS'] },
            { url: /\/api\/user\/verify-forgot-password-otp/, methods: ['POST', 'OPTIONS'] },
            { url: /\/api\/user\/reset-password/, methods: ['POST', 'OPTIONS'] },
            { url: /\/api\/user\/google-signin/, methods: ['POST', 'OPTIONS'] },
            { url: /\/api\/category(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/products\/get-multiple/, methods: ['POST', 'OPTIONS'] },
            { url: /\/api\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/subCat(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/productReviews(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/homeBanner(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/ai(.*)/, methods: ['POST', 'OPTIONS'] },
        ]
    })
}

module.exports = authJwt