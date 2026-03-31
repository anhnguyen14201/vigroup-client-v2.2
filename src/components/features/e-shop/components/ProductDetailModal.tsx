import { useState } from 'react' // Thêm useState
import { formatCurrency } from '@/utils'
import { importHistoryService } from '@/services'
import {
  History,
  X,
  Tag,
  Percent,
  Loader2,
  Package2,
  ShieldCheck,
  Trash2, // Thêm icon xóa
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePaginatedCollection } from '@/hooks'
import Image from 'next/image'
import { toast } from 'sonner'
import { ConfirmDeleteModal, Pagination } from '@/components/shared'

const ProductDetailModal = ({ product, isOpen, onClose, activeLang }: any) => {
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Hook lấy dữ liệu có phân trang
  const {
    items: history,
    isLoading: isHistoryLoading,
    totalItems,
    totalPages,
    mutate, // Dùng để refresh dữ liệu sau khi xóa
  } = usePaginatedCollection(
    isOpen ? `import-history-${product?._id}-${page}` : null,
    { productId: product?._id },
    importHistoryService.getImportHistory,
    page,
    5, // Số lượng record mỗi trang (ví dụ 5 cho gọn)
  )

  const translation =
    product?.translations?.find(
      (t: any) => t.language === activeLang || t.language?._id === activeLang,
    ) || product?.translations?.[0]

  // Hàm xử lý xóa
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      await importHistoryService.deleteImportRecord(deleteTarget._id)
      toast.success('Đã xóa lịch sử nhập hàng thành công')
      mutate() // Refresh lại danh sách
      setDeleteTarget(null)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <AnimatePresence>
        <div
          onClick={onClose}
          className='fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md cursor-pointer'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            onClick={e => e.stopPropagation()}
            className='bg-white w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] cursor-default'
          >
            {/* Header */}
            <div className='px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100'>
                  <Package2 size={24} />
                </div>
                <div>
                  <h2 className='text-xl font-black text-slate-800 tracking-tight'>
                    Quản lý chi tiết mặt hàng
                  </h2>
                  <div className='flex items-center gap-2'>
                    <span className='px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase'>
                      SKU: {product?.code}
                    </span>
                    <span className='w-1 h-1 rounded-full bg-slate-300'></span>
                    <span className='text-[10px] font-bold text-indigo-500 uppercase'>
                      Đơn vị: {product?.unit}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className='p-3 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all text-slate-400'
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Content */}
            <div className='flex-1 overflow-hidden flex flex-col md:flex-row'>
              {/* LEFT COLUMN */}
              <div className='w-full md:w-[380px] border-r border-slate-50 p-8 space-y-6 overflow-y-auto no-scrollbar bg-slate-50/30'>
                <div className='relative w-full aspect-square bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group'>
                  <Image
                    src={product?.thumbnailUrls?.[0] || '/placeholder.png'}
                    alt={translation?.productName}
                    fill
                    className='object-contain p-4 group-hover:scale-105 transition-transform duration-500'
                  />
                </div>
                <h1 className='text-xl font-black text-slate-800 leading-snug'>
                  {translation?.productName}
                </h1>

                <div className='space-y-3'>
                  <div className='p-5 rounded-3xl bg-white border border-slate-100 shadow-sm'>
                    <div className='flex justify-between items-center mb-2'>
                      <span className='text-[10px] font-black text-slate-400 uppercase'>
                        Giá bán niêm yết
                      </span>
                      <Tag size={14} className='text-slate-400' />
                    </div>
                    <p className='text-2xl font-black text-indigo-600'>
                      {formatCurrency(product?.price)}
                    </p>
                  </div>
                </div>

                <div className='pt-4'>
                  <div className='flex items-center gap-2 text-emerald-500 font-bold text-xs'>
                    <ShieldCheck size={16} /> Sản phẩm đang kinh doanh
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: History & Inventory */}
              <div className='flex-1 p-8 overflow-y-auto no-scrollbar space-y-8 flex flex-col'>
                {/* Stats Row */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='p-5 rounded-[28px] bg-slate-900 text-white'>
                    <p className='text-[10px] font-bold uppercase text-slate-400 mb-1'>
                      Tồn kho hiện tại
                    </p>
                    <p className='text-3xl font-black'>
                      {product?.quantity}{' '}
                      <span className='text-sm font-medium text-slate-500'>
                        {product?.unit}
                      </span>
                    </p>
                  </div>
                  <div className='p-5 rounded-[28px] bg-amber-50 border border-amber-100'>
                    <p className='text-[10px] font-bold uppercase text-amber-500 mb-1'>
                      Giá nhập gần nhất
                    </p>
                    <p className='text-3xl font-black text-amber-700'>
                      {formatCurrency(product?.cost || 0)}
                    </p>
                  </div>
                </div>

                {/* History Table */}
                <div className='space-y-4 flex-1'>
                  <div className='flex items-center gap-2'>
                    <History className='text-indigo-600' size={20} />
                    <h3 className='font-black text-slate-800 uppercase tracking-tight'>
                      Nhật ký nhập hàng
                    </h3>
                  </div>

                  <div className='rounded-3xl border overflow-hidden bg-white'>
                    <table className='w-full text-left border-collapse'>
                      <thead>
                        <tr className='bg-slate-50'>
                          <th className='px-6 py-4 text-[10px] font-black text-slate-500 uppercase'>
                            Ngày
                          </th>
                          <th className='px-6 py-4 text-[10px] font-black text-slate-500 uppercase text-right'>
                            SL
                          </th>
                          <th className='px-6 py-4 text-[10px] font-black text-slate-500 uppercase text-right'>
                            Giá nhập
                          </th>
                          <th className='px-6 py-4 text-[10px] font-black text-slate-500 uppercase text-right'>
                            Giá bán
                          </th>
                          <th className='px-6 py-4 text-[10px] font-black text-slate-500 uppercase text-right'>
                            Hạ giá
                          </th>
                          <th className='px-6 py-4 text-[10px] font-black text-slate-500 uppercase text-right'>
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-slate-50'>
                        {isHistoryLoading ? (
                          <tr>
                            <td colSpan={4} className='py-20 text-center'>
                              <Loader2
                                className='animate-spin mx-auto text-indigo-500'
                                size={32}
                              />
                            </td>
                          </tr>
                        ) : history?.length > 0 ? (
                          history.map((item: any) => (
                            <tr
                              key={item._id}
                              className='hover:bg-indigo-50/30 transition-colors'
                            >
                              <td className='px-6 py-4 text-sm font-bold text-slate-700'>
                                {new Date(item.importDate).toLocaleDateString(
                                  'vi-VN',
                                )}
                              </td>
                              <td className='px-6 py-4 text-right font-black text-indigo-600 text-sm'>
                                +{item.quantityImported}
                              </td>
                              <td className='px-6 py-4 text-right font-mono text-sm font-medium text-slate-600'>
                                {formatCurrency(item.importPrice)}
                              </td>
                              <td className='px-6 py-4 text-right font-mono text-sm font-medium text-slate-600'>
                                {formatCurrency(item.salePrice)}
                              </td>
                              <td className='px-6 py-4 text-right font-mono text-sm font-medium text-slate-600'>
                                {formatCurrency(item.saleDiscount || 0)}
                              </td>
                              <td className='px-6 py-4 text-right'>
                                <button
                                  onClick={() => setDeleteTarget(item)}
                                  className='p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all'
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className='py-20 text-center text-slate-400 italic'
                            >
                              Chưa có lịch sử nhập.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination Section */}
                <div className='pt-4 border-t border-slate-100'>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages || 1}
                    onPageChange={p => setPage(p)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Modal xác nhận xóa */}
      <ConfirmDeleteModal
        open={!!deleteTarget}
        onOpenChange={open => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title='Xóa lịch sử nhập?'
        description={`Bạn có chắc chắn muốn xóa bản ghi nhập ngày ${deleteTarget ? new Date(deleteTarget.importDate).toLocaleDateString('vi-VN') : ''}? Hành động này có thể ảnh hưởng đến báo cáo tồn kho.`}
        loading={isDeleting}
      />
    </>
  )
}

export default ProductDetailModal
