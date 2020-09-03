import Immutable from 'immutable'
import invariant from 'fbjs/lib/invariant'

import mergeFunctions from './mergeFunctions'

const Map = Immutable.Map
const Record = Immutable.Record

const NATIVE_TYPES = ['Map', 'List', 'Set']
const RE_MODEL_TYPE = /(\w+)(<(\w+)>)?/

function _isObject(obj) {
  return obj == null || isObject(obj)
}

function isObject(object) {
  if (!object) return false
  return Object.prototype.toString.call(object) === '[object Object]' || Array.isArray(object)
}

class Domain {
  constructor() {
    this.__models = Map()
  }

  register(Model, name) {
    if (!Model) { return }
    name = name || Model.modelName || Model.name
    if (this.__models.get(name)) { return }

    class RecModel extends Record(new Model()) {
      constructor(obj, force) {
        invariant(!(!force && Model.fromJS), `Instance of Model ${name} should be created by ${name}.fromJS method, instead of using constructor directly`)
        super(obj)
      }
    }
    mergeFunctions(Model, RecModel)

    RecModel.domain = this
    RecModel.prototype.domain = this
    RecModel.prototype.isModel = true
    RecModel.displayName = name

    this.__models = this.__models.set(name, RecModel)
  }

  has(name) {
    return this.__models.has(name)
  }

  get(name) {
    return this.__models.get(name)
  }

  instanceof(name, inst) {
    let Model = this.get(name)
    if (!Model) { return false }
    return inst instanceof Model
  }

  create(model, obj) {
    if (!_isObject(obj)) { return obj }

    let res = RE_MODEL_TYPE.exec(model)
    if (!res) { return }

    let cType = res[1]
    let mType = res[3]
    if (!cType && !mType) { return }

    if (!mType) {
      mType = cType
      cType = null
    }

    invariant(!cType || !NATIVE_TYPES.includes(cType), `Collection type ${cType} is invalid`)
    invariant(mType && (this.has(mType) || Immutable[mType]), `Model ${mType} not found in domain, make sure it's registered.`)

    let Collection = cType ? Immutable[cType] : null
    let Model = this.get(mType) || Immutable[mType]

    function createInstance(obj) {
      if (!_isObject(obj)) { return obj }
      if (obj instanceof Model) { return obj }
      if (!obj && Model.Empty) { return Model.Empty() }
      return new Model(obj)
    }

    if (!Collection) {
      return createInstance(obj)
    }

    return Collection(obj).map((entry) => { return createInstance(entry) })
  }
}

export default Domain
