/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'

import HorizontalAlign from '@tiptap/extension-horizontal-rule'
import Color from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Quote,
  Undo,
  Redo,
  Palette,
  UnderlineIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Underline from '@tiptap/extension-underline' // Add this import
import { useEffect } from "react"

export default function RichTextEditor({
  value,
  onChange,
  className = "",
  style = {},
  toolbarClassName = "",
  toolbarStyle = {},
  editorClassName = "",
  editorStyle = {},
}: {
  value: string
  onChange: (value: string) => void
  className?: string
  style?: React.CSSProperties
  toolbarClassName?: string
  toolbarStyle?: React.CSSProperties
  editorClassName?: string
  editorStyle?: React.CSSProperties
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Color.configure({
        types: ['textStyle'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      HorizontalAlign,
      TextAlign,
    ],
    content: value || "",
    onUpdate({ editor }: { editor: import('@tiptap/core').Editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
  ]

  if (!editor) {
    return null
  }

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }

  return (
    <div
      className={`w-full max-w-4xl mx-auto border rounded-lg bg-white shadow-sm ${className}`}
      style={style}
    >
      {/* Toolbar */}
      <div
        className={`border-b p-2 flex flex-wrap items-center gap-1 overflow-hidden ${toolbarClassName}`}
        style={toolbarStyle}
      >
        {/* ...toolbar buttons (unchanged)... */}
        <Button
          variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8 p-0"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Separator orientation="vertical" className="h-6" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className={`min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none  ${editorClassName}`}
        style={editorStyle}
      />
    </div>
  )
}
