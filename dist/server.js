"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _index = _interopRequireDefault(require("./routes/index.routes"));

var _products = _interopRequireDefault(require("./routes/products.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])(); // Config

app.set('port', process.env.PORT || 3000); // Rutas

// Middlewares
app.use(_express["default"].json());
app.use(_index["default"]);
app.use('/products', _products["default"]);
var _default = app;
exports["default"] = _default;