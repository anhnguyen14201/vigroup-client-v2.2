'use client'

import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new')
    // Quill 2.0+ đã tích hợp sẵn Table module,
    // chúng ta chỉ cần khai báo trong modules là dùng được.
    return RQ
  },
  {
    ssr: false,
    loading: () => (
      <div className='h-[300px] w-full bg-slate-50 animate-pulse rounded-2xl' />
    ),
  },
)

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
  const editorRef = useRef<any>(null)

  const handleWrapperClick = () => {
    // Khi click vào vùng bao ngoài, gọi hàm focus của instance editor
    if (editorRef.current) {
      editorRef.current.focus()
      // Hoặc với TipTap: editor.chain().focus().run()
    }
  }

  const modules = {
    // Kích hoạt table module
    table: true,
    toolbar: [
      [{ font: [] }, { size: [] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }, 'blockquote', 'code-block'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      [{ align: [] }],
      ['link', 'image', 'video'],
      // Thêm nút Table vào thanh công cụ
      ['table'],
      ['clean'],
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
    'align',
    'link',
    'image',
    'video',
    'formula',
    'table', // Cực kỳ quan trọng: phải khai báo format table
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

      <style jsx global>{`
        /* Bo góc cho editor */
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
          min-height: 250px; /* Chiều cao tối thiểu của khung */
          font-size: 16px;
          display: flex; /* Thêm dòng này */
          flex-direction: column; /* Thêm dòng này */
        }

        .rich-text-editor .ql-editor {
          flex: 1; /* Ép vùng soạn thảo chiếm toàn bộ diện tích còn lại của container */
          min-height: 250px; /* Đảm bảo bằng với container */
          cursor: text; /* Hiển thị con trỏ dạng text để user biết là click được */
        }

        /* CSS cho Table để hiển thị đường kẻ (Quill mặc định không hiện viền rõ) */
        .rich-text-editor .ql-editor table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        .rich-text-editor .ql-editor table td {
          border: 1px solid #cbd5e1;
          padding: 4px 8px;
          min-width: 20px;
        }

        /* Hiển thị tooltip/menu khi click vào bảng */
        .ql-table-setup {
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
