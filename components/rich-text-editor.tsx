'use client'

import ImageExtension from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Undo,
  Upload as UploadIcon,
} from 'lucide-react'
import React from 'react'

import useUploadImages from '@/hooks/use-upload-images'
import { cn } from '@/lib/utils'

type RichTextEditorProps = {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Viết nội dung...',
  className,
}: RichTextEditorProps) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const { uploadImagesMutation } = useUploadImages()

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      Placeholder.configure({
        placeholder: placeholder,
      }),
    ],
    immediatelyRender: false,
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-[200px] focus:outline-hidden p-4 max-w-none text-sm leading-relaxed text-foreground',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  // Sync value from parent
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  // Prevent scroll when fullscreen is active
  React.useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  if (!editor) {
    return null
  }

  // Handle uploading local image files
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('files', file)
      try {
        const res = await uploadImagesMutation.mutateAsync(formData)
        const url = res.payload.data[0].url
        if (url) {
          editor.chain().focus().setImage({ src: url }).run()
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  // Handle setting image URL
  const handleImageUrlPrompt = () => {
    const url = window.prompt('Nhập URL hình ảnh:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div
      className={cn(
        'relative w-full',
        isFullscreen && 'is-fullscreen',
        isFullscreen ? 'fixed inset-0 z-9999 bg-background flex flex-col p-4 md:p-6 overflow-hidden' : className,
      )}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .ProseMirror {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .is-fullscreen .ProseMirror {
          min-height: calc(100vh - 160px);
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 800;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid var(--primary, #10b981);
          padding-left: 1rem;
          font-style: italic;
          color: #6b7280;
          margin: 1rem 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .ProseMirror hr {
          border: 0;
          border-top: 1px solid var(--border);
          margin: 1.5rem 0;
        }
      `,
        }}
      />

      <div
        className={cn(
          'rounded-xl border border-border bg-card shadow-xs overflow-hidden flex flex-col',
          isFullscreen && 'w-full h-full rounded-none border-0 shadow-none',
        )}
      >
        {/* Toolbar Header */}
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-muted/40 border-b border-border">
          {/* Format Group */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground',
              editor.isActive('bold') && 'bg-primary/10 text-primary hover:bg-primary/20',
            )}
            title="In đậm (Bold)"
          >
            <Bold size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground',
              editor.isActive('italic') && 'bg-primary/10 text-primary hover:bg-primary/20',
            )}
            title="In nghiêng (Italic)"
          >
            <Italic size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              'p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground',
              editor.isActive('strike') && 'bg-primary/10 text-primary hover:bg-primary/20',
            )}
            title="Gạch ngang (Strikethrough)"
          >
            <Strikethrough size={16} />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Heading Group */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              'p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground',
              editor.isActive('heading', { level: 1 }) && 'bg-primary/10 text-primary hover:bg-primary/20',
            )}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              'p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground',
              editor.isActive('heading', { level: 2 }) && 'bg-primary/10 text-primary hover:bg-primary/20',
            )}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              'p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground',
              editor.isActive('heading', { level: 3 }) && 'bg-primary/10 text-primary hover:bg-primary/20',
            )}
            title="Heading 3"
          >
            <Heading3 size={16} />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* List Group */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              'p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground',
              editor.isActive('bulletList') && 'bg-primary/10 text-primary hover:bg-primary/20',
            )}
            title="Danh sách dấu chấm"
          >
            <List size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              'p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground',
              editor.isActive('orderedList') && 'bg-primary/10 text-primary hover:bg-primary/20',
            )}
            title="Danh sách số"
          >
            <ListOrdered size={16} />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Structure Group */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              'p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground',
              editor.isActive('blockquote') && 'bg-primary/10 text-primary hover:bg-primary/20',
            )}
            title="Trích dẫn"
          >
            <Quote size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground"
            title="Đường kẻ ngang"
          >
            <Minus size={16} />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Image Group */}
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <button
            type="button"
            disabled={uploadImagesMutation.isPending}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            title="Tải ảnh từ thiết bị"
          >
            {uploadImagesMutation.isPending ? (
              <span className="animate-spin border-2 border-primary border-t-transparent rounded-full size-4 inline-block" />
            ) : (
              <UploadIcon size={16} />
            )}
          </button>

          <button
            type="button"
            onClick={handleImageUrlPrompt}
            className="p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground"
            title="Chèn ảnh từ URL"
          >
            <ImageIcon size={16} />
          </button>

          <div className="w-px h-5 bg-border mx-1 ml-auto" />

          {/* History Group */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            title="Hoàn tác (Undo)"
          >
            <Undo size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            title="Làm lại (Redo)"
          >
            <Redo size={16} />
          </button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Zoom/Fullscreen Group */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={cn(
              'p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground',
              isFullscreen && 'bg-primary/10 text-primary hover:bg-primary/20',
            )}
            title={isFullscreen ? 'Thu nhỏ (Minimize)' : 'Phóng to & Xem trước (Fullscreen)'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Editor & Preview Area */}
        <div
          className={cn(
            'bg-background',
            isFullscreen
              ? 'flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border overflow-hidden'
              : '',
          )}
        >
          {/* Editor Input Column */}
          <div className={cn('overflow-y-auto', isFullscreen ? 'h-full p-2 bg-background' : '')}>
            <EditorContent editor={editor} />
          </div>

          {/* Live Preview Column (Only in Fullscreen) */}
          {isFullscreen && (
            <div className="h-full overflow-y-auto p-6 bg-muted/10">
              <div className="flex items-center justify-between mb-4 border-b border-border/60 pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Xem trước nội dung (Live Preview)
                </span>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  Đồng bộ tự động
                </span>
              </div>
              <div
                className="ProseMirror text-sm leading-relaxed text-foreground"
                dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export type { RichTextEditorProps }
