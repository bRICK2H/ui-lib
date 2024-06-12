import Vue from 'vue'

const registerComponents = () => {
  const module = require.context('./components', true, /ui-[\w-]+\.vue$/)

  module.keys().forEach((path) => {
    const {
      default: { name },
      default: component,
    } = module(path)

    Vue.component(name, component)
  })
}

const registerDirectives = () => {
  const module = require.context('./directives', true, /index\.ts$/)

  module.keys().forEach((path) => {
    const {
      default: { name, directive },
    } = module(path)

    Vue.directive(name, directive)
  })
}

const registerModules = () => {
  const modules = [registerComponents, registerDirectives]

  modules.forEach((module) => module())
}

export default {
  install: registerModules,
}
