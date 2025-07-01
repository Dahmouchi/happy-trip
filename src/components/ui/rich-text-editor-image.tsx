// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import TextStyle from "@tiptap/extension-text-style";
// import FontFamily from "@tiptap/extension-font-family";
// import TextAlign from "@tiptap/extension-text-align";
// import HorizontalAlign from "@tiptap/extension-horizontal-rule";
// import Color from "@tiptap/extension-color";
// import Image from "@tiptap/extension-image";
// import Link from "@tiptap/extension-link";
// import { Separator } from "@/components/ui/separator";
// import {
//   Bold,
//   Italic,
//   List,
//   ListOrdered,
//   Link as LinkIcon,
//   Undo,
//   Redo,
//   UnderlineIcon,
// } from "lucide-react";
// import Underline from "@tiptap/extension-underline"; // Add this import
// import { useEffect } from "react";
// import ListItem from "@tiptap/extension-list-item";
// import BulletList from "@tiptap/extension-bullet-list";
// import OrderedList from "@tiptap/extension-ordered-list";

// export default function RichTextEditor({
//   value,
//   onChange,
//   className = "",
//   style = {},
//   toolbarClassName = "",
//   toolbarStyle = {},
//   editorClassName = "",
//   editorStyle = {},
// }: {
//   value: string;
//   onChange: (value: string) => void;
//   className?: string;
//   style?: React.CSSProperties;
//   toolbarClassName?: string;
//   toolbarStyle?: React.CSSProperties;
//   editorClassName?: string;
//   editorStyle?: React.CSSProperties;
// }) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         bulletList: {
//           HTMLAttributes: {
//             class: "list-disc pl-4",
//           },
//         },
//         orderedList: {
//           HTMLAttributes: {
//             class: "list-decimal pl-4",
//           },
//         },
//         listItem: {
//           HTMLAttributes: {
//             class: "leading-normal",
//           },
//         },
//       }),
//       TextStyle,
//       FontFamily,
//       Color.configure({
//         types: ["textStyle"],
//       }),
//       Link.configure({
//         openOnClick: false,
//       }),
//       Underline,
//       HorizontalAlign,
//       TextAlign,
//       Image,
//     ],
//     content: value || "",
//     onUpdate({ editor }) {
//       onChange(editor.getHTML());
//     },
//   });

//   useEffect(() => {
//     if (editor && value !== editor.getHTML()) {
//       editor.commands.setContent(value || "", false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [value]);

//   if (!editor) {
//     return null;
//   }

//   const addLink = () => {
//     const previousUrl = editor.getAttributes("link").href;
//     const url = window.prompt("URL", previousUrl);

//     // cancelled
//     if (url === null) {
//       return;
//     }

//     // empty
//     if (url === "") {
//       editor.chain().focus().extendMarkRange("link").unsetLink().run();
//       return;
//     }

//     // update link
//     editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
//   };

//   return (
//     <div
//       className={`w-full mx-auto border rounded-lg bg-white shadow-sm ${className}`}
//       style={style}
//     >
//       {/* Toolbar */}
//       <div
//         className={`border-b p-2 flex flex-wrap items-center gap-1 overflow-hidden ${toolbarClassName}`}
//         style={toolbarStyle}
//       >
//         {/* ...toolbar buttons (unchanged)... */}
//         <div
//           role="button"
//           tabIndex={0}
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           className={`flex items-center justify-center h-8 w-8 p-0 rounded-sm ${
//             editor.isActive("bold")
//               ? "bg-secondary text-secondary-foreground"
//               : "text-muted-foreground hover:bg-muted"
//           }`}
//         >
//           <Bold className="h-4 w-4" />
//         </div>
//         <div
//           role="button"
//           tabIndex={0}
//           onClick={() => {
//             const url = window.prompt("Enter image URL");
//             if (url) {
//               editor.chain().focus().setImage({ src: url }).run();
//             }
//           }}
//           className="flex items-center justify-center h-8 w-8 p-0 rounded-sm text-muted-foreground hover:bg-muted"
//         >
//           🖼️
//         </div>
//         <div
//           role="button"
//           tabIndex={0}
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           className={`flex items-center justify-center h-8 w-8 p-0 rounded-sm ${
//             editor.isActive("italic")
//               ? "bg-secondary text-secondary-foreground"
//               : "text-muted-foreground hover:bg-muted"
//           }`}
//         >
//           <Italic className="h-4 w-4" />
//         </div>
//         <div
//           role="button"
//           tabIndex={0}
//           onClick={() => editor.chain().focus().toggleUnderline().run()}
//           className={`flex items-center justify-center h-8 w-8 p-0 rounded-sm ${
//             editor.isActive("underline")
//               ? "bg-secondary text-secondary-foreground"
//               : "text-muted-foreground hover:bg-muted"
//           }`}
//         >
//           <UnderlineIcon className="h-4 w-4" />
//         </div>
//         <Separator orientation="vertical" className="h-6" />
//         <div
//           role="button"
//           tabIndex={0}
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           className={`flex items-center justify-center h-8 w-8 p-0 rounded-sm ${
//             editor.isActive("bulletList")
//               ? "bg-secondary text-secondary-foreground"
//               : "text-muted-foreground hover:bg-muted"
//           }`}
//         >
//           <List className="h-4 w-4" />
//         </div>
//         <div
//           role="button"
//           tabIndex={0}
//           onClick={() => editor.chain().focus().toggleOrderedList().run()}
//           className={`flex items-center justify-center h-8 w-8 p-0 rounded-sm ${
//             editor.isActive("orderedList")
//               ? "bg-secondary text-secondary-foreground"
//               : "text-muted-foreground hover:bg-muted"
//           }`}
//         >
//           <ListOrdered className="h-4 w-4" />
//         </div>
//         <Separator orientation="vertical" className="h-6" />
//         <Separator orientation="vertical" className="h-6" />
//         <div
//           role="button"
//           tabIndex={0}
//           onClick={() => editor.chain().focus().undo().run()}
//           aria-disabled={!editor.can().undo()}
//           className={`flex items-center justify-center h-8 w-8 p-0 rounded-sm ${
//             !editor.can().undo()
//               ? "opacity-50 cursor-not-allowed"
//               : "text-muted-foreground hover:bg-muted"
//           }`}
//         >
//           <Undo className="h-4 w-4" />
//         </div>
//         <div
//           role="button"
//           tabIndex={0}
//           onClick={() => editor.chain().focus().redo().run()}
//           aria-disabled={!editor.can().redo()}
//           className={`flex items-center justify-center h-8 w-8 p-0 rounded-sm ${
//             !editor.can().redo()
//               ? "opacity-50 cursor-not-allowed"
//               : "text-muted-foreground hover:bg-muted"
//           }`}
//         >
//           <Redo className="h-4 w-4" />
//         </div>
//       </div>

//       {/* Editor Content */}
//       <EditorContent
//         editor={editor}
//         className={`min-h-[100px] p-4 focus:outline-none prose prose-sm max-w-none ${editorClassName}`}
//         style={{ ...editorStyle, overflow: "hidden" }} // Important: hide scroll, let it grow
//       />
//     </div>
//   );
// }






import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { 
  Bold, 
  Italic, 
  UnderlineIcon, 
  List, 
  ListOrdered, 
  Image as ImageIcon,
  Undo,
  Redo
} from "lucide-react";
import { useRef } from "react";

export default function RichTextEditor({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg my-2",
        },
        inline: false,
        allowBase64: true,
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const addImage = () => {
    fileInputRef.current?.click();
  };

  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        editor.chain().focus().setImage({ src: result }).run();
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const addImageFromUrl = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className={`border rounded-lg bg-white ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      
      {/* Toolbar */}
      <div className="border-b p-3 flex flex-wrap gap-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center ${
            editor.isActive('bold') ? 'bg-blue-100' : ''
          }`}
        >
          <Bold className="h-4 w-4" />
        </div>
        
        <div
          role="button"
          tabIndex={0}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center ${
            editor.isActive('italic') ? 'bg-blue-100' : ''
          }`}
        >
          <Italic className="h-4 w-4" />
        </div>
        
        <div
          role="button"
          tabIndex={0}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center ${
            editor.isActive('underline') ? 'bg-blue-100' : ''
          }`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </div>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <div
          role="button"
          tabIndex={0}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center ${
            editor.isActive('bulletList') ? 'bg-blue-100' : ''
          }`}
        >
          <List className="h-4 w-4" />
        </div>
        
        <div
          role="button"
          tabIndex={0}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center ${
            editor.isActive('orderedList') ? 'bg-blue-100' : ''
          }`}
        >
          <ListOrdered className="h-4 w-4" />
        </div>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <div
          role="button"
          tabIndex={0}
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-100 flex items-center justify-center"
          title="Upload image"
        >
          <ImageIcon className="h-4 w-4" />
        </div>
        
        <div
          role="button"
          tabIndex={0}
          onClick={addImageFromUrl}
          className="px-3 py-2 rounded hover:bg-gray-100 text-sm flex items-center justify-center"
          title="Insert image from URL"
        >
          URL
        </div>
        
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        <div
          role="button"
          tabIndex={0}
          onClick={() => editor.chain().focus().undo().run()}
          aria-disabled={!editor.can().undo()}
          className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center ${
            !editor.can().undo() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Undo className="h-4 w-4" />
        </div>
        
        <div
          role="button"
          tabIndex={0}
          onClick={() => editor.chain().focus().redo().run()}
          aria-disabled={!editor.can().redo()}
          className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center ${
            !editor.can().redo() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Redo className="h-4 w-4" />
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="min-h-[200px] p-4 prose prose-sm max-w-none focus:outline-none"
      />
    </div>
  );
}














