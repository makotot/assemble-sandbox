import $ from 'jquery'
import _ from 'lodash'


export class Template {

  constructor (options) {
    this.$template = $(options.template)
    this.$target = $(options.target)
  }

  init () {
    const compiled = _.template(this.$template.html())
    const template = compiled()

    this.$target.append(template)
  }
}
