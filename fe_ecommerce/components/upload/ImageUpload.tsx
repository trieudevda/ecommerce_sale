"use client"
import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { Modal, Upload, message, Button, Tooltip } from 'antd';
import { InboxOutlined, PictureOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;

const ImageUpload = ({ editor }: { editor: Editor | null }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!editor) return null;

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        action:  process.env.NEXT_PUBLIC_API_URL+'images/upload',
        withCredentials: true,
        showUploadList: false,
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
            if (!isJpgOrPng) {
                message.error('Bạn chỉ có thể tải lên tệp JPG/PNG/WEBP!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Hình ảnh phải nhỏ hơn 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'uploading') {
                setLoading(true);
                return;
            }
            if (status === 'done') {
                setLoading(false);
                // Lấy URL trả về từ server của bạn
                const url = info.file.response?.url;
                if (url) {
                    editor.chain().focus().setImage({ src: url }).run();
                    setIsModalOpen(false);
                    message.success('Tải ảnh lên thành công!');
                }
            } else if (status === 'error') {
                setLoading(false);
                message.error('Tải ảnh lên thất bại.');
            }
        },
    };

    return (
        <>
            <Tooltip title="Chèn hình ảnh">
                <Button
                    type="text"
                    icon={<PictureOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center"
                    style={{ width: 32, height: 32 }}
                />
            </Tooltip>

            <Modal
                title="Tải lên hình ảnh"
                open={isModalOpen}
                onCancel={() => !loading && setIsModalOpen(false)}
                footer={null}
                centered
                destroyOnClose
            >
                <Dragger {...uploadProps} disabled={loading}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: '#1677ff' }} />
                    </p>
                    <p className="ant-upload-text">Nhấp hoặc kéo thả ảnh vào đây</p>
                    <p className="ant-upload-hint">
                        Hỗ trợ ảnh đơn lẻ, dung lượng dưới 2MB.
                    </p>
                </Dragger>
            </Modal>
        </>
    );
};

export default ImageUpload;