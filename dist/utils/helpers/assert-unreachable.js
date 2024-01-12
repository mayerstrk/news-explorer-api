"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function assertUnreachable(x, message) {
    throw new Error(`${message}: ${x}`);
}
exports.default = assertUnreachable;
