"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExt from "@tiptap/extension-link";
import { useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Heading3,
  Pilcrow,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { labelCls } from "./AdminUI";

/**
 * Compact rich-text field that serialises to HTML via a hidden input
 * named `name`. Drop-in replacement for <TextArea> inside a form.
 *
 * Supports: bold, italic, H3, paragraph, bullet/numbered lists, quote,
 * link, undo/redo. Ships without heading level 1 or image (keep the
 * full TipTap editor for the blog body where those are wanted).
 */
export function RichTextArea({
  label,
  name,
  defaultValue = "",
  placeholder = "",
  minHeight = 140,
  helper,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  minHeight?: number;
  helper?: string;
}) {
  const [html, setHtml] = useState<string>(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [3] } }),
      Placeholder.configure({ placeholder }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-gold underline underline-offset-2" },
      }),
    ],
    content: defaultValue || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-invert max-w-none focus:outline-none px-3 py-3",
          "[&_p]:my-2 [&_h3]:font-display [&_h3]:text-lg",
        ),
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  function addLink() {
    if (!editor) return;
    const prev = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const btn = "p-1.5 rounded hover:bg-white/10 text-white/70 transition-colors";
  const active = "bg-white/10 text-white";

  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <div className="mt-1 rounded-md border border-white/15 bg-white/5">
        {editor ? (
          <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-white/10">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(btn, editor.isActive("bold") && active)}
              aria-label="Bold"
            >
              <Bold size={13} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(btn, editor.isActive("italic") && active)}
              aria-label="Italic"
            >
              <Italic size={13} />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              type="button"
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={cn(btn, editor.isActive("paragraph") && active)}
              aria-label="Paragraph"
            >
              <Pilcrow size={13} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={cn(btn, editor.isActive("heading", { level: 3 }) && active)}
              aria-label="Heading"
            >
              <Heading3 size={13} />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(btn, editor.isActive("bulletList") && active)}
              aria-label="Bulleted list"
            >
              <List size={13} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(btn, editor.isActive("orderedList") && active)}
              aria-label="Numbered list"
            >
              <ListOrdered size={13} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={cn(btn, editor.isActive("blockquote") && active)}
              aria-label="Quote"
            >
              <Quote size={13} />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              type="button"
              onClick={addLink}
              className={cn(btn, editor.isActive("link") && active)}
              aria-label="Link"
            >
              <LinkIcon size={13} />
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              className={btn}
              aria-label="Undo"
            >
              <Undo2 size={13} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              className={btn}
              aria-label="Redo"
            >
              <Redo2 size={13} />
            </button>
          </div>
        ) : null}
        <EditorContent editor={editor} />
        <input type="hidden" name={name} value={html} />
      </div>
      {helper ? <span className="block mt-1 text-xs text-white/50">{helper}</span> : null}
    </label>
  );
}
