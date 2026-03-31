import ProductCard from '@/components/features/e-shop/components/ProductCard'
import { useProductManagement } from '@/components/features/e-shop/hooks'
import { EmptyState, LoadingState, Pagination } from '@/components/shared'

const ProductList = ({
  setProductModal,
  setDetailModal,
  setDeleteTarget,
  products,
  totalPages,
  activeLangCode,
  currentPage,
  setCurrentPage,
  getTranslation,
  isLoading,
}: any) => {
  if (isLoading) {
    return <LoadingState />
  }

  if (products.length === 0) {
    return <EmptyState />
  }

  return (
    <div className='flex flex-col gap-3'>
      {products?.map((product: any) => (
        <ProductCard
          key={product._id}
          product={product}
          translation={getTranslation(product, activeLangCode)}
          onEdit={() => setProductModal({ open: true, data: product })}
          onClick={() => setDetailModal({ open: true, data: product })}
          onDelete={() => {
            setDeleteTarget({
              id: product._id,
              name:
                getTranslation(product, activeLangCode)?.productName ||
                'Sản phẩm này',
              type: 'PRODUCT',
            })
          }}
        />
      ))}
      <div className='mt-10'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default ProductList
