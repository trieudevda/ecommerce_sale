"use client"
import {EditorContent, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Toolbar from './Toolbar'

const TiptapFull = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
                link: false,
                underline: false,
            }),
            Underline,
            Image.configure({
                HTMLAttributes: { class: 'rounded-lg max-w-full shadow-md my-4' },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-blue-600 underline cursor-pointer' },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            Placeholder.configure({
                placeholder: 'Viết nội dung bài viết blog hoặc mô tả sản phẩm chuyên nghiệp tại đây...',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false,
    })

    return (
        <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 shadow-sm hover:shadow-md">
            <Toolbar editor={editor} />
            <div className="p-5 min-h-[400px]">
                <EditorContent
                    editor={editor}
                    className="prose prose-blue max-w-none focus:outline-none min-h-[400px]"
                />
            </div>
            <style jsx global>{`
                .tiptap p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .tiptap ul {
                    list-style-type: disc !important;
                    padding-left: 1.5rem !important;
                    margin: 1em 0 !important;
                }
                .tiptap ol {
                    list-style-type: decimal !important;
                    padding-left: 1.5rem !important;
                    margin: 1em 0 !important;
                }
                .tiptap li p {
                    margin: 0 !important;
                }
                .tiptap blockquote {
                    border-left: 4px solid #d1d5db;
                    padding-left: 1rem;
                    font-style: italic;
                    color: #4b5563;
                    background: #f9fafb;
                    padding: 1rem;
                    border-radius: 4px;
                }

                /* 4. Loại bỏ viền xanh mặc định của Browser */
                .tiptap:focus {
                    outline: none;
                }
            `}</style>
        </div>
    )
}

export default TiptapFull