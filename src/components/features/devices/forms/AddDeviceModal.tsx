'use client'

import { type FC, useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Tag, Smartphone, X, Cpu } from 'lucide-react'
import { Input, Button } from '@/components/ui'
import { toast } from 'sonner'
import { deviceService } from '@/services'
import nProgress from 'nprogress'

interface AddDeviceModalProps {
  isOpen: boolean
  onClose: () => void
  onRefresh: () => void
  device?: any // 1. Nhận thêm prop device (optional)
}

export const AddDeviceModal: FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
  device,
}) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ code: '', name: '' })

  // 2. Kiểm tra xem là chế độ Sửa hay Thêm
  const isEdit = !!device

  // 3. Tự động đổ dữ liệu khi mở Modal Edit
  useEffect(() => {
    if (device && isOpen) {
      setFormData({ code: device.code, name: device.name })
    } else if (!device && isOpen) {
      setFormData({ code: '', name: '' })
    }
  }, [device, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code.trim() || !formData.name.trim()) {
      return toast.error('Vui lòng nhập đầy đủ thông tin')
    }

    setLoading(true)
    nProgress.start()

    // 4. Chọn đúng Service tùy theo chế độ
    const promise = isEdit
      ? deviceService.updateDevice(device._id, formData) // Cần có hàm này trong service
      : deviceService.createDevice(formData)

    toast.promise(promise, {
      loading: isEdit
        ? 'Đang cập nhật thiết bị...'
        : 'Đang khởi tạo thiết bị mới...',
      success: () => {
        onRefresh()
        onClose()
        return isEdit
          ? `Đã cập nhật ${formData.name} ✨`
          : `Thiết bị ${formData.name} đã sẵn sàng ✨`
      },
      error: err =>
        err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
      finally: () => {
        setLoading(false)
        nProgress.done()
      },
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className='fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden'
        onClick={onClose}
      >
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='absolute inset-0 bg-slate-900/40 backdrop-blur-xl'
          onClick={onClose}
        />

        {/* MODAL CONTENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
          className='relative bg-white w-full max-w-lg rounded-[3rem] overflow-hidden'
        >
          {/* HEADER SECTION */}
          <div className='bg-slate-900 p-8 text-white relative overflow-hidden'>
            {/* Decorative Glow */}
            <div className='absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl' />

            <div className='relative z-10 flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20'>
                  <Plus size={24} strokeWidth={3} />
                </div>
                <div>
                  <h2 className='text-xl font-black uppercase tracking-tight'>
                    Thêm thiết bị
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className='w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors'
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* FORM SECTION */}
          <form onSubmit={handleSubmit} className='p-10 space-y-8'>
            <div className='space-y-6'>
              {/* Device Code Input */}
              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>
                  Mã định danh (ID)
                </label>
                <div className='relative group'>
                  <Tag
                    className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors'
                    size={18}
                  />
                  <Input
                    placeholder='VD: VG-P-102'
                    className='pl-14 h-14 rounded-full border bg-slate-50  font-mono font-bold text-slate-900 transition-all'
                    value={formData.code}
                    onChange={e =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Device Name Input */}
              <div className='space-y-2'>
                <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>
                  Tên thiết bị chuyên dụng
                </label>
                <div className='relative group'>
                  <Smartphone
                    className='absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors'
                    size={18}
                  />
                  <Input
                    placeholder='VD: Trạm đo đạc Leica TS16'
                    className='pl-14 h-14 rounded-full bg-slate-50 border font-bold text-slate-900 transition-all'
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className='flex gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onClose}
                className='flex-1 h-14 rounded-full font-bold border-slate-100 hover:bg-slate-50 transition-all'
              >
                Hủy bỏ
              </Button>
              <Button
                disabled={loading}
                className='flex-1 h-14 rounded-full text-white font-black uppercase tracking-wider shadow-xl shadow-slate-200 transition-all active:scale-95 disabled:opacity-50'
              >
                {loading ? (
                  <div className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    <span>Đang xử lý</span>
                  </div>
                ) : (
                  'Xác nhận'
                )}
              </Button>
            </div>
          </form>

          {/* Bottom Accent Line */}
          <div className='h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50' />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
