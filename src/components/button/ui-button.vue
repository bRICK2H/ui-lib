<template>
  <button
    v-if="isRender"
    v-bind="$attrs"
    :title="title()"
    :disabled="disabled"
    :autofocus="autofocus"
    :tabindex="advancedTabindex"
    :class="[
      'ui-button',
      `ui-button__${size}`,
      `ui-button__${buttonVariantType}`,
      `ui-button__${size}--${buttonView}`,
      `ui-button__${buttonVariantType}--${buttonColorType}`,
      {
        'is-fab': isFab,
        'is-fluid': fluid,
        'is-loading': loading,
        'is-icon-left': isIconLeft,
        'is-icon-right': isIconRight,
        'is-right-indent': rightIndent,
        'is-enabled': !disabled && !loading,
        'is-icon-only-one': isIconOnlyOne && !fluid,
      },
    ]"
    v-on="events"
  >
    <div
      v-if="loading"
      class="ui-button__loading-content"
    >
      <ui-preloader
        :size="iconLoadingSize"
        :visible="loading"
        :color="iconColor"
        position="relative"
      />
    </div>

    <div
      ref="ref-button"
      :class="['ui-button__text-content', { 'is-hidden': loading }]"
    >
      <ui-icon
        v-if="icon && !rightIcon"
        :name="icon"
        :width="iconDefaultSize"
        :height="iconDefaultSize"
        :color="iconColor"
      />

      <slot />

      <ui-icon
        v-if="icon && rightIcon"
        :name="icon"
        :width="iconDefaultSize"
        :height="iconDefaultSize"
        :color="iconColor"
      />
    </div>
  </button>
</template>

<script>
import {
  SIZES,
  RULE_FAB,
  ICON_SIZES,
  ICON_COLORS,
  RULE_VARIANTS,
} from './config.ts'

export default {
  name: 'UiButton',
  props: {
    /**
     * Type
     * Same as native button's type
     * [button, submit, reset]
     */

    // -----------------------------------

    /**
     * Button size
     * [xs, sm, md, lg, xl, 2xl, 3xl]
     */
    size: {
      type: String,
      default: 'md',
      validator: (value) => {
        return Object.keys(SIZES).includes(value)
      },
    },

    /**
     * Button color variants
     * [primary, success, danger, critical, translucent, tonal-primary, tonal-success, tonal-danger, tonal-critical, outline-primary, outline-success, outline-danger, outline-critical, ghost-primary, ghost-success, ghost-danger, ghost-critical, text-primary, text-success, text-danger, text-critical]
     */
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => {
        return Object.keys(RULE_VARIANTS).includes(value)
      },
    },

    /**
     * Icon color type
     * [white, fixed, primary, success, critical, danger]
     */
    iconColorType: {
      type: String,
      default: '',
      validator(value) {
        return value === '' || Object.keys(ICON_COLORS).includes(value)
      },
    },

    /**
     * Icon name
     */
    icon: {
      type: String,
      default: '',
    },

    /**
     * Participating in sequential navigation
     */
    tabindex: {
      type: [String, Number],
      default: '',
    },

    /**
     * To determine if icon is on left or right for ghost button
     */
    rightIcon: {
      type: Boolean,
      default: false,
    },

    /**
     * Floating action button
     */
    fab: {
      type: Boolean,
      default: false,
    },

    /**
     * Determine whether it's may take all free width
     */
    fluid: {
      type: Boolean,
      default: false,
    },

    /**
     * Disable the button
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Loading the button
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * Multiline
     */
    multiline: {
      type: Boolean,
      default: false,
    },

    /**
     * Same as native button's autofocus
     */

    autofocus: {
      type: Boolean,
      default: false,
    },

    /**
     * Connect the right indent if there is a neighboring button
     */
    rightIndent: {
      type: Boolean,
      default: false,
    },

    /**
     * Whether to show browser default hint when hover
     */
    showHoverHint: {
      type: Boolean,
      default: false,
    },

    /**
     * Ignore all rules from the config
     */
    ignoreRules: {
      type: Boolean,
      default: false,
    },

    /**
     * Deep binding of text styles
     */
    deepBindingTextStyles: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    textNodes: [],
    iconIndexes: [],
    textContentNodes: [],

    isIcon: false,
    isText: false,
    isRender: true,
    isIconLeft: false,
    isIconRight: false,
    isIconOnlyOne: false,
    isButtonLoaded: false,
    isTextUpdatedInSlot: false,
  }),
  computed: {
    events() {
      return !this.loading ? this.$listeners : null
    },

    buttonColorType() {
      const [variant, color] = this.variant.split('-')
      return color ? color : variant
    },

    buttonVariantType() {
      const [variant, color] = this.variant.split('-')
      return color ? variant : 'filled'
    },

    buttonView() {
      return this.buttonVariantType.includes('text')
        ? 'text-view'
        : 'button-view'
    },

    iconColor() {
      if (this.iconColorType) {
        return ICON_COLORS[this.iconColorType]
      }

      return this.buttonVariantType === 'filled'
        ? ICON_COLORS['white']
        : ICON_COLORS[this.buttonColorType]
    },

    iconDefaultSize() {
      if (this.isFab) {
        return this.size === '3xl' ? ICON_SIZES['xl'] : ICON_SIZES.lg
      }

      if (this.size === '3xl') {
        return ICON_SIZES.lg
      }

      return ['xs', 'sm'].includes(this.size) ? ICON_SIZES.sm : ICON_SIZES.md
    },

    iconLoadingSize() {
      if (this.loading) {
        if (this.size === 'xl') {
          return ICON_SIZES.lg
        }

        if (this.size === '3xl') {
          return ICON_SIZES['xl']
        }
      }

      return this.iconDefaultSize
    },

    isFab() {
      return this.fab && this.isIconOnlyOne
    },

    advancedTabindex() {
      return this.tabindex === ''
        ? this.disabled || this.loading || this.buttonVariantType === 'text'
          ? -1
          : 0
        : this.tabindex
    },
  },
  watch: {
    $props: {
      deep: true,
      immediate: true,
      handler: 'initButton',
    },
    async isTextUpdatedInSlot(slotUpdated) {
      if (slotUpdated) {
        this.reRenderButton()
      }
    },
  },
  updated() {
    this.isTextUpdatedInSlot = this.checkTextUpdateInSlot()
  },
  methods: {
    async initButton() {
      this.isRender = true

      await this.$nextTick()
      const node = this.$refs['ref-button']

      if (!node) return

      const childNodes = node.childNodes ?? []

      if (!this.isButtonLoaded) {
        this.reduceNode(childNodes, this.wrapTextNodes)
        this.reduceNode(childNodes, this.addClassTextNodes)
      }

      this.textNodes = this.reduceNode(childNodes, this.findTextNodes)
      this.iconIndexes = this.reduceNode(childNodes, this.findIconIndexes)
      this.textContentNodes = this.getTextContentInSlot(this.$slots.default)
      this.isIcon = this.iconIndexes.length > 0
      this.isText = this.textContentNodes.length > 0
      this.isIconOnlyOne = !this.isText && this.iconIndexes.length === 1

      if (this.isText && this.isIcon) {
        this.setIconPosition(node)
      }

      if (!this.ignoreRules) {
        this.isRender = this.checkBeforeRender()
      }

      this.isButtonLoaded = true
      this.isTextUpdatedInSlot = false
      // await new Promise((r) => setTimeout(r, 5000))
      // this.resolve()
    },

    // Re-render the button
    async reRenderButton() {
      this.isRender = false
      this.isButtonLoaded = false

      await this.$nextTick()
      this.initButton()
    },

    // Check for updated text in the slot
    checkTextUpdateInSlot() {
      const defaultSlot = this.$slots.default

      if (
        !this.isText ||
        defaultSlot === undefined ||
        defaultSlot.length === 0
      ) {
        return false
      }

      const isMatchesTextContent = this.textContentNodes.every((text) =>
        this.getTextContentInSlot(defaultSlot).includes(text)
      )

      if (!isMatchesTextContent) {
        return true
      }

      return false
    },

    // Recursion for dom nodes
    reduceNode(nodes, callback = () => ({}), accNodes = [], count = 0) {
      count++

      return [...nodes].reduce((acc, childNode, i) => {
        callback({
          i,
          acc,
          count,
          childNode,
          isTypeTextNode: childNode.nodeType === Node.TEXT_NODE,
          containsText:
            typeof childNode.textContent === 'string' &&
            Boolean(childNode.textContent.trim()),
        })

        if (childNode.childNodes) {
          this.reduceNode(childNode.childNodes, callback, acc, count)
        }

        return acc
      }, accNodes)
    },

    // Get text from the nodes in the slot
    getTextContentInSlot(vnode, accNodes = []) {
      if (!vnode) {
        return []
      }

      return vnode.reduce((acc, childNode) => {
        const text = childNode.text
        const children = childNode.children

        if (typeof text === 'string') {
          const textTrim = text.trim()

          if (textTrim) {
            acc.push(textTrim)
          }
        }

        if (children) {
          this.getTextContentInSlot(children, acc)
        }

        return acc
      }, accNodes)
    },

    // Wrap a text node with a span tag for the first level only
    wrapTextNodes(options) {
      const { i, count, childNode, isTypeTextNode, containsText } = options

      if (isTypeTextNode && containsText && count < 2) {
        let spanButton = document.createElement('span')
        spanButton.append(childNode.textContent)

        childNode.parentNode.replaceChild(
          spanButton,
          childNode.parentNode.childNodes[i]
        )
      }
    },

    // Find from all levels the text nodes of the button
    findTextNodes(options) {
      const { acc, childNode, isTypeTextNode, containsText } = options

      if (isTypeTextNode && containsText) {
        acc.push(childNode.parentNode)
      }
    },

    // Find all icon indexes
    findIconIndexes(options) {
      const node = this.$refs['ref-button']
      const { acc, childNode } = options

      if (childNode.tagName === 'svg') {
        const startPosition = acc.length > 0 ? acc[acc.length - 1] + 1 : 0
        acc.push(node.innerHTML.indexOf(childNode.outerHTML, startPosition))
      }
    },

    // Add text classes to the created text nodes
    addClassTextNodes(options) {
      const { count, childNode, containsText } = options

      if (!this.deepBindingTextStyles && count > 1) {
        return
      }

      const classes = [
        'target-text-node',
        this.multiline ? 'target-multiline' : '',
      ].filter((classItem) => classItem)

      if (containsText) {
        childNode.classList?.add(...classes)
      }
    },

    // Set icon position
    setIconPosition(node) {
      const [firstIconIndex, ...restOptions] = this.iconIndexes

      this.isIconLeft = this.getIconPosition(node, firstIconIndex, 'left')
      this.isIconRight = this.getIconPosition(node, firstIconIndex, 'right')

      if (restOptions.length > 0) {
        const lastIconIndex = this.iconIndexes[this.iconIndexes.length - 1]

        this.isIconRight = this.getIconPosition(node, lastIconIndex, 'right')
      }
    },

    // Get icon position
    getIconPosition(node, index, check) {
      const checked = ['left', 'right']
      let startIndexSearchText = -1
      const textNodeIndexes = this.textNodes.map((textItem) => {
        startIndexSearchText = node.innerHTML.indexOf(
          textItem.innerHTML,
          startIndexSearchText + 1
        )
        return startIndexSearchText
      })

      if (!checked.includes(check)) {
        throw new Error(`Set the direction to be checked - 'left' of 'right'`)
      }

      return textNodeIndexes.every((textIndex) =>
        check === 'left' ? index < textIndex : index > textIndex
      )
    },

    // Get button title
    title() {
      if (!this.showHoverHint) return ''

      const attrTitle = this.$attrs.title

      if (attrTitle && typeof attrTitle === 'string') {
        return attrTitle
      }

      const textContent = this.textContentNodes.join(' ')

      if (this.$slots.default && textContent) {
        return textContent
      }

      return ''
    },

    // Check properties before rendering
    checkBeforeRender() {
      if (this.fab) {
        const errorsFab = []
        const { sizes, variants } = RULE_FAB

        if (!this.isIconOnlyOne) {
          errorsFab.push('supported with only one icon;')
        }

        if (!sizes.includes(this.size)) {
          errorsFab.push(
            `size "${this.size}" is not supported, select any of [${sizes.join(
              ', '
            )}];`
          )
        }

        if (!variants.includes(this.variant)) {
          errorsFab.push(
            `variant "${
              this.variant
            }" is not supported, select any of [${variants.join(', ')}];`
          )
        }

        if (errorsFab.length > 0) {
          const numberedErrorsFab = errorsFab.map(
            (error, i) => `\n ${i + 1}. ${error}`
          )

          console.error(
            `[uikit@button]: Error in "fab" mode (floating action button) fix it: ${numberedErrorsFab.join(
              ''
            )}`
          )

          return false
        }
      }

      if (!this.fab && !RULE_VARIANTS[this.variant].includes(this.size)) {
        console.error(
          `[uikit@button]: Error in size='${this.size}', variant "${
            this.variant
          }" supports only these sizes: [${RULE_VARIANTS[this.variant].join(
            ', '
          )}]`
        )

        return false
      }

      return true
    },
  },
}
</script>
