'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  PackageOpen,
  X,
  Save,
  Plus,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import nProgress from 'nprogress'
import { Input, Label } from '@/components/ui'
import Image from 'next/image'

interface ImportProductModalProps {
  onClose: () => void
  products: any[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeLang: string
  getTranslation: (item: any, lang: string) => any
  onOpenCreate: (sku: string) => void
  onSuccess?: () => void
}

const ImportProductModal = ({
  onClose,
  products,
  searchQuery,
  setSearchQuery,
  activeLang,
  getTranslation,
  onOpenCreate,
  onSuccess,
}: ImportProductModalProps) => {
  // Local state để quản lý input riêng trước khi đẩy lên Global Search
  const [localSku, setLocalSku] = useState(searchQuery || '')
  const [hasSearched, setHasSearched] = useState(false)

  const [formData, setFormData] = useState({
    importPrice: 0,
    salePrice: 0,
    discountPrice: 0,
    quantity: 1,
    importDate: new Date().toISOString().split('T')[0],
  })

  // Tìm sản phẩm dựa trên danh sách products đã được filter bởi searchQuery ở trang cha
  // Ưu tiên tìm chính xác SKU
  // Tìm sản phẩm dựa trên trường "code" thay vì "sku"
  const foundProduct = products.find(
    p => p.code?.toLowerCase() === searchQuery.toLowerCase().trim(),
  )
  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setHasSearched(true)
    toast.info(`Đang kiểm tra mã: ${searchQuery}`)
  }

  console.log(foundProduct)

  // Tự động điền giá nếu tìm thấy sản phẩm
  useEffect(() => {
    if (foundProduct) {
      setFormData(prev => ({
        ...prev,
        // CHỈNH SỬA: Map đúng trường giá từ JSON (ở đây JSON của bạn dùng 'price' và 'effectivePrice')
        importPrice: foundProduct.cost || 0,
        salePrice: foundProduct.price || 0,
        discountPrice: foundProduct.discount || 0,
      }))
    }
  }, [foundProduct])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    nProgress.start()
    try {
      // Logic gọi API của bạn ở đây
      toast.success('Nhập kho thành công!')
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error('Lỗi khi lưu thông tin')
    } finally {
      nProgress.done()
    }
  }

  console.log(products)

  const profit = formData.salePrice - formData.importPrice
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4'
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className='bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden'
      >
        <div className='px-8 py-5 border-b flex justify-between items-center bg-slate-50'>
          <div className='flex items-center gap-3'>
            <PackageOpen className='text-emerald-600' size={24} />
            <h3 className='font-bold text-slate-900 text-lg'>
              Nhập hàng nhanh
            </h3>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-slate-200 rounded-full transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        <div className='p-8'>
          {/* Thanh tìm kiếm dùng chung searchQuery */}
          <div className='mb-6'>
            <label className='text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1'>
              Quét hoặc nhập mã SKU
            </label>
            <div className='flex gap-2'>
              <div className='relative flex-1'>
                <Search
                  className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
                  size={18}
                />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Nhập vào mã sản phẩm'
                  className='h-11 pl-12 pr-4 border rounded-full bg-slate-50 focus-visible:ring-0 text-sm font-medium w-full shadow-none'
                />
              </div>
            </div>
          </div>

          {foundProduct ? (
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='p-4 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4'>
                <div className='relative w-20 h-20 bg-white rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-inner'>
                  {foundProduct.thumbnailUrls?.[0] ? (
                    <Image
                      src={foundProduct.thumbnailUrls[0]}
                      alt={
                        getTranslation(foundProduct, activeLang)?.productName ||
                        'Product image'
                      }
                      fill // Tự động lấp đầy div cha (phải có relative ở div cha)
                      sizes='80px' // Giúp trình duyệt chọn kích thước ảnh phù hợp
                      className='object-contain p-1' // Giữ tỉ lệ ảnh và padding
                      priority={true} // Nếu đây là modal quan trọng, priority giúp load ảnh nhanh hơn
                    />
                  ) : (
                    <PackageOpen size={30} className='text-slate-200' />
                  )}
                </div>
                <div className='overflow-hidden'>
                  <p className='text-xs text-slate-500'>
                    Mã:{' '}
                    <span className='font-mono font-bold text-slate-700'>
                      {/* CHỈNH SỬA: Hiển thị code */}
                      {foundProduct?.code}
                    </span>
                  </p>
                  <h4 className='font-bold text-xs text-slate-900'>
                    {getTranslation(foundProduct, activeLang)?.productName ||
                      'Không có tên'}
                  </h4>
                  <p className='font-semibold text-xs'>
                    Tồn kho: {foundProduct?.quantity}
                  </p>
                </div>
              </div>

              {/* Input Fields */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-2 grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='quantity'
                      className='text-[10px] font-bold uppercase text-slate-400 ml-1'
                    >
                      Số lượng
                    </Label>
                    <Input
                      id='quantity'
                      type='number'
                      min='1'
                      value={formData.quantity}
                      onChange={e =>
                        setFormData({ ...formData, quantity: +e.target.value })
                      }
                      className='h-11 px-4 bg-slate-50 rounded-full 
                                font-bold'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label
                      htmlFor='importDate'
                      className='text-[10px] font-bold uppercase text-slate-400 ml-1'
                    >
                      Ngày nhập
                    </Label>
                    <Input
                      id='importDate'
                      type='date'
                      value={formData.importDate}
                      onChange={e =>
                        setFormData({ ...formData, importDate: e.target.value })
                      }
                      className='h-11 px-4 bg-slate-50 border-slate-200 rounded-full'
                    />
                  </div>
                </div>

                {/* Giá nhập */}
                <div className='space-y-1.5'>
                  <Label className='text-[10px] font-bold uppercase text-slate-400 ml-1'>
                    Giá nhập
                  </Label>
                  <div className='relative'>
                    <Input
                      type='number'
                      value={formData.importPrice}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          importPrice: +e.target.value,
                        })
                      }
                      className='h-11 pl-4 pr-10 bg-slate-50 rounded-full font-bold text-emerald-600'
                    />
                    <span className='absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400'>
                      Kč
                    </span>
                  </div>
                </div>

                {/* Giá bán */}
                <div className='space-y-1.5'>
                  <Label className='text-[10px] font-bold uppercase text-slate-400 ml-1'>
                    Giá bán
                  </Label>
                  <div className='relative'>
                    <Input
                      type='number'
                      value={formData.salePrice}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          salePrice: +e.target.value,
                        })
                      }
                      className='h-11 pl-4 pr-10 bg-slate-50 rounded-full  font-bold text-blue-600'
                    />
                    <span className='absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400'>
                      Kč
                    </span>
                  </div>
                </div>

                {/* Hạ giá (Discount) */}
                <div className='space-y-1.5'>
                  <Label className='text-[10px] font-bold uppercase text-slate-400 ml-1'>
                    Hạ giá
                  </Label>
                  <div className='relative'>
                    <Input
                      type='number'
                      value={formData.discountPrice}
                      onChange={e =>
                        setFormData({
                          ...formData,
                          discountPrice: +e.target.value,
                        })
                      }
                      className='h-11 pl-4 pr-10 bg-slate-50 rounded-full font-bold text-rose-600'
                    />
                    <span className='absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400'>
                      Kč
                    </span>
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t flex items-center justify-between'>
                <button
                  type='submit'
                  className='bg-emerald-600 text-white px-10 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all'
                >
                  <Save size={18} />
                  Nhập kho
                </button>
              </div>
            </form>
          ) : (
            hasSearched && (
              <div className='py-10 text-center animate-in zoom-in-95'>
                <div className='w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <AlertCircle size={40} />
                </div>
                <h4 className='font-bold text-slate-900 text-lg'>
                  Không thấy sản phẩm
                </h4>
                <p className='text-sm text-slate-500 mb-6'>
                  Mã <span className='font-bold'>"{localSku}"</span> chưa tồn
                  tại trong hệ thống.
                </p>
                <button
                  onClick={() => onOpenCreate(localSku)}
                  className='bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 mx-auto'
                >
                  <Plus size={18} />
                  Tạo mới sản phẩm này
                </button>
              </div>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ImportProductModal
