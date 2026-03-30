'use client'

import { memo, type RefObject } from 'react'
import { Camera, Image as ImageIcon } from 'lucide-react'
import ProjectImageItem from '@/components/features/project/components/ProjectImageItem'
import SectionTitle from './SectionTitle'

interface ProjectImage {
  id: string
  url: string
  file?: File
  isThumbnail: boolean
}

interface ProjectImageSectionProps {
  title?: string
  images: ProjectImage[]
  fileInputRef: any
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSelectThumbnail: (idx: number) => void
  onRemoveImage: (idx: number) => void
  multiple?: boolean
}

const ProjectImageSection = ({
  images,
  fileInputRef,
  onFileChange,
  onSelectThumbnail,
  onRemoveImage,
  title = 'Hình ảnh dự án',
  multiple = true,
}: ProjectImageSectionProps) => {
  return (
    <section>
      <SectionTitle icon={ImageIcon} title={title} />

      <div className='grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-6'>
        {/* Danh sách ảnh đã chọn/có sẵn */}
        {images.map((img, idx) => (
          <ProjectImageItem
            key={idx}
            img={img}
            idx={idx}
            onSelect={() => onSelectThumbnail(idx)}
            onRemove={() => onRemoveImage(idx)}
          />
        ))}

        {/* Input file ẩn */}
        <input
          type='file'
          multiple={multiple}
          hidden
          ref={fileInputRef}
          onChange={onFileChange}
          accept='image/*'
        />

        {/* Nút trigger chọn ảnh */}
        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          className='aspect-square rounded-[40px] cursor-pointer border-2 border-dashed flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-indigo-300 transition-all group'
        >
          <div className='w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors'>
            <Camera size={28} />
          </div>
          <span className='text-[10px] font-black uppercase tracking-widest'>
            Thêm hình ảnh
          </span>
        </button>
      </div>
    </section>
  )
}

export default memo(ProjectImageSection)
