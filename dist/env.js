"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REDIS_PORT = exports.REDIS_HOST = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.REDIS_HOST = process.env.REDIS_HOST;
exports.REDIS_PORT = parseInt(process.env.REDIS_PORT);
