import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Node as ProseMirrorNode } from "prosemirror-model";

//places a fake horizontal caret on the last paragraph if it's empty
export const LastParagraphMarker = Extension.create({
  name: "lastParagraphMarker",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("last-paragraph-marker"),
        state: {
          init: () => DecorationSet.empty,
          apply(tr) {
            const decorations: Decoration[] = [];
            const doc = tr.doc;
            const { from } = tr.selection;

            let lastPos: number | null = null;
            let lastNode: ProseMirrorNode | null = null;

            doc.descendants((node, pos) => {
              if (node.type.name === "paragraph" || node.type.name === "heading") {
                lastPos = pos;
                lastNode = node;
              }
              return true;
            });

            if (
              lastPos !== null &&
              lastNode &&
              (lastNode as ProseMirrorNode).textContent.trim().length === 0
            ) {
              const caretInsideLast =
                from >= lastPos && from <= lastPos + (lastNode as ProseMirrorNode).nodeSize;

              const editorHasFocus = document.activeElement === document.querySelector('.ProseMirror');

              // Only skip applying if caret is in last AND editor is focused
              const shouldApply = !caretInsideLast || !editorHasFocus;

              if (shouldApply) {
                const deco = Decoration.node(
                  lastPos,
                  lastPos + (lastNode as ProseMirrorNode).nodeSize,
                  { class: "last-paragraph" }
                );
                decorations.push(deco);
              }
            }

            return DecorationSet.create(doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});
