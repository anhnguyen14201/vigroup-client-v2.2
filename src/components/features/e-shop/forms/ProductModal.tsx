'use client'

import { ProjectImageSection } from '@/components/features/project/forms'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@/components/ui'
import { X, ShoppingBag, Loader2, Search, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  useProductForm,
  useProductManagement,
} from '@/components/features/e-shop/hooks'
import {
  Field,
  LanguageSwitcher,
  Pagination,
  RichTextEditor,
} from '@/components/shared'
import CategoryItem from '@/components/features/e-shop/components/CategoryItem'
import { useState } from 'react'
import { ProductCard } from '@/components/features/e-shop/components'
import { toast } from 'sonner'
import Image from 'next/image'

const UNIT_OPTIONS = [
  { value: 'm', label: 'Mét (m)' },
  { value: 'km', label: 'Kilômét (km)' },
  { value: 'h', label: 'Giờ (h)' },
  { value: 'ngày', label: 'Ngày' },
  { value: 'ks', label: 'Kus (cái/chiếc)' },
  { value: 'kpl', label: 'Komplet (bộ/set)' },
]

const ProductModal = ({
  data,
  onClose,
  languagesData,
  activeLang,
  categories,
  filteredSubCats,
  brands,
  series,
}: any) => {
  const {
    modalLang,
    setModalLang,
    commonData,
    onCommonDataChange,
    translationsMap,
    handleTranslationChange,
    parentIds,
    toggleParentSelection,
    selectedBrandId,
    setSelectedBrandId,
    isSubmitting,
    handleSubmit,
    onFileChange,
    onRemoveImage,
    isEdit,
    getTranslation,
    selectedSeriesId,
    setSelectedSeriesId,
    fileInputRef,
    setCommonData,
    currentTranslation,
    seoLength,
    relatedProductIds,
    addRelatedProduct,
  } = useProductForm(
    data,
    languagesData,
    activeLang,
    categories,
    filteredSubCats,
    onClose,
  )

  console.log(categories)

  const {
    products,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useProductManagement(10)
  const [isOpenRelatedModal, setIsOpenRelatedModal] = useState(false)
  const removeRelatedProduct = (productId: string) => {
    setCommonData(prev => ({
      ...prev,
      relatedProducts: (prev.relatedProducts || []).filter(
        (p: any) => p._id !== productId,
      ),
    }))

    toast.error('Đã xóa khỏi danh sách liên quan')
  }

  return (
    <div
      className='fixed inset-0 z-100 flex items-end sm:items-center 
    justify-center p-0 sm:p-4'
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='absolute inset-0 bg-slate-900/40 backdrop-blur-md'
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='relative bg-white w-full max-w-7xl rounded-[40px] flex 
        flex-col border border-slate-100 overflow-hidden max-h-[95vh]'
      >
        {/* HEADER */}
        <div className='p-5 sm:p-7 border-b border-slate-100 bg-white sticky top-0 z-20 flex justify-between items-center'>
          <div className='flex items-center gap-3'>
            <div className='p-2.5 bg-indigo-50 rounded-xl text-indigo-600'>
              <ShoppingBag size={22} />
            </div>
            <div>
              <h2 className='text-base sm:text-lg font-black uppercase italic text-slate-900'>
                {isEdit ? 'Cập nhật Sản phẩm' : 'Thêm Sản phẩm mới'}
              </h2>
              <p className='text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest'>
                Ngôn ngữ: <span className='text-indigo-600'>{modalLang}</span>
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2 sm:gap-3'>
            <LanguageSwitcher
              languagesData={languagesData}
              currentLang={modalLang}
              onLangChange={setModalLang}
            />
            <button
              onClick={onClose}
              className='p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-full transition-colors'
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className='flex-1 overflow-y-auto p-5 sm:p-8 no-scrollbar'>
          <form id='product-form' onSubmit={handleSubmit} className='space-y-8'>
            <div className='flex flex-col lg:grid lg:grid-cols-12 gap-8'>
              {/* CỘT TRÁI: THÔNG TIN CƠ BẢN & GIÁ */}
              <div className='lg:col-span-6 space-y-6'>
                <section className='grid grid-cols-2 gap-4'>
                  <Field label='Mã sản phẩm' required>
                    <Input
                      value={commonData.code}
                      onFocus={e => e.target.select()}
                      onChange={e => onCommonDataChange('code', e.target.value)}
                      placeholder='PRD-2026'
                      className='rounded-full bg-slate-50'
                    />
                  </Field>
                  <Field label='Giá nhập'>
                    <Input
                      type='number'
                      value={commonData.importPrice}
                      onFocus={e => e.target.select()}
                      onChange={e =>
                        onCommonDataChange('importPrice', e.target.value)
                      }
                      className='rounded-full bg-slate-50'
                    />
                  </Field>
                  <Field label='Thuế (VAT %)'>
                    <Input
                      type='number'
                      value={commonData.tax}
                      onFocus={e => e.target.select()}
                      onChange={e =>
                        onCommonDataChange('tax', Number(e.target.value))
                      }
                      placeholder='21'
                      className='rounded-full bg-slate-50'
                    />
                  </Field>
                  <Field label='Giá bán'>
                    <Input
                      type='number'
                      value={commonData.salePrice}
                      onFocus={e => e.target.select()}
                      onChange={e =>
                        onCommonDataChange('salePrice', e.target.value)
                      }
                      className='rounded-full bg-slate-50'
                    />
                  </Field>

                  <Field label='Số lượng'>
                    <Input
                      type='number'
                      value={commonData.quantity}
                      onFocus={e => e.target.select()}
                      onChange={e =>
                        onCommonDataChange('quantity', Number(e.target.value))
                      }
                      placeholder='0'
                      className='rounded-full bg-slate-50 '
                    />
                  </Field>

                  <Field label='Hạ giá'>
                    <Input
                      type='number'
                      value={commonData.discountPrice}
                      onFocus={e => e.target.select()}
                      onChange={e =>
                        onCommonDataChange('discountPrice', e.target.value)
                      }
                      className='rounded-full bg-slate-50'
                    />
                  </Field>

                  <Field label='Đơn vị'>
                    <Select
                      value={commonData.unit || 'ks'}
                      onValueChange={value => onCommonDataChange('unit', value)}
                    >
                      <SelectTrigger className='w-full z-1000 rounded-full bg-slate-50  h-10 px-5 font-semibold focus:ring-indigo-500/20 outline-none shadow-none cursor-pointer'>
                        <SelectValue placeholder='Chọn đơn vị' />
                      </SelectTrigger>
                      <SelectContent
                        position='popper'
                        sideOffset={0}
                        className='rounded-xl shadow-none z-1000 bg-white'
                      >
                        {' '}
                        {UNIT_OPTIONS.map(unit => (
                          <SelectItem
                            key={unit.value}
                            value={unit.value}
                            className='cursor-pointer'
                          >
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </section>
                <div className='grid grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 gap-4 lg:h-100'>
                  {' '}
                  {/* Danh mục chính */}
                  <div className='flex flex-col rounded-3xl border bg-slate-50 overflow-hidden'>
                    <div className='p-4 bg-slate-50 border-b flex items-center gap-2 sticky top-0 z-10'>
                      <div className='w-1 h-3 bg-indigo-500 rounded-full' />
                      <span className='text-[10px] font-black uppercase text-slate-500'>
                        Danh mục chính
                      </span>
                    </div>
                    <div className='flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar'>
                      {categories.map((item: any) => (
                        <CategoryItem
                          key={item._id}
                          item={item}
                          activeLang={modalLang}
                          getTranslation={getTranslation}
                          isSelected={parentIds.includes(item._id)}
                          onToggle={() => toggleParentSelection(item._id)}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Danh mục con */}
                  <div className='flex flex-col rounded-3xl border bg-slate-50 overflow-hidden'>
                    <div className='p-4 bg-slate-50 border-b flex items-center gap-2 sticky top-0 z-10'>
                      <div className='w-1 h-3 bg-rose-500 rounded-full' />
                      <span className='text-[10px] font-black uppercase text-slate-500'>
                        Danh mục con
                      </span>
                    </div>
                    <div className='flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar'>
                      {filteredSubCats
                        .filter((s: any) => !s.parent)
                        .map((parentSub: any) => (
                          <div key={parentSub._id} className='space-y-1'>
                            <CategoryItem
                              item={parentSub}
                              activeLang={modalLang}
                              variant='secondary'
                              getTranslation={getTranslation}
                              isSelected={parentIds.includes(parentSub._id)}
                              onToggle={() =>
                                toggleParentSelection(parentSub._id)
                              }
                            />
                            {filteredSubCats
                              .filter(
                                (c: any) =>
                                  (c.parent?._id || c.parent) === parentSub._id,
                              )
                              .map((child: any) => (
                                <div
                                  key={child._id}
                                  className='ml-4 pl-2 border-l border-slate-200'
                                >
                                  <CategoryItem
                                    item={child}
                                    activeLang={modalLang}
                                    variant='secondary'
                                    getTranslation={getTranslation}
                                    isSelected={parentIds.includes(child._id)}
                                    onToggle={() =>
                                      toggleParentSelection(child._id)
                                    }
                                    className='scale-95 origin-left'
                                  />
                                </div>
                              ))}
                          </div>
                        ))}
                    </div>
                  </div>
                  {/* Thương hiệu & Series */}
                  <div className='flex flex-col gap-4'>
                    <div className='flex-1 flex flex-col rounded-3xl border bg-slate-50 overflow-hidden'>
                      <div className='p-4 bg-slate-50 border-b  flex items-center gap-2 sticky top-0 z-10'>
                        <div className='w-1 h-3 bg-amber-500 rounded-full' />
                        <span className='text-[10px] font-black uppercase text-amber-600'>
                          Thương hiệu
                        </span>
                      </div>
                      <div className='flex-1 overflow-y-auto p-3 space-y-1  no-scrollbar'>
                        {brands.map((brand: any) => (
                          <CategoryItem
                            key={brand._id}
                            item={brand}
                            activeLang={modalLang}
                            getTranslation={getTranslation}
                            isSelected={selectedBrandId === brand._id}
                            onToggle={() =>
                              setSelectedBrandId(
                                brand._id === selectedBrandId ? '' : brand._id,
                              )
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='flex-1 flex flex-col rounded-3xl border bg-slate-50 overflow-hidden'>
                    <div className='p-4 border-b flex items-center gap-2 bg-white/50'>
                      <div className='w-1.5 h-1.5 bg-emerald-500 rounded-full' />
                      <span className='text-[10px] font-black uppercase text-emerald-600'>
                        Dòng máy (Series)
                      </span>
                    </div>
                    <div className='flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar'>
                      {series
                        .filter(
                          (s: any) =>
                            s.brand?._id === selectedBrandId ||
                            !selectedBrandId,
                        )
                        .map((ser: any) => (
                          <CategoryItem
                            key={ser._id}
                            item={{ ...ser, name: ser.seriesName }}
                            activeLang={modalLang}
                            getTranslation={getTranslation}
                            isSelected={selectedSeriesId === ser._id}
                            onToggle={() =>
                              setSelectedSeriesId(
                                ser._id === selectedSeriesId ? '' : ser._id,
                              )
                            }
                          />
                        ))}
                    </div>
                  </div>
                </div>
                {/* SWITCH OPTIONS */}
                <section className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                  {[
                    {
                      id: 'isFeatured',
                      label: 'Nổi bật',
                      desc: 'Đưa lên đầu trang',
                      icon: '✨',
                      activeColor: 'bg-amber-500',
                      lightColor: 'bg-amber-50',
                      textColor: 'text-amber-700',
                    },
                    {
                      id: 'isNewArrival',
                      label: 'Hàng mới',
                      desc: 'Gắn tag New',
                      icon: '🆕',
                      activeColor: 'bg-blue-500',
                      lightColor: 'bg-blue-50',
                      textColor: 'text-blue-700',
                    },
                    {
                      id: 'isBestSeller',
                      label: 'Bán chạy',
                      desc: 'Ưu tiên hiển thị',
                      icon: '🔥',
                      activeColor: 'bg-rose-500',
                      lightColor: 'bg-rose-50',
                      textColor: 'text-rose-700',
                    },
                  ].map(item => {
                    const isActive =
                      commonData[item.id as keyof typeof commonData]

                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onCommonDataChange(item.id, !isActive)}
                        className={`relative flex flex-col p-4 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden
                        ${
                          isActive
                            ? `border-transparent ${item.lightColor}`
                            : 'border-slate-100 bg-white hover:border-indigo-200'
                        }`}
                      >
                        {/* Background Pattern khi Active */}
                        {isActive && (
                          <div className='absolute -right-2 -top-2 opacity-10 text-4xl grayscale'>
                            {item.icon}
                          </div>
                        )}

                        <div className='flex items-center justify-between mb-2'>
                          <div
                            className={`w-8 h-8 rounded-2xl flex items-center justify-center text-lg
                            ${isActive ? 'bg-white' : 'bg-slate-50'}`}
                          >
                            {item.icon}
                          </div>

                          {/* Custom Switch */}
                          <div
                            className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${isActive ? item.activeColor : 'bg-slate-200'}`}
                          >
                            <motion.div
                              animate={{ x: isActive ? 16 : 2 }}
                              className='absolute top-1 w-2 h-2 bg-white rounded-full'
                            />
                          </div>
                        </div>

                        <div>
                          <h4
                            className={`text-[13px] font-bold leading-tight ${isActive ? item.textColor : 'text-slate-700'}`}
                          >
                            {item.label}
                          </h4>
                          <p
                            className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-500' : 'text-slate-400'}`}
                          >
                            {item.desc}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </section>

                <section className='p-4 bg-slate-50 rounded-3xl border'>
                  <ProjectImageSection
                    images={commonData.images}
                    fileInputRef={fileInputRef}
                    onFileChange={onFileChange}
                    onRemoveImage={onRemoveImage}
                    onSelectThumbnail={idx =>
                      setCommonData(p => ({
                        ...p,
                        images: p.images.map((img, i) => ({
                          ...img,
                          isThumbnail: i === idx,
                        })),
                      }))
                    }
                    title='Ảnh'
                    multiple={true}
                  />
                </section>
              </div>

              {/* CỘT PHẢI: CATEGORIES & BRANDS */}
              <div className='lg:col-span-6 space-y-4'>
                <section className='space-y-4'>
                  <Field label='Tên sản phẩm' required>
                    <Input
                      value={currentTranslation.productName || ''} // Sửa .name thành .productName
                      onChange={e =>
                        handleTranslationChange('productName', e.target.value)
                      }
                      onFocus={e => e.target.select()}
                      placeholder='Tên sản phẩm hiển thị...'
                      className='rounded-full bg-slate-50 h-11 font-semibold'
                    />
                  </Field>

                  <Field label='Mô tả SEO'>
                    <div className='relative'>
                      <Textarea
                        value={currentTranslation.metaDescription || ''}
                        onChange={e =>
                          handleTranslationChange(
                            'metaDescription',
                            e.target.value,
                          )
                        }
                        onFocus={e => e.target.select()}
                        placeholder='Mô tả chuẩn SEO...'
                        className='rounded-2xl bg-slate-50 min-h-20 resize-none pb-8'
                      />
                      <div className='absolute bottom-2 right-4 text-[10px] font-black'>
                        <span
                          className={
                            seoLength > 160 ? 'text-rose-500' : 'text-slate-400'
                          }
                        >
                          {seoLength} / 160
                        </span>
                      </div>
                    </div>
                  </Field>

                  <Field label='Mô tả ngắn'>
                    <RichTextEditor
                      key={`short-${modalLang}`}
                      value={currentTranslation.shortDesc || ''}
                      onChange={val =>
                        handleTranslationChange('shortDesc', val)
                      }
                    />
                  </Field>
                  <Field label='Mô tả chi tiết'>
                    <RichTextEditor
                      key={`desc-${modalLang}`}
                      value={currentTranslation.desc || ''}
                      onChange={val => handleTranslationChange('desc', val)}
                    />
                  </Field>
                  <Field label='Thông số kỹ thuật'>
                    <RichTextEditor
                      key={`spec-${modalLang}`}
                      value={currentTranslation.specifications || ''}
                      onChange={val =>
                        handleTranslationChange('specifications', val)
                      }
                    />
                  </Field>
                </section>
              </div>
            </div>
            {/* SẢN PHẨM LIÊN QUAN */}
            <section className='p-6 bg-slate-50 rounded-[40px] border border-slate-100 space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='w-1.5 h-4 bg-indigo-500 rounded-full' />
                  <span className='text-[11px] font-black uppercase text-slate-500 tracking-wider'>
                    Sản phẩm liên quan (
                    {commonData.relatedProducts?.length || 0})
                  </span>
                </div>

                {/* NÚT MỞ MODAL CHỌN */}
                <Button
                  type='button'
                  onClick={() => setIsOpenRelatedModal(true)} // Anh cần tạo state này ở useProductForm hoặc ngay tại đây
                  className='rounded-full bg-indigo-600 hover:bg-indigo-700 text-[10px] h-8 px-4 font-black uppercase shadow-lg shadow-indigo-200'
                >
                  + Thêm sản phẩm
                </Button>
              </div>

              {/* HIỂN THỊ DANH SÁCH ĐÃ CHỌN */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {commonData.relatedProducts?.length > 0 ? (
                  commonData.relatedProducts.map((product: any, idx: any) => {
                    const translation = getTranslation(product, modalLang)

                    return (
                      <motion.div
                        layout
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='flex items-center gap-3 p-3 bg-white border 
                                  rounded-2xl transition-shadow group relative'
                      >
                        {/* 1. Ảnh sản phẩm */}
                        <div className='relative w-12 h-12 flex-shrink-0'>
                          <Image
                            src={
                              product?.thumbnailUrls?.[0] ||
                              product?.images?.[0]?.url ||
                              '/placeholder.png'
                            }
                            alt={translation?.productName || 'Product image'}
                            fill // Để ảnh lấp đầy thẻ div cha có relative
                            sizes='48px' // Chỉ định kích thước xấp xỉ để Next.js tối ưu download
                            className='rounded-xl object-cover border border-slate-50'
                            // Next.js tự động có lazy loading, nhưng nếu đây là danh sách quan trọng
                            // có thể thêm priority nếu nó xuất hiện ở đầu trang
                          />
                        </div>

                        {/* 2. Thông tin: Tên & Mã */}
                        <div className='flex-1 min-w-0'>
                          <p className='text-[10px] font-bold text-indigo-500 mt-0.5 tracking-wider uppercase'>
                            Mã: {product?.code || 'N/A'}
                          </p>
                          <h4 className='text-[10px] font-semibold uppercase text-slate-800 leading-tight uppercase italic'>
                            {translation?.productName || 'Chưa có tên'}
                          </h4>
                        </div>

                        {/* 3. Nút xóa */}
                        <button
                          type='button'
                          onClick={() => removeRelatedProduct(product._id)}
                          className='p-2 bg-slate-50 text-slate-400 hover:text-rose-500
                                    hover:bg-rose-50 rounded-full transition-all'
                          title='Xóa khỏi danh sách liên quan'
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    )
                  })
                ) : (
                  /* Trạng thái trống */
                  <div
                    onClick={() => setIsOpenRelatedModal(true)}
                    className='col-span-full py-8 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white transition-colors'
                  >
                    <div className='p-3 bg-indigo-50 rounded-2xl text-indigo-500'>
                      <ShoppingBag size={24} />
                    </div>
                    <p className='text-[10px] font-black uppercase text-slate-400'>
                      Chưa có sản phẩm liên quan. Nhấn để thêm.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </form>
        </div>

        {/* FOOTER */}
        <div className='p-5 sm:p-7 border-t bg-white flex flex-row gap-3 sticky bottom-0 z-20'>
          <Button
            variant='outline'
            onClick={onClose}
            className='flex-1 h-12 rounded-full font-black text-[10px] uppercase 
            text-slate-400'
          >
            Hủy bỏ
          </Button>
          <Button
            form='product-form'
            type='submit'
            disabled={isSubmitting}
            className='flex-1 h-12 rounded-full font-black text-[10px] uppercase'
          >
            {isSubmitting ? (
              <Loader2 className='animate-spin' size={18} />
            ) : isEdit ? (
              'Lưu thay đổi'
            ) : (
              'Đăng sản phẩm'
            )}
          </Button>
        </div>
      </motion.div>

      <RelatedProductSelector
        isOpen={isOpenRelatedModal}
        onClose={() => setIsOpenRelatedModal(false)}
        products={products}
        selectedIds={commonData.relatedProducts || []}
        onToggle={addRelatedProduct}
        modalLang={modalLang}
        getTranslation={getTranslation}
      />
    </div>
  )
}

const RelatedProductSelector = ({
  isOpen,
  onClose,
  selectedIds,
  onToggle,
  modalLang,
  getTranslation,
}: any) => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    currentPage,
    totalPages,
    setCurrentPage,
    activeLangCode,
  } = useProductManagement(10)

  if (!isOpen) return null
  return (
    <div className='fixed inset-0 z-210 flex items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='absolute inset-0 bg-slate-900/60 backdrop-blur-sm'
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className='relative bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]'
      >
        <div className='p-6 border-b flex justify-between items-center bg-slate-50/50'>
          <h3 className='font-black uppercase italic text-slate-900'>
            Chọn sản phẩm liên quan
          </h3>
          <button
            onClick={onClose}
            className='p-2 hover:bg-white rounded-full transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        <div className='p-6 space-y-4 flex-1 overflow-y-scroll no-scrollbar flex flex-col'>
          <div className='relative'>
            <Search
              className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
              size={18}
            />
            <Input
              placeholder='Tìm theo tên hoặc mã...'
              className='pl-12 rounded-full h-12 bg-slate-100 border-none'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className='flex flex-col gap-3'>
            {products?.map((product: any) => (
              <ProductCard
                key={product._id}
                product={product}
                translation={getTranslation(product, activeLangCode)}
                onAdd={onToggle}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <div className='p-6 border-t bg-slate-50/50'>
          <Button
            onClick={onClose}
            className='w-full rounded-full h-12 font-black uppercase'
          >
            Hoàn tất
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductModal
