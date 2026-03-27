'use client'

import { motion } from 'framer-motion'
import {
  MapPin,
  Calendar,
  User2,
  Eye,
  EyeOff,
  CheckCircle2,
  Pencil,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { getPaymentStatus, getStatusConfig } from '@/constants'
import { useProjectContext } from '@/components/features/project/hooks/ProjectManagementContext'
import { formatDateCzech } from '@/utils'

const ProjectCard = () => {
  const {
    activeLangCode,
    projectsData,
    handleEditProject,
    handleDeleteProject,
    handleOpenDetail,
  } = useProjectContext()
  // 1. Logic Trạng thái thanh toán (LÊN TRÊN)

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 '>
      {projectsData.map((project: any, index: any) => {
        const translation =
          project.translations?.find(
            (t: any) =>
              t.language.code === activeLangCode ||
              t.language === activeLangCode,
          ) || project.translations?.[0]

        const paymentStyle = getPaymentStatus(project.paymentStatus)
        const statusConfig = getStatusConfig(project.status)
        return (
          <motion.div
            key={project?.employeeId || project?._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleOpenDetail?.(project)}
          >
            <div
              className='group relative bg-white rounded-4xl border cursor-pointer duration-500
                    p-5 hover:border-primary transition-all'
            >
              {/* Thumbnail Area */}
              <div
                className='relative aspect-16/10 rounded-3xl overflow-hidden mb-5 
                        bg-slate-100 shadow-inner group'
              >
                {/* Image with Next.js optimization if possible, or refined img tag */}
                <div className='relative w-full h-full overflow-hidden'>
                  {' '}
                  {/* Thẻ cha phải có relative */}
                  <Image
                    src={
                      project.thumbnailUrls?.[0] || '/placeholder-project.jpg'
                    }
                    alt={translation?.projectName || 'Project thumbnail'}
                    fill // Tự động lấp đầy thẻ cha
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' // Tối ưu việc load size ảnh theo màn hình
                    priority={false} // Nếu là ảnh đầu trang thì để true, còn lại để false để lazy load
                    className='object-cover transition-transform duration-1000 
                   ease-out group-hover:scale-110'
                  />
                </div>

                {/* Top Left: Dynamic Floating Badges */}
                <div className='absolute top-4 left-4 flex flex-col gap-1 items-start'>
                  {/* 1. Payment Status - Co giãn theo text */}
                  <div
                    className={`w-fit flex items-center gap-2 px-2 py-1 rounded-full text-[9px] 
                            font-bold uppercase border backdrop-blur-xl 
                            transition-all duration-500 ${paymentStyle.color}`}
                  >
                    {paymentStyle.label}
                  </div>

                  {/* 2. Operation Status - Co giãn theo text */}
                  <div
                    className={`w-fit flex items-center gap-2 px-2 py-1 rounded-full text-[9px] 
                            font-bold uppercase border backdrop-blur-lg 
                            transition-all duration-500 ${statusConfig.style}`}
                  >
                    {statusConfig.label}
                  </div>

                  <div
                    className={`flex items-center gap-2 px-2 py-1 rounded-2xl backdrop-blur-md 
                            border transition-all ${
                              project.showProject
                                ? 'bg-white/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-white/10 text-rose-400 border-rose-500/20'
                            }`}
                  >
                    {project.showProject ? (
                      <Eye size={14} strokeWidth={2.5} />
                    ) : (
                      <EyeOff size={14} strokeWidth={2.5} />
                    )}
                    <span className='text-[9px] font-bold uppercase tracking-tighter'>
                      {project.showProject ? 'hiện' : 'ẩn'}
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay: Visibility & Action */}
                <div
                  className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                        transition-all duration-300 backdrop-blur-[2px] flex items-center 
                        justify-center gap-3'
                >
                  {/* Nút Sửa */}
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleEditProject?.(project)
                    }}
                    className='w-11 h-11 bg-white/20 backdrop-blur-md text-white rounded-full 
                            flex items-center justify-center hover:bg-emerald-600 transition-all 
                            transform scale-90 group-hover:scale-100 shadow-xl border 
                            border-white/20 cursor-pointer'
                  >
                    <Pencil size={18} strokeWidth={2.5} />
                  </button>

                  {/* Nút Xóa */}
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteProject?.(project)
                    }}
                    className='w-11 h-11 bg-white/20 backdrop-blur-md text-white rounded-full 
                            flex items-center justify-center hover:bg-rose-600 transition-all 
                            transform scale-90 group-hover:scale-100 shadow-xl border 
                            border-white/20 cursor-pointer'
                  >
                    <Trash2 size={18} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Thêm vào ngay dưới thẻ Thumbnail Area hoặc Info Section */}
              <div className='absolute top-4 right-4 md:hidden flex gap-2'>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleEditProject?.(project)
                  }}
                  className='p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-slate-200 text-slate-600'
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleDeleteProject?.(project)
                  }}
                  className='p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm border border-slate-200 text-red-500'
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Project Info Section */}
              <div className='space-y-2'>
                <div className='flex flex-col gap-1'>
                  <div className='flex items-center gap-2'>
                    <span className='text-[10px] font-black text-primary uppercase tracking-widest'>
                      {project.code || 'NO-CODE'}
                    </span>
                    <span className='w-1.5 h-1.5 rounded-full bg-slate-200' />
                    <span className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>
                      {translation?.buildingType || 'Project'}
                    </span>
                  </div>
                  <h3
                    className='text-sm font-bold text-slate-900 line-clamp-1 
                          group-hover:text-primary transition-colors leading-tight'
                  >
                    {translation?.projectName || 'Chưa cập nhật tên'}
                  </h3>
                </div>

                {/* Timeline Grid */}
                <div
                  className='grid grid-cols-2 gap-0 border border-slate-100 rounded-2xl 
                        overflow-hidden bg-slate-50/30'
                >
                  <div className='px-3 py-2 border-r border-slate-100 flex flex-col gap-1'>
                    <span className='text-[8px] font-black text-slate-400 uppercase tracking-tighter'>
                      Ngày bắt đầu
                    </span>
                    <div className='flex items-center gap-1.5 text-slate-700'>
                      <Calendar size={12} className='text-indigo-400' />
                      <span className='text-[11px] font-bold'>
                        {project.startDate
                          ? formatDateCzech(project.startDate)
                          : '--/--/----'}
                      </span>
                    </div>
                  </div>
                  <div className='px-3 py-2 flex flex-col gap-1'>
                    <span className='text-[8px] font-black text-slate-400 uppercase tracking-tighter'>
                      Ngày bàn giao
                    </span>
                    <div className='flex items-center gap-1.5 text-slate-700'>
                      <CheckCircle2
                        size={12}
                        className={
                          project.endDate
                            ? 'text-emerald-400'
                            : 'text-slate-300'
                        }
                      />
                      <span className='text-[11px] font-bold'>
                        {project.endDate
                          ? formatDateCzech(project.endDate)
                          : '--/--/----'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address & Team Section */}
                <div className='space-y-1'>
                  {/* Full Address */}
                  <div className='flex items-start gap-2 text-slate-500 px-1'>
                    <MapPin
                      size={14}
                      className='shrink-0 mt-0.5 text-slate-400'
                    />
                    <p className='text-[11px] font-medium leading-relaxed line-clamp-2'>
                      {project.location || 'Chưa cập nhật địa chỉ công trình'}
                    </p>
                  </div>

                  {/* Employee Count */}
                  <div
                    className='flex items-center justify-between bg-slate-50 px-2.5 py-1
                          rounded-full border border-slate-100/50'
                  >
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-6 h-6 rounded-full bg-white flex items-center justify-center
                              text-primary border border-slate-100'
                      >
                        <User2 size={12} />
                      </div>
                      <span className='text-[10px] font-bold text-slate-600'>
                        {project.employees?.length || 0} nhân sự phụ trách
                      </span>
                    </div>

                    {/* Participant indicator nếu cần */}
                    <div className='flex -space-x-1.5'>
                      {[1, 2, 3]
                        .slice(0, project.employees?.length)
                        .map((_, i) => (
                          <div
                            key={i}
                            className='w-5 h-5 rounded-full border border-white bg-slate-200'
                          />
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ProjectCard
