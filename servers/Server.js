"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const port = process.env.PORT || App_1.default.PORT;
App_1.default.debug = !!+process.env.DEBUG; // Debug
App_1.default.server.listen(port, () => {
    console.info(`Server running in  ${port}...`);
});
