"use client"
import { Editor } from '@tiptap/react'
import { Button, Tooltip, Divider, Space } from 'antd'
import {
    BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined,
    UnorderedListOutlined, OrderedListOutlined, BlockOutlined,
    UndoOutlined, RedoOutlined, PictureOutlined,
    LinkOutlined, DisconnectOutlined, AlignLeftOutlined,
    AlignCenterOutlined, AlignRightOutlined, LineHeightOutlined,
    CodeOutlined, ClearOutlined
} from '@ant-design/icons'
import ImageUpload from "@/components/upload/ImageUpload";

// Component helper để tạo nút bấm đồng bộ
const ToolbarButton = ({
                           editor,
                           icon,
                           title,
                           action,
                           isActive = false,
                           disabled = false
                       }: any) => (
    <Tooltip title={title} mouseEnterDelay={0.5}>
        <Button
            type={isActive ? "primary" : "text"} // Sử dụng kiểu nút Antd
            icon={icon}
            onClick={action}
            disabled={disabled}
            className={`flex items-center justify-center ${isActive ? '' : 'text-gray-600'}`}
            style={{ width: 32, height: 32 }} // Kích thước chuẩn nút toolbar
        />
    </Tooltip>
)

const Toolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) return null

    const addImage = () => {
        const url = window.prompt('Nhập URL hình ảnh:')
        if (url) editor.chain().focus().setImage({ src: url }).run()
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL liên kết:', previousUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <div className="sticky top-0 z-10 p-1.5 border-b bg-gray-50/90 backdrop-blur-sm rounded-t-lg flex flex-wrap gap-1 items-center shadow-inner">
            <Space.Compact block={false} className="bg-white rounded-md p-0.5 shadow-sm border">
                <ToolbarButton editor={editor} icon={<UndoOutlined />} title="Hoàn tác (Ctrl+Z)" action={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
                <ToolbarButton editor={editor} icon={<RedoOutlined />} title="Làm lại (Ctrl+Y)" action={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />

                <Divider vertical className="h-6 self-center" />

                <ToolbarButton editor={editor} icon={<BoldOutlined />} title="In đậm (Ctrl+B)" action={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} />
                <ToolbarButton editor={editor} icon={<ItalicOutlined />} title="In nghiêng (Ctrl+I)" action={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} />
                <ToolbarButton editor={editor} icon={<UnderlineOutlined />} title="Gạch chân (Ctrl+U)" action={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} />
                <ToolbarButton editor={editor} icon={<StrikethroughOutlined />} title="Gạch ngang" action={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} />
                <ToolbarButton editor={editor} icon={<CodeOutlined />} title="Code Inline" action={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')} />

                <Divider vertical className="h-6 self-center" />

                <ToolbarButton editor={editor} icon={<span className="font-bold text-xs">H1</span>} title="Tiêu đề 1" action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} />
                <ToolbarButton editor={editor} icon={<span className="font-bold text-xs">H2</span>} title="Tiêu đề 2" action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} />

                <Divider vertical className="h-6 self-center" />

                <ToolbarButton editor={editor} icon={<AlignLeftOutlined />} title="Căn trái" action={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} />
                <ToolbarButton editor={editor} icon={<AlignCenterOutlined />} title="Căn giữa" action={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} />
                <ToolbarButton editor={editor} icon={<AlignRightOutlined />} title="Căn phải" action={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} />

                <Divider vertical className="h-6 self-center" />

                <ToolbarButton editor={editor} icon={<UnorderedListOutlined />} title="Danh sách chấm" action={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} />
                <ToolbarButton editor={editor} icon={<OrderedListOutlined />} title="Danh sách số" action={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} />
                <ToolbarButton editor={editor} icon={<BlockOutlined />} title="Trích dẫn" action={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} />

                <Divider vertical className="h-6 self-center" />

                <ImageUpload editor={editor} />
                <ToolbarButton editor={editor} icon={<LinkOutlined />} title="Chèn link" action={setLink} isActive={editor.isActive('link')} />
                <ToolbarButton editor={editor} icon={<DisconnectOutlined />} title="Bỏ link" action={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} />
                <ToolbarButton editor={editor} icon={<PictureOutlined />} title="Chèn ảnh" action={addImage} />

                <Divider vertical className="h-6 self-center" />

                <ToolbarButton editor={editor} icon={<ClearOutlined />} title="Xóa định dạng" action={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} />
            </Space.Compact>
        </div>
    )
}

export default Toolbar