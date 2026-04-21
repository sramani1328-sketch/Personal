"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExt from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading2,
  Heading3,
  Pilcrow,
  Undo2,
  Redo2,
  Code,
} from "lucide-react";
import { uploadImage } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

export function TipTap({
  initialHtml,
  onUpdate,
}: {
  initialHtml: string;
  onUpdate: (html: string, json: unknown) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write your post…" }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-gold underline underline-offset-2" },
      }),
      ImageExt.configure({ HTMLAttributes: { class: "rounded-lg my-6" } }),
    ],
    content: initialHtml || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[400px] focus:outline-none px-4 py-4 [&_h2]:font-display [&_h3]:font-display",
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML(), editor.getJSON());
    },
  });

  // Keep in sync on external reset
  useEffect(() => {
    if (editor && initialHtml && editor.getHTML() !== initialHtml) {
      // do nothing—avoid overwriting user edits; left for parent-controlled reset scenarios
    }
  }, [editor, initialHtml]);

  if (!editor) return null;

  async function addImage() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;
      const fd = new FormData();
      fd.set("file", f);
      try {
        const url = await uploadImage(fd);
        editor!.chain().focus().setImage({ src: url }).run();
      } catch (err) {
        alert((err as Error).message);
      }
    };
    input.click();
  }

  function addLink() {
    const prev = editor!.getAttributes("link").href as string | undefined;
    const url = prompt("URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const btn = "p-2 rounded hover:bg-white/10 text-white/70";
  const active = "bg-white/10 text-white";

  return (
    <div className="rounded-lg border border-white/15 bg-white/5">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(btn, editor.isActive("bold") && active)}
          aria-label="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(btn, editor.isActive("italic") && active)}
          aria-label="Italic"
        >
          <Italic size={14} />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={cn(btn, editor.isActive("paragraph") && active)}
          aria-label="Paragraph"
        >
          <Pilcrow size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn(btn, editor.isActive("heading", { level: 2 }) && active)}
          aria-label="H2"
        >
          <Heading2 size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={cn(btn, editor.isActive("heading", { level: 3 }) && active)}
          aria-label="H3"
        >
          <Heading3 size={14} />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(btn, editor.isActive("bulletList") && active)}
          aria-label="Bulleted list"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(btn, editor.isActive("orderedList") && active)}
          aria-label="Numbered list"
        >
          <ListOrdered size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(btn, editor.isActive("blockquote") && active)}
          aria-label="Quote"
        >
          <Quote size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(btn, editor.isActive("codeBlock") && active)}
          aria-label="Code block"
        >
          <Code size={14} />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button type="button" onClick={addLink} className={cn(btn, editor.isActive("link") && active)} aria-label="Link">
          <LinkIcon size={14} />
        </button>
        <button type="button" onClick={addImage} className={btn} aria-label="Image">
          <ImageIcon size={14} />
        </button>
        <div className="flex-1" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn} aria-label="Undo">
          <Undo2 size={14} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn} aria-label="Redo">
          <Redo2 size={14} />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
