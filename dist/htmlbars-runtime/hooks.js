"use strict";
var merge = require("./utils").merge;
var SafeString = require("../handlebars/safe-string")["default"];

function content(morph, helperName, context, params, options, env) {
  var value, helper = this.lookupHelper(helperName, context, options);
  if (helper) {
    value = helper(params, options, env);
  } else {
    value = this.simple(context, helperName, options);
  }
  if (!options.escaped) {
    value = new SafeString(value);
  }
  morph.update(value);
}

exports.content = content;function webComponent(morph, tagName, context, options, env) {
  var value, helper = this.lookupHelper(tagName, context, options);
  if (helper) {
    value = helper(null, options, env);
  } else {
    value = this.webComponentFallback(morph, tagName, context, options, env);
  }
  morph.update(value);
}

exports.webComponent = webComponent;function webComponentFallback(morph, tagName, context, options, env) {
  var element = env.dom.createElement(tagName);
  var hash = options.hash, hashTypes = options.hashTypes;

  for (var name in hash) {
    if (hashTypes[name] === 'id') {
      element.setAttribute(name, this.simple(context, hash[name], options));
    } else {
      element.setAttribute(name, hash[name]);
    }
  }
  element.appendChild(options.render(context, env, morph.contextualElement));
  return element;
}

exports.webComponentFallback = webComponentFallback;function element(domElement, helperName, context, params, options, env) {
  var helper = this.lookupHelper(helperName, context, options);
  if (helper) {
    helper(params, options, env);
  }
}

exports.element = element;function attribute(params, options, env) {
  var attrName = params[0];
  var attrValue = params[1];

  if (attrValue === null) {
    options.element.removeAttribute(attrName);
  } else {
    options.element.setAttribute(attrName, attrValue);
  }
}

exports.attribute = attribute;function concat(params, options, env) {
  var context = options.context;
  var value = "";
  for (var i = 0, l = params.length; i < l; i++) {
    if (options.types[i] === 'id') {
      value += this.simple(context, params[i], options);
    } else {
      value += params[i];
    }
  }
  return value;
}

exports.concat = concat;function partial(params, options, env) {
  return env.partials[params[0]](options.context, env);
}

exports.partial = partial;function subexpr(helperName, context, params, options, env) {
  var helper = this.lookupHelper(helperName, context, options);
  if (helper) {
    return helper(params, options, env);
  } else {
    return this.simple(context, helperName, options);
  }
}

exports.subexpr = subexpr;function lookupHelper(helperName, context, options) {
  if (helperName === 'attribute') {
    return this.attribute;
  }
  else if (helperName === 'partial'){
    return this.partial;
  }
  else if (helperName === 'concat') {
    return this.concat;
  }
}

exports.lookupHelper = lookupHelper;function simple(context, name, options) {
  return context[name];
}

exports.simple = simple;function hydrationHooks(extensions) {
  var base = {
    content: content,
    webComponent: webComponent,
    webComponentFallback: webComponentFallback,
    element: element,
    attribute: attribute,
    concat: concat,
    subexpr: subexpr,
    lookupHelper: lookupHelper,
    simple: simple,
    partial: partial
  };

  return extensions ? merge(extensions, base) : base;
}

exports.hydrationHooks = hydrationHooks;