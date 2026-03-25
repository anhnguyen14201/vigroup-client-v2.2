import { X } from 'lucide-react'
import Image from 'next/image'
import { memo } from 'react'
interface ProjectImage {
  id: string
  url: string
  file?: File
  isThumbnail: boolean
}

const ProjectImageItem = memo(
  ({
    img,
    idx,
    onSelect,
    onRemove,
  }: {
    img: ProjectImage
    idx: number
    onSelect: () => void
    onRemove: () => void
  }) => {
    return (
      <div
        onClick={onSelect}
        className={`relative aspect-square rounded-4xl overflow-hidden group border-2 cursor-pointer transition-all duration-300 ${
          img.isThumbnail
            ? 'border-primary'
            : 'border-transparent hover:border-slate-300'
        }`}
      >
        <Image
          src={img.url}
          alt={`Project image ${idx + 1}`}
          fill
          className='object-contain transition-transform duration-700 group-hover:scale-110'
          sizes='(max-width: 768px) 50vw, 33vw'
        />

        <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center'>
          <button
            onClick={e => {
              e.stopPropagation()
              onRemove()
            }}
            className='w-10 h-10 bg-white/20 cursor-pointer backdrop-blur-md hover:bg-rose-500 rounded-full text-white flex items-center justify-center transition-all transform hover:scale-110 border border-white/30 shadow-2xl'
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {img.isThumbnail && (
          <div className='absolute top-2 left-2 px-3 py-1.5 bg-primary rounded-full flex items-center gap-2'>
            <p className='text-[8px] font-black text-white uppercase'>
              Ảnh nền
            </p>
          </div>
        )}
      </div>
    )
  },
)
export default ProjectImageItem
