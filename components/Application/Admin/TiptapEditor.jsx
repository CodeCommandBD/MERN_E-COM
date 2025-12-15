"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Highlighter,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const MenuBar = ({ editor }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageInput(false);
    }
  };

  const setColor = (color) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", 
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#008000"
  ];

  return (
    <div className="border-b border-gray-300 dark:border-gray-700 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-900">
      {/* Text Formatting */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        variant={editor.isActive("bold") ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        variant={editor.isActive("italic") ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        variant={editor.isActive("underline") ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        variant={editor.isActive("strike") ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        variant={editor.isActive("code") ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Code className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Headings */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
        size="sm"
        className="h-8 px-2"
      >
        <Heading1 className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
        size="sm"
        className="h-8 px-2"
      >
        <Heading2 className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        variant={editor.isActive("heading", { level: 3 }) ? "default" : "outline"}
        size="sm"
        className="h-8 px-2"
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Lists */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        variant={editor.isActive("bulletList") ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <List className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        variant={editor.isActive("orderedList") ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        variant={editor.isActive("blockquote") ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Quote className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Alignment */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <AlignLeft className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        variant={editor.isActive({ textAlign: "center" }) ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        variant={editor.isActive({ textAlign: "right" }) ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        variant={editor.isActive({ textAlign: "justify" }) ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Link */}
      <div className="relative">
        <Button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          variant={editor.isActive("link") ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        {showLinkInput && (
          <div className="absolute top-10 left-0 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 shadow-lg flex gap-2">
            <Input
              type="url"
              placeholder="Enter URL"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLink()}
              className="w-48"
            />
            <Button type="button" onClick={addLink} size="sm">Add</Button>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="relative">
        <Button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        {showImageInput && (
          <div className="absolute top-10 left-0 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 shadow-lg flex gap-2">
            <Input
              type="url"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addImage()}
              className="w-48"
            />
            <Button type="button" onClick={addImage} size="sm">Add</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
      >
        <TableIcon className="h-4 w-4" />
      </Button>

      {/* Highlight */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        variant={editor.isActive("highlight") ? "default" : "outline"}
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Highlighter className="h-4 w-4" />
      </Button>

      {/* Color Picker */}
      <div className="relative">
        <Button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <Palette className="h-4 w-4" />
        </Button>
        {showColorPicker && (
          <div className="absolute top-10 left-0 z-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 shadow-lg grid grid-cols-5 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setColor(color)}
                className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 mx-1" />

      {/* Undo/Redo */}
      <Button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        variant="outline"
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function TiptapEditor({ onChange, initialData = "" }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      Highlight,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialData,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(null, { getData: () => html });
      }
    },
    immediatelyRender: false,
  });

  // Update editor content when initialData changes
  useEffect(() => {
    if (editor && initialData !== editor.getHTML()) {
      editor.commands.setContent(initialData);
    }
  }, [initialData, editor]);

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden bg-white dark:bg-gray-950">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:focus:outline-none caret-black dark:caret-white"
      />
    </div>
  );
}
