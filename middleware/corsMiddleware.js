const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

module.exports = (app) => {
    app.use(
        cors({
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );
    app.use(
        helmet({
            contentSecurityPolicy: false,
            crossOriginResourcePolicy: { policy: "cross-origin" },
        })
    );
    app.use(compression());
};