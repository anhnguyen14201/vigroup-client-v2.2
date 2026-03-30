'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useQueryState, usePaginatedCollection, useAuth } from '@/hooks'
import {
  categoryService,
  subCategoryService,
  brandService,
  seriesService,
  languageService,
  productService,
} from '@/services'
import useSWR from 'swr'
import { useAuthStore } from '@/stores'

export const useProductManagement = (itemsPerPage: number = 10) => {
  const { searchParams, setQuery } = useQueryState()
  const { handleLogout } = useAuth()
  const { user } = useAuthStore() as any

  // 1. TRÍCH XUẤT GIÁ TRỊ TỪ URL (Dùng primitives để tránh loop)
  const categoryId = searchParams.get('categoryId') || ''
  const subCategoryId = searchParams.get('subCategoryId') || ''
  const brandId = searchParams.get('brandId') || ''
  const seriesId = searchParams.get('seriesId') || ''
  const qParam = searchParams.get('q') || ''
  const pageParam = Number(searchParams.get('page')) || 1

  // 2. LOCAL STATES
  const [activeLangCode, setActiveLangCode] = useState('vi')
  const [searchQuery, _setSearchQuery] = useState(
    () => searchParams.get('q') || '',
  )
  const [currentPage, _setCurrentPage] = useState(pageParam)

  // Memoize filters để làm dependency cho SWR/Fetch
  const urlFilters = useMemo(
    () => ({
      categoryId,
      subCategoryId,
      brandId,
      seriesId,
    }),
    [categoryId, subCategoryId, brandId, seriesId],
  )

  // 3. FETCH LOOKUP DATA (SWR)
  const swrConfig = useMemo(
    () => ({
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }),
    [],
  )

  const { data: categoriesData = [], mutate: mutateCats } = useSWR(
    'lookups-categories',
    () =>
      categoryService
        .getCategories({ pageSize: 'all' })
        .then(res => res?.data ?? res),
    swrConfig,
  )

  const { data: subCategoriesData = [], mutate: mutateSubCats } = useSWR(
    'lookups-subcategories',
    () =>
      subCategoryService
        .getSubCategories({ pageSize: 'all' })
        .then(res => res?.data ?? res),
    swrConfig,
  )

  const { data: brandsData = [], mutate: mutateBrands } = useSWR(
    'lookups-brands',
    () =>
      brandService.getBrands({ pageSize: 'all' }).then(res => res?.data ?? res),
    swrConfig,
  )

  const { data: seriesData = [], mutate: mutateSeries } = useSWR(
    'lookups-series',
    () =>
      seriesService
        .getAllSeries({ pageSize: 'all' })
        .then(res => res?.data ?? res),
    swrConfig,
  )

  const { data: languagesData = [] } = useSWR(
    'lookups-languages',
    () => languageService.getLanguages().then(res => res?.data ?? res),
    swrConfig,
  )

  // 4. PRODUCT DATA FETCHING
  const fetchParams = useMemo(
    () => ({
      search: searchQuery,
      ...urlFilters,
    }),
    [searchQuery, urlFilters],
  )

  const {
    items: products,
    totalPages,
    isLoading: isProductsLoading,
    mutate: refreshProducts,
  } = usePaginatedCollection(
    // Sử dụng hash đơn giản thay vì JSON.stringify liên tục nếu có thể,
    // nhưng JSON.stringify ở đây vẫn ổn nếu fetchParams đã được memoize.
    `products-${searchQuery}-${categoryId}-${subCategoryId}-${brandId}-${seriesId}`,
    fetchParams,
    productService.getProducts,
    currentPage,
    itemsPerPage,
  )

  // 5. CASCADING FILTER LOGIC (Sử dụng trực tiếp biến primitives để tối ưu)
  const filteredSubCats = useMemo(() => {
    if (!categoryId) return subCategoriesData
    return subCategoriesData.filter((sc: any) =>
      sc.categories?.some((cat: any) => (cat?._id || cat) === categoryId),
    )
  }, [categoryId, subCategoriesData])

  const filteredBrands = useMemo(() => {
    if (!categoryId && !subCategoryId) return brandsData
    return brandsData.filter((brand: any) => {
      const matchCat = !categoryId || brand.categories?.includes(categoryId)
      const matchSub =
        !subCategoryId || brand.subCategories?.includes(subCategoryId)
      return matchCat && matchSub
    })
  }, [categoryId, subCategoryId, brandsData])

  const filteredSeries = useMemo(() => {
    if (!brandId && !categoryId && !subCategoryId) return seriesData
    return seriesData.filter((s: any) => {
      const matchBrand = !brandId || (s.brand?._id || s.brand) === brandId
      const matchCat = !categoryId || s.brand?.categories?.includes(categoryId)
      const matchSub =
        !subCategoryId ||
        s.subCategories?.some((sub: any) => (sub?._id || sub) === subCategoryId)
      return matchBrand && matchCat && matchSub
    })
  }, [brandId, categoryId, subCategoryId, seriesData])

  // 6. ACTIONS (Dùng useCallback triệt để)
  const setSearchQuery = useCallback(
    (q: string) => {
      _setSearchQuery(q)
      setQuery({ q, page: 1 })
    },
    [setQuery],
  )

  const setCurrentPage = useCallback(
    (page: number) => {
      _setCurrentPage(page)
      setQuery({ page })
    },
    [setQuery],
  )

  const updateFilters = useCallback(
    (newFilters: Record<string, string | null>) => {
      setQuery({ ...newFilters, page: 1 })
    },
    [setQuery],
  )

  const resetFilters = useCallback(() => {
    _setSearchQuery('')
    setQuery({
      q: '',
      categoryId: '',
      subCategoryId: '',
      brandId: '',
      seriesId: '',
      page: 1,
    })
  }, [setQuery])

  const getTranslation = useCallback((item: any, langCode: string) => {
    if (!item?.translations?.length) return null
    return (
      item.translations.find(
        (t: any) => (t.language?.code || t.language) === langCode,
      ) || item.translations[0]
    )
  }, [])

  const refreshAll = useCallback(() => {
    mutateCats()
    mutateSubCats()
    mutateBrands()
    mutateSeries()
    refreshProducts()
  }, [mutateCats, mutateSubCats, mutateBrands, mutateSeries, refreshProducts])

  // 7. RETURN
  return {
    products,
    totalPages,
    isLoading:
      isProductsLoading ||
      (categoriesData.length === 0 && brandsData.length === 0),
    languagesData,
    categoriesData,
    filteredSubCats,
    filteredBrands,
    filteredSeries,
    brandsData,
    activeLangCode,
    setActiveLangCode,
    searchQuery,
    currentPage,
    filters: fetchParams,
    setSearchQuery,
    setCurrentPage,
    updateFilters,
    resetFilters,
    refreshProducts,
    refreshCats: mutateCats,
    refreshSubCats: mutateSubCats,
    refreshBrands: mutateBrands,
    refreshSeries: mutateSeries,
    refreshAll,
    getTranslation,
    user,
    handleLogout,
  }
}
