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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogin = exports.logout = exports.verLogin = void 0;
var cookieParser = require("cookie-parser");
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var config_1 = require("../config");
var db_1 = require("../db");
var util_1 = require("../util");
/** 中间件，登录校验 */
var verLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, verCookie(req, res)];
            case 1:
                _a.sent();
                run(req, res, next, req.cookies);
                return [2 /*return*/];
        }
    });
}); };
exports.verLogin = verLogin;
var postVerLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, verBody(req, res)];
            case 1:
                _a.sent();
                run(req, res, next, req.body);
                return [2 /*return*/];
        }
    });
}); };
var run = function (req, res, next, paramData) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, loginName, password, sql;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, db_1.initDatabase)(req, res, function () { return null; })
                // 校验 Cookie 格式
            ];
            case 1:
                _b.sent();
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty())
                    return [2 /*return*/, (0, util_1.printErr)(res, errors.array()[0].msg)
                        // 获取 Cookie 字段值
                    ];
                loginName = paramData.loginName;
                password = paramData.password;
                sql = "SELECT COUNT(*) FROM `".concat(config_1.DB_CONFIG.table.user, "` WHERE\n    (`user_name` = '").concat(loginName, "' OR `email` = '").concat(loginName, "') AND `password_md5` = '").concat(password, "'");
                // 执行查询
                (_a = req.conn) === null || _a === void 0 ? void 0 : _a.query(sql, function (err, result) {
                    if (err)
                        return (0, util_1.printErr)(res, err.message);
                    if (result[0]['COUNT(*)'] == 0)
                        return (0, util_1.printErr)(res, '用户名或密码错误');
                    next();
                });
                return [2 /*return*/];
        }
    });
}); };
/** 登录校验 */
exports.default = (0, express_1.Router)().get('/login', exports.verLogin, function (req, res) {
    (0, util_1.printSuc)(res, null, '成功');
});
/** 退出登录 */
exports.logout = (0, express_1.Router)().get('/logout', function (req, res) {
    res.clearCookie('loginName');
    res.clearCookie('password');
    (0, util_1.printSuc)(res, null, '退出登录成功');
});
/** POST 方式登录校验 */
exports.postLogin = (0, express_1.Router)().post('/login', postVerLogin, function (req, res) {
    var sixMonthsInMs = 1000 * 60 * 60 * 24 * 30 * 6;
    var options = {
        maxAge: sixMonthsInMs,
        httpOnly: true,
    };
    res.cookie('loginName', req.body.loginName, options);
    res.cookie('password', req.body.password, options);
    (0, util_1.printSuc)(res, null, '登录成功');
});
/** 校验 Cookie */
function verCookie(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cookieParser()(req, res, function () { return null; });
                    return [4 /*yield*/, new Promise(function (resolve) {
                            (0, express_validator_1.cookie)('loginName')
                                .custom(function (input) { return input.match(/^\w{4,20}$/); })
                                .withMessage('用户名长度为4-20个字符')(req, res, function () { return resolve(null); });
                        })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            (0, express_validator_1.cookie)('password')
                                .custom(function (input) { return input.match(/^\w{32}$/); })
                                .withMessage('密码长度为32个字符')(req, res, function () { return resolve(null); });
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function verBody(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                        (0, express_validator_1.body)('loginName')
                            .custom(function (input) { return input.match(/^\w{4,20}$/); })
                            .withMessage('用户名长度为4-20个字符')(req, res, function () { return resolve(null); });
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) {
                            (0, express_validator_1.body)('password')
                                .custom(function (input) { return input.match(/^\w{32}$/); })
                                .withMessage('密码长度为32个字符')(req, res, function () { return resolve(null); });
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
