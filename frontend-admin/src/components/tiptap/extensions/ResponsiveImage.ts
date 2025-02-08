// components/tiptap/toolbar/extensions/ResponsiveImage.ts

import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

const DEFAULT_CLASS_NAME = 'cms'

export const ResponsiveImage = Image.extend({
  name: 'responsiveImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: DEFAULT_CLASS_NAME,
      },
      srcset: {
        default: null,
        parseHTML: (element) => element.getAttribute('srcset'),
        renderHTML: (attributes) => {
          if (!attributes.srcset) {
            return {}
          }
          return {
            srcset: attributes.srcset,
          }
        },
      },
      sizes: {
        default: null,
        parseHTML: (element) => element.getAttribute('sizes'),
        renderHTML: (attributes) => {
          if (!attributes.sizes) {
            return {}
          }
          return {
            sizes: attributes.sizes,
          }
        },
      },
      loading: {
        default: 'eager',
        parseHTML: (element) => element.getAttribute('loading'),
        renderHTML: (attributes) => {
          return {
            loading: attributes.loading,
          }
        },
      },
      decoding: {
        default: 'async',
        parseHTML: (element) => element.getAttribute('decoding'),
        renderHTML: (attributes) => {
          return {
            decoding: attributes.decoding,
          }
        },
      },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute('width'),
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {}
          }
          return {
            width: attributes.width,
          }
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute('height'),
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {}
          }
          return {
            height: attributes.height,
          }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const mergedAttributes = mergeAttributes(
      this.options.HTMLAttributes,
      HTMLAttributes,
      { class: DEFAULT_CLASS_NAME }
    )
    return ['img', mergedAttributes]
  },
})
