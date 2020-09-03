'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _invariant = require('fbjs/lib/invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _mergeFunctions = require('./mergeFunctions');

var _mergeFunctions2 = _interopRequireDefault(_mergeFunctions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = _immutable2.default.Map;
var Record = _immutable2.default.Record;

var NATIVE_TYPES = ['Map', 'List', 'Set'];
var RE_MODEL_TYPE = /(\w+)(<(\w+)>)?/;

function _isObject(obj) {
  return obj == null || isObject(obj);
}

function isObject(object) {
  if (!object) return false;
  return Object.prototype.toString.call(object) === '[object Object]' || Array.isArray(object);
}

var Domain = function () {
  function Domain() {
    _classCallCheck(this, Domain);

    this.__models = Map();
  }

  _createClass(Domain, [{
    key: 'register',
    value: function register(Model, name) {
      if (!Model) {
        return;
      }
      name = name || Model.modelName || Model.name;
      if (this.__models.get(name)) {
        return;
      }

      var RecModel = function (_Record) {
        _inherits(RecModel, _Record);

        function RecModel(obj, force) {
          _classCallCheck(this, RecModel);

          (0, _invariant2.default)(!(!force && Model.fromJS), 'Instance of Model ' + name + ' should be created by ' + name + '.fromJS method, instead of using constructor directly');
          return _possibleConstructorReturn(this, (RecModel.__proto__ || Object.getPrototypeOf(RecModel)).call(this, obj));
        }

        return RecModel;
      }(Record(new Model()));

      (0, _mergeFunctions2.default)(Model, RecModel);

      RecModel.domain = this;
      RecModel.prototype.domain = this;
      RecModel.prototype.isModel = true;
      RecModel.displayName = name;

      this.__models = this.__models.set(name, RecModel);
    }
  }, {
    key: 'has',
    value: function has(name) {
      return this.__models.has(name);
    }
  }, {
    key: 'get',
    value: function get(name) {
      return this.__models.get(name);
    }
  }, {
    key: 'instanceof',
    value: function _instanceof(name, inst) {
      var Model = this.get(name);
      if (!Model) {
        return false;
      }
      return inst instanceof Model;
    }
  }, {
    key: 'create',
    value: function create(model, obj) {
      if (!_isObject(obj)) {
        return obj;
      }

      var res = RE_MODEL_TYPE.exec(model);
      if (!res) {
        return;
      }

      var cType = res[1];
      var mType = res[3];
      if (!cType && !mType) {
        return;
      }

      if (!mType) {
        mType = cType;
        cType = null;
      }

      (0, _invariant2.default)(!cType || !NATIVE_TYPES.includes(cType), 'Collection type ' + cType + ' is invalid');
      (0, _invariant2.default)(mType && (this.has(mType) || _immutable2.default[mType]), 'Model ' + mType + ' not found in domain, make sure it\'s registered.');

      var Collection = cType ? _immutable2.default[cType] : null;
      var Model = this.get(mType) || _immutable2.default[mType];

      function createInstance(obj) {
        if (!_isObject(obj)) {
          return obj;
        }
        if (obj instanceof Model) {
          return obj;
        }
        if (!obj && Model.Empty) {
          return Model.Empty();
        }
        return new Model(obj);
      }

      if (!Collection) {
        return createInstance(obj);
      }

      return Collection(obj).map(function (entry) {
        return createInstance(entry);
      });
    }
  }]);

  return Domain;
}();

exports.default = Domain;
module.exports = exports.default;