"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const controllerBuilder = (controllerHelper) => {
    return (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let data;
            ({ response, request, data } = yield controllerHelper(request, response));
            response.status(200 /* Status.ok */).send({ data });
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = controllerBuilder;
//# sourceMappingURL=controller-builder.js.map