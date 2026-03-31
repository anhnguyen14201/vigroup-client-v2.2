'use client'

import { useState, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { PackagePlus, Plus } from 'lucide-react' // Thêm icon PackagePlus cho thân thiện
import {
  brandService,
  categoryService,
  productService,
  seriesService,
  subCategoryService,
} from '@/services'
import {
  ConfirmDeleteModal,
  FloatingActionButton,
  GenericActionBar,
  Pagination,
} from '@/components/shared'
import { useProductManagement } from '@/components/features/e-shop/hooks'
import { toast } from 'sonner'
import {
  FilterSection,
  ProductCard,
} from '@/components/features/e-shop/components'
import CategoryModal from '@/components/features/e-shop/forms/CategoryModal'
import SubCategoryModal from '@/components/features/e-shop/forms/SubCategoryModal'
import BrandModal from '@/components/features/e-shop/forms/BrandModal'
import SeriesModal from '@/components/features/e-shop/forms/SeriesModal'
import { AdminHeader } from '@/components/layouts'
import nProgress from 'nprogress'
import ProductModal from '@/components/features/e-shop/forms/ProductModal'
import ImportProductModal from '@/components/features/e-shop/forms/ImportProductModal'
import { Button } from '@/components/ui'
import ProductDetailModal from '@/components/features/e-shop/components/ProductDetailModal'
import ProductList from '@/components/features/e-shop/components/ProductList'

const EShopManagementPage = () => {
  const {
    products,
    totalPages,
    isLoading,
    languagesData,
    categoriesData,
    filteredSubCats,
    filteredBrands,
    filteredSeries,
    brandsData,
    activeLangCode,
    searchQuery,
    currentPage,
    filters,
    setSearchQuery,
    setCurrentPage,
    updateFilters,
    resetFilters,
    refreshCats,
    refreshSubCats,
    refreshBrands,
    refreshSeries,
    getTranslation,
    refreshProducts,
    user,
    handleLogout,
  } = useProductManagement(10)

  // State cho việc xóa
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
    type: string
  } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [detailModal, setDetailModal] = useState<{ open: boolean; data?: any }>(
    {
      open: false,
      data: null,
    },
  )

  // State quản lý Modal chung (Thêm/Sửa)
  // Cập nhật Type để hỗ trợ PRODUCT
  const [activeModal, setActiveModal] = useState<{
    type:
      | 'CATEGORY'
      | 'SUB_CATEGORY'
      | 'BRAND'
      | 'SERIES'
      | 'PRODUCT'
      | 'IMPORT'
    data?: any
  } | null>(null)

  const closeModal = () => setActiveModal(null)

  // 2. Thêm một State riêng cho Product (Thêm/Sửa nhanh)
  const [productModal, setProductModal] = useState<{
    open: boolean
    data?: any
  }>({
    open: false,
    data: null,
  })

  // Hàm mở ProductModal từ bất cứ đâu (kể cả từ ImportModal)
  const handleOpenProductModal = (data?: any) => {
    setProductModal({ open: true, data })
  }

  const openEditModal = (type: any, item: any) => {
    setActiveModal({ type, data: item })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    nProgress.start()
    setIsDeleting(true)

    const loadingMessages: Record<string, string> = {
      CATEGORY: 'Đang xóa danh mục...',
      SUB_CATEGORY: 'Đang xóa danh mục phụ...',
      BRAND: 'Đang xóa thương hiệu...',
      SERIES: 'Đang xóa dòng sản phẩm...',
      PRODUCT: 'Đang xóa sản phẩm...',
    }

    const toastId = toast.loading(
      loadingMessages[deleteTarget.type] || 'Đang xử lý...',
    )

    try {
      switch (deleteTarget.type) {
        case 'CATEGORY':
          await categoryService.deleteCategory(deleteTarget.id)
          refreshCats()
          break
        case 'SUB_CATEGORY':
          await subCategoryService.deleteSubCategory(deleteTarget.id)
          refreshSubCats()
          break
        case 'BRAND':
          await brandService.deleteBrand(deleteTarget.id)
          refreshBrands()
          break
        case 'SERIES':
          await seriesService.deleteSeries(deleteTarget.id)
          refreshSeries()
          break
        case 'PRODUCT':
          // Giả sử Anh có productService trong useProductManagement hoặc import trực tiếp
          await productService.deleteProduct(deleteTarget.id)
          refreshProducts() // Gọi hàm fetch lại danh sách sản phẩm
          toast.success('Xóa sản phẩm thành công!')
          break
      }
      toast.success('Xóa thành công!', { id: toastId })
      setDeleteTarget(null)
    } catch (error) {
      toast.error('Không thể xóa. Mục này có thể đang chứa sản phẩm.', {
        id: toastId,
      })
    } finally {
      nProgress.done()
      setIsDeleting(false)
    }
  }

  // Logic format SubCategories cho Filter
  const getFormattedSubCats = useMemo(() => {
    const result: any[] = []
    const rootSubs = filteredSubCats.filter((sc: any) => {
      const parentId = sc.parent?._id || sc.parent
      return !filteredSubCats.some((s: any) => s._id === parentId)
    })

    rootSubs.forEach((parent: any) => {
      result.push({
        id: parent._id,
        name: getTranslation(parent, activeLangCode)?.name || 'N/A',
        level: 0,
        raw: parent,
      })
      const children = filteredSubCats.filter(
        (child: any) => (child.parent?._id || child.parent) === parent._id,
      )
      children.forEach((child: any) => {
        result.push({
          id: child._id,
          name: getTranslation(child, activeLangCode)?.name || 'N/A',
          level: 1,
          raw: child,
        })
      })
    })
    return result
  }, [filteredSubCats, activeLangCode, getTranslation])

  const handleCreateNew = () => {
    setActiveModal({ type: 'PRODUCT' })
    setProductModal({ open: true })
  }

  return (
    <>
      <AdminHeader user={user} onLogout={handleLogout}>
        <h1 className='text-lg font-bold tracking-tight text-slate-900 mb-2'>
          Quản lý E-Shop
        </h1>
      </AdminHeader>

      <div
        className='flex flex-col w-full p-6 font-sans text-slate-900 no-scrollbar overflow-y-auto'
        data-lenis-prevent
      >
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* LEFT PANEL: FILTERS */}
          <aside className='w-full lg:w-72 space-y-4 shrink-0'>
            <div className='bg-white p-6 rounded-4xl border'>
              <FilterSection
                label='Danh mục chính'
                onAdd={() => setActiveModal({ type: 'CATEGORY' })}
                onEdit={(item: any) => {
                  const fullData = categoriesData.find(
                    (c: any) => c._id === item.id,
                  )
                  openEditModal('CATEGORY', fullData)
                }}
                onDelete={(item: any) =>
                  setDeleteTarget({
                    id: item.id,
                    name: item.name,
                    type: 'CATEGORY',
                  })
                }
                options={categoriesData.map((c: any) => ({
                  id: c._id,
                  name: getTranslation(c, activeLangCode)?.name || 'N/A',
                }))}
                value={filters.categoryId}
                onChange={(id: string) => updateFilters({ categoryId: id })}
              />

              <FilterSection
                label='Danh mục con'
                onAdd={() => setActiveModal({ type: 'SUB_CATEGORY' })}
                onEdit={(item: any) => openEditModal('SUB_CATEGORY', item.raw)}
                onDelete={(item: any) =>
                  setDeleteTarget({
                    id: item.id,
                    name: item.name,
                    type: 'SUB_CATEGORY',
                  })
                }
                options={getFormattedSubCats}
                value={filters.subCategoryId}
                onChange={(id: string) =>
                  updateFilters({ subCategoryId: id, seriesId: null })
                }
              />

              <FilterSection
                label='Thương hiệu'
                onAdd={() => setActiveModal({ type: 'BRAND' })}
                onEdit={(item: any) => {
                  const fullBrandData = brandsData.find(
                    (b: any) => b._id === item.id,
                  )
                  setActiveModal({ type: 'BRAND', data: fullBrandData })
                }}
                onDelete={(item: any) =>
                  setDeleteTarget({
                    id: item.id,
                    name: item.name || 'Thương hiệu này',
                    type: 'BRAND',
                  })
                }
                options={filteredBrands.map((b: any) => ({
                  id: b._id,
                  name: b.name,
                  logoBrand: b.logoBrand,
                }))}
                value={filters.brandId}
                onChange={(id: string) =>
                  updateFilters({ brandId: id, seriesId: null })
                }
              />

              <FilterSection
                label='Dòng sản phẩm'
                onAdd={() => setActiveModal({ type: 'SERIES' })}
                onEdit={(item: any) => {
                  const fullSeriesData = filteredSeries.find(
                    (s: any) => s._id === item.id,
                  )
                  setActiveModal({ type: 'SERIES', data: fullSeriesData })
                }}
                onDelete={(item: any) =>
                  setDeleteTarget({
                    id: item.id,
                    name: item.name,
                    type: 'SERIES',
                  })
                }
                options={filteredSeries.map((s: any) => ({
                  id: s._id,
                  name: s.seriesName,
                }))}
                value={filters.seriesId}
                onChange={(id: string) => updateFilters({ seriesId: id })}
              />

              {/* <button
                onClick={resetFilters}
                className='w-full mt-8 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors'
              >
                Xóa tất cả bộ lọc
              </button> */}
            </div>
          </aside>

          {/* RIGHT PANEL: ACTION BAR & TABLE */}
          <main className='flex-1'>
            {/* GenericActionBar thay thế cho Input cũ */}
            <div className='flex gap-2 items-center'>
              <GenericActionBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder={'Nhập vào mã hoặc tên sản phẩm...'}
                buttonLabel={'Thêm sản phẩm'}
                buttonIcon={Plus}
                onButtonClick={handleCreateNew}
              />
              {/* Nút Nhập hàng mới */}
              <Button
                onClick={() => setActiveModal({ type: 'IMPORT' })}
                className='flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 
                        text-white px-4 py-2.5 rounded-full font-medium transition-all 
                        shrink-0 mb-6 h-11 uppercase'
              >
                <PackagePlus size={20} />
                <span>Nhập hàng</span>
              </Button>
            </div>

            <ProductList
              setProductModal={setProductModal}
              setDetailModal={setDetailModal}
              setDeleteTarget={setDeleteTarget}
              products={products}
              totalPages={totalPages}
              activeLangCode={activeLangCode}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              getTranslation={getTranslation}
              isLoading={isLoading}
            />
          </main>
        </div>

        <FloatingActionButton
          onClick={handleCreateNew}
          // icon={Wallet} // Nếu không truyền sẽ mặc định là dấu Plus
        />
        {/* MODALS SECTION */}
        <ConfirmDeleteModal
          open={!!deleteTarget}
          onOpenChange={open => !open && setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          title={
            deleteTarget?.type === 'PRODUCT'
              ? `Xác nhận xóa vĩnh viễn?`
              : `Xóa ${deleteTarget?.name}?`
          }
          description={
            deleteTarget?.type === 'PRODUCT'
              ? `Sản phẩm "${deleteTarget?.name}" sẽ bị gỡ khỏi hệ thống và không thể khôi phục.`
              : 'Lưu ý: Hành động xóa này sẽ không hoàn tác lại được'
          }
          loading={isDeleting}
        />
        {activeModal?.type === 'CATEGORY' && (
          <CategoryModal
            data={activeModal.data}
            onClose={closeModal}
            languagesData={languagesData}
            activeLang={activeLangCode}
          />
        )}
        {activeModal?.type === 'SUB_CATEGORY' && (
          <SubCategoryModal
            data={activeModal.data}
            onClose={closeModal}
            languagesData={languagesData}
            activeLang={activeLangCode}
            categories={categoriesData}
            filteredSubCats={filteredSubCats}
          />
        )}
        {activeModal?.type === 'BRAND' && (
          <BrandModal
            data={activeModal.data}
            onClose={closeModal}
            languagesData={languagesData}
            activeLang={activeLangCode}
            categories={categoriesData}
            filteredSubCats={filteredSubCats}
          />
        )}
        {activeModal?.type === 'SERIES' && (
          <SeriesModal
            data={activeModal.data}
            onClose={closeModal}
            languagesData={languagesData}
            activeLang={activeLangCode}
            categories={categoriesData}
            filteredSubCats={filteredSubCats}
            brands={filteredBrands}
          />
        )}
        {/* MODAL THÊM/SỬA SẢN PHẨM MỚI */}
        {productModal.open && (
          <ProductModal
            data={productModal?.data}
            onClose={() => setProductModal({ open: false, data: null })}
            languagesData={languagesData}
            activeLang={activeLangCode}
            categories={categoriesData}
            filteredSubCats={filteredSubCats}
            brands={filteredBrands}
            series={filteredSeries}
          />
        )}
        {activeModal?.type === 'IMPORT' && (
          <ImportProductModal
            onClose={closeModal}
            products={products} // Danh sách products từ hook
            searchQuery={searchQuery} // Biến searchQuery từ hook
            setSearchQuery={setSearchQuery} // Hàm setSearchQuery từ hook
            activeLang={activeLangCode}
            getTranslation={getTranslation}
            onOpenCreate={(sku: any) => {
              // Không gọi setActiveModal(null) nữa để giữ ImportModal lại
              setProductModal({ open: true, data: { code: sku } })
              setSearchQuery('')
            }}
            refreshProducts={refreshProducts}
          />
        )}

        <ProductDetailModal
          isOpen={detailModal.open}
          product={detailModal.data}
          onClose={() => setDetailModal({ open: false, data: null })}
          activeLang={activeLangCode}
        />
      </div>
    </>
  )
}

export default EShopManagementPage
