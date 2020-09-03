'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Domain = require('./Domain');

var _Domain2 = _interopRequireDefault(_Domain);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var singleton = new _Domain2.default();
singleton.Domain = _Domain2.default;

exports.default = singleton;
module.exports = exports.default;