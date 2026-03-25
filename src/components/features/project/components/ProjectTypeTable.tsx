'use client'
import { useProjectContext } from '@/components/features/project/hooks/ProjectManagementContext'
import { ConfirmDeleteModal } from '@/components/shared'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Globe } from 'lucide-react'

const ProjectTypeTable = () => {
  // Mặc định chọn ngôn ngữ đầu tiên hoặc 'vi'
  const {
    handleEditCategory,
    setIsDeleteModalTypeOpen,
    projectTypeData,
    activeLangCode,
    setDeleteId,
  } = useProjectContext()

  return (
    <div className='flex flex-col gap-4 animate-in fade-in duration-500'>
      {/* --- Danh sách Grid --- */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {projectTypeData?.map((type: any, index: any) => {
          // Tìm bản dịch tương ứng với ngôn ngữ đang chọn
          const translation = type.translations.find(
            (t: any) => t.language.code === activeLangCode,
          )

          return (
            <motion.div
              key={type?.employeeId || type?._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {' '}
              <div
                key={type._id}
                className='group relative p-5 cursor-pointer bg-white rounded-3xl border transition-all hover:border-primary/20'
              >
                <div className='flex justify-between items-start mb-3'>
                  <div className='flex items-center gap-2'>
                    <div className='p-2 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors'>
                      <Globe className='w-4 h-4 text-slate-400 group-hover:text-primary' />
                    </div>
                    <h3 className='font-bold text-primary tracking-tight'>
                      {translation?.name || 'Chưa có tên'}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div className='flex gap-1  opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button
                      onClick={() => handleEditCategory(type)}
                      className='p-2 cursor-pointer hover:bg-slate-100 rounded-full text-slate-400 hover:text-emerald-600 transition-colors'
                    >
                      <Edit2 className='w-4 h-4' />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(type._id) // Lưu ID vào state riêng
                        setIsDeleteModalTypeOpen(true) // Chỉ truyền true để mở modal
                      }}
                      className='p-2 cursor-pointer hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors'
                    >
                      <Trash2 className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                <p className='text-xs text-slate-500 leading-relaxed italic'>
                  {translation?.metaDescription ||
                    'Không có mô tả cho ngôn ngữ này.'}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {projectTypeData?.length === 0 && (
        <div className='text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200'>
          <p className='text-sm text-slate-400'>
            Chưa có loại dự án nào được tạo.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectTypeTable
