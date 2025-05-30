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

export default function RichTextEditor() {
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
    content: `
      <p><strong>- Billet d'avion Aller/Retour en Vol Casablanca - Antalya</strong></p>
      <p>- 20kg Bagage en soute</p>
      <p>- 8 kg Bagage à main</p>
      <p>- Le transfert aéroport /hôtel/aéroport</p>
      <p>- Les nuitées à l'hôtel ( 4 nuits à l'hôtel Nashira city 4* à Antalya en demi pension et 3 nuits à l'hôtel Marina Boutique 4* à Fethiye en nuitée et petit déjeuner )</p>
    `,
  })

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
    <div className="w-full max-w-4xl mx-auto border rounded-lg bg-white shadow-sm">
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap items-center gap-1">
        {/* Font Family 
        <Select
          value={editor.getAttributes('textStyle').fontFamily || 'Arial'}
          onValueChange={(value) => {
            editor.chain().focus().setFontFamily(value).run()
          }}
        >
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
          </SelectContent>
        </Select>*/}

        {/* Font Size 
        <Select
          value={editor.getAttributes('textStyle').fontSize || '14px'}
          onValueChange={(value) => {
            editor.chain().focus().setFontSize(value).run()
          }}
        >
          <SelectTrigger className="w-16 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8px">8pt</SelectItem>
            <SelectItem value="10px">10pt</SelectItem>
            <SelectItem value="12px">12pt</SelectItem>
            <SelectItem value="14px">14pt</SelectItem>
            <SelectItem value="18px">18pt</SelectItem>
            <SelectItem value="24px">24pt</SelectItem>
            <SelectItem value="36px">36pt</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />*/}

        {/* Text Formatting */}
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

        {/* Lists */}
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

        {/* Alignment */}
        <Button
          variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Quote 
        <Button
          variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>*/}

        {/* Link 
        <Button
          variant={editor.isActive('link') ? 'secondary' : 'ghost'}
          size="sm"
          onClick={addLink}
          className="h-8 w-8 p-0"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>*/}

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="grid grid-cols-5 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6" />

        {/* Undo/Redo */}
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
        onChange={(e)=>console.log(e)}
        editor={editor}
        className="min-h-[400px] p-4 focus:outline-none prose prose-sm max-w-none"
      />
    </div>
  )
}
