'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
// Import dynamic để tránh lỗi SSR trong Next.js
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className='h-[300px] w-full bg-slate-50 animate-pulse rounded-2xl' />
  ),
})

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
}

const RichTextEditor = ({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) => {
  // Cấu hình đầy đủ các tính năng như Word
  const modules = {
    toolbar: [
      [{ font: [] }, { size: [] }], // Chọn font và kích cỡ chữ
      ['bold', 'italic', 'underline', 'strike'], // Định dạng chữ
      [{ color: [] }, { background: [] }], // Màu chữ, màu nền
      [{ script: 'sub' }, { script: 'super' }], // Chỉ số trên/dưới
      [{ header: [1, 2, 3, 4, 5, 6, false] }, 'blockquote', 'code-block'], // Header & Quote
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ], // Danh sách & Thụt lề
      [{ direction: 'rtl' }, { align: [] }], // Căn lề & Hướng chữ
      ['link', 'image', 'video', 'formula'], // Chèn link, ảnh, video, công thức toán
      ['clean'], // Xóa định dạng
    ],
  }

  const formats = [
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'header',
    'blockquote',
    'code-block',
    'indent',
    'list',
    'direction',
    'align',
    'link',
    'image',
    'video',
    'formula',
  ]

  return (
    <div className='rich-text-editor'>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className='bg-white'
      />

      {/* Tùy chỉnh CSS trực tiếp để "Word- hóa" giao diện */}
      <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          border-color: #e2e8f0;
          background-color: #f8fafc;
          padding: 12px;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
          border-color: #e2e8f0;
          min-height: 250px;
          font-size: 16px;
        }
        .rich-text-editor .ql-editor {
          min-height: 250px;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
