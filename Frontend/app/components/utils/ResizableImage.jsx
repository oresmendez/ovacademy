import { mergeAttributes } from '@tiptap/core'
import Image from '@tiptap/extension-image'

export const ResizableImage = Image.extend({
    name: 'image',

    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '300',
                parseHTML: el => el.getAttribute('width') || '300',
                renderHTML: attrs => ({
                    width: attrs.width,
                    style: `width: ${attrs.width}px;`,
                }),
            },
        }
    },

    renderHTML({ HTMLAttributes }) {
        return ['img', mergeAttributes(HTMLAttributes, { class: 'selectable-image' })];
    },
});
