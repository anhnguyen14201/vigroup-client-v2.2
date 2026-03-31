import { formatCurrency } from '@/utils'
import { Edit3, Trash2, Plus } from 'lucide-react' // Thêm icon Plus
import React from 'react'

const ProductCard = ({
  product,
  translation,
  onEdit,
  onDelete,
  onClick,
  onAdd,
}: any) => {
  const getStockInfo = (qty: number) => {
    if (qty <= 0)
      return { label: 'Hết hàng', color: 'text-red-600', bg: 'bg-red-50' }
    if (qty <= 5)
      return { label: 'Sắp hết', color: 'text-amber-600', bg: 'bg-amber-50' }
    return { label: 'Còn hàng', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  }

  const stock = getStockInfo(product.quantity)
  const hasPromo = product.discount && product.discount > 0

  const handleCardClick = () => {
    // NẾU KHÔNG CÓ onAdd THÌ MỚI CHO PHÉP CHẠY onClick
    if (!onAdd && onClick) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className='group bg-white rounded-3xl border border-slate-100 p-3 cursor-pointer hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300'
    >
      <div className='flex flex-col lg:flex-row items-center gap-4 lg:gap-6'>
        {/* 1. Ảnh & Thông tin chính */}
        <div className='flex items-center gap-4 w-full lg:w-[30%]'>
          <div className='relative w-24 h-24 shrink-0 rounded-2xl bg-slate-50 border border-slate-100 p-2 overflow-hidden flex items-center justify-center'>
            <img
              src={product.thumbnailUrls?.[0]}
              alt='product'
              className='max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform'
            />
            {product.discount > 0 && (
              <div className='absolute top-0 left-0 bg-red-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-br-lg z-10'>
                {product.price
                  ? -(
                      ((product.price - product.discount) / product.price) *
                      100
                    ).toFixed(2)
                  : 0}
                %
              </div>
            )}
          </div>

          <div className='min-w-0 flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <span className='text-[9px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full uppercase tracking-tighter border border-indigo-100'>
                {product.code}
              </span>
              <div
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${stock.bg}`}
              >
                <span
                  className={`w-1 h-1 rounded-full ${stock.color.replace('text', 'bg')}`}
                />
                <span
                  className={`text-[8px] font-black uppercase ${stock.color}`}
                >
                  {stock.label}
                </span>
              </div>
            </div>

            <h3 className='font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors'>
              {translation?.productName || 'N/A'}
            </h3>

            <div className='flex flex-wrap gap-1 mt-1'>
              {product.isBestSeller && (
                <span className='text-[8px] font-bold bg-orange-100 text-orange-600 px-1 py-0.5 rounded-full'>
                  🔥 Bán chạy
                </span>
              )}
              {product.isFeatured && (
                <span className='text-[8px] font-bold bg-purple-100 text-purple-600 px-1 py-0.5 rounded-full'>
                  ⭐ Nổi bật
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Tài chính */}
        <div className='grid grid-cols-3 flex-1 w-full gap-2 px-4 py-3 bg-slate-50/50 rounded-2xl lg:bg-transparent lg:border-none'>
          <div className='flex flex-col justify-center border-r border-slate-200/50'>
            <span className='text-[9px] font-bold text-slate-400 uppercase mb-0.5'>
              Giá Nhập
            </span>
            <p className='font-mono text-sm font-bold text-slate-600 italic'>
              {formatCurrency(product.cost || 0)}
            </p>
          </div>
          <div className='flex flex-col justify-center border-r border-slate-200/50 px-2'>
            <span className='text-[9px] font-bold text-sky-600 uppercase mb-0.5'>
              Giá Bán
            </span>
            <p
              className={`font-mono text-sm font-black ${hasPromo ? 'line-through text-slate-300' : 'text-sky-700'}`}
            >
              {formatCurrency(product.price)}
            </p>
          </div>
          <div className='flex flex-col justify-center items-end lg:items-start pl-2'>
            <span className='text-[9px] font-black text-rose-600 uppercase mb-0.5 tracking-tighter'>
              Khuyến Mãi
            </span>
            <p className='font-mono text-sm font-black text-rose-700'>
              {formatCurrency(product.discount)}
            </p>
          </div>
        </div>

        {/* 3. Kho vận */}
        <div className='flex items-center justify-around w-full lg:w-[18%] py-2 border-t lg:border-t-0 lg:border-l border-slate-100'>
          <div className='text-center'>
            <p className='text-[9px] font-bold text-slate-400 uppercase mb-0.5'>
              Tồn kho
            </p>
            <p className='text-sm font-black text-slate-800'>
              {product.quantity}{' '}
              <span className='font-bold text-slate-400'>{product.unit}</span>
            </p>
          </div>
          <div className='text-center'>
            <p className='text-[9px] font-bold text-slate-400 uppercase mb-0.5'>
              Đã bán
            </p>
            <p className='text-sm font-black text-emerald-600'>
              {product.sold || 0}{' '}
              <span className='font-bold text-slate-400'>{product.unit}</span>
            </p>
          </div>
        </div>

        {/* 4. Thao tác (Cập nhật ở đây) */}
        <div className='flex items-center gap-1 w-full lg:w-auto justify-end'>
          {/* Nút THÊM: Chỉ hiển thị khi có truyền prop onAdd */}
          {onAdd && (
            <button
              onClick={e => {
                e.stopPropagation() // Ngăn sự kiện click lan ra ngoài card
                onAdd(product)
              }}
              className='p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-all active:scale-90 border border-transparent hover:border-emerald-100 shadow-sm'
              title='Thêm vào danh sách'
            >
              <Plus size={20} strokeWidth={3} />
            </button>
          )}

          {/* Nút SỬA: Chỉ hiển thị khi có onEdit */}
          {onEdit && (
            <button
              onClick={e => {
                e.stopPropagation()
                onEdit()
              }}
              className='p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-all active:scale-90'
              title='Sửa'
            >
              <Edit3 size={16} />
            </button>
          )}

          {/* Nút XÓA: Chỉ hiển thị khi có onDelete */}
          {onDelete && (
            <button
              onClick={e => {
                e.stopPropagation()
                onDelete()
              }}
              className='p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-all active:scale-90'
              title='Xóa'
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
