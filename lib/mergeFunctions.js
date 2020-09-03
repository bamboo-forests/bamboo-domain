'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mergeFunctions;
var PRESERVED = ['arguments', 'caller', 'constructor', 'length', 'prototype'];

function assignFunctions(from, to) {
  var names = Object.getOwnPropertyNames(from);
  names.forEach(function (name) {
    if (PRESERVED.includes(name) || Object.prototype.toString.call(from[name]) !== '[object Function]') return;
    to[name] = from[name];
  });
}

function mergeFunctions(fromFn, toFn) {
  if (!fromFn) return toFn;

  var fromFnProto = fromFn.prototype ? fromFn : null;

  if (fromFnProto) assignFunctions(fromFnProto, toFn);

  var fromProto = fromFn.prototype || fromFn;
  var toProto = toFn.prototype || toFn;
  assignFunctions(fromProto, toProto);

  var proto = fromProto.__proto__;
  if (proto && proto.constructor !== Object) {
    return mergeFunctions(proto.constructor, toFn);
  }

  return toFn;
}
module.exports = exports.default;