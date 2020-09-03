const PRESERVED = ['arguments', 'caller', 'constructor', 'length', 'prototype']

function assignFunctions(from, to) {
  let names = Object.getOwnPropertyNames(from)
  names.forEach(name => {
    if (PRESERVED.includes(name) || Object.prototype.toString.call(from[name]) !== '[object Function]') return
    to[name] = from[name]
  })
}

export default function mergeFunctions(fromFn, toFn) {
  if (!fromFn) return toFn

  const fromFnProto = fromFn.prototype ? fromFn : null

  if (fromFnProto) assignFunctions(fromFnProto, toFn)

  const fromProto = fromFn.prototype || fromFn
  const toProto = toFn.prototype || toFn
  assignFunctions(fromProto, toProto)

  const proto = fromProto.__proto__
  if (proto && proto.constructor !== Object) {
    return mergeFunctions(proto.constructor, toFn)
  }

  return toFn
}
