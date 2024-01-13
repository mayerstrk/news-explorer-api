"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRequestUser = void 0;
function isRequestUser(value) {
    if (typeof value !== 'object' || value === null)
        return false;
    const keys = Object.keys(value);
    return (keys.length === 3 &&
        keys[0] === '_id' &&
        typeof value._id === 'string');
}
exports.isRequestUser = isRequestUser;
//# sourceMappingURL=is-request-user.js.map