'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, FolderPlus, Hash } from 'lucide-react'
import { Button } from '@/components/ui'

interface Props {
  type: 'main' | 'sub'
}

const CategoryManager = ({ type }: Props) => {
  // Mock data - Sau này anh dùng useQuery (TanStack Query) để fetch nhé
  const categories = [
    {
      _id: '1',
      name: 'Thiết bị đo đạc',
      slug: 'thiet-bi-do-dac',
      count: 12,
      parent: null,
    },
    {
      _id: '2',
      name: 'Máy toàn đạc',
      slug: 'may-toan-dac',
      count: 5,
      parent: 'Thiết bị đo đạc',
    },
  ]

  const displayData =
    type === 'main'
      ? categories.filter(c => !c.parent)
      : categories.filter(c => c.parent)

  return (
    <div className='bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100'>
      <table className='w-full text-left border-collapse'>
        <thead className='bg-slate-50 border-b border-slate-100'>
          <tr>
            <th className='p-6 text-[10px] font-black uppercase tracking-widest text-slate-400'>
              Thông tin {type === 'main' ? 'Danh mục' : 'Sub-Category'}
            </th>
            <th className='p-6 text-[10px] font-black uppercase tracking-widest text-slate-400'>
              Slug / URL
            </th>
            {type === 'sub' && (
              <th className='p-6 text-[10px] font-black uppercase tracking-widest text-slate-400'>
                Danh mục cha
              </th>
            )}
            <th className='p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center'>
              Số lượng SP
            </th>
            <th className='p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right'>
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((cat, idx) => (
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              key={cat._id}
              className='border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors group'
            >
              <td className='p-6'>
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold'>
                    {cat.name.charAt(0)}
                  </div>
                  <span className='font-bold text-slate-800'>{cat.name}</span>
                </div>
              </td>
              <td className='p-6 text-sm font-mono text-slate-400 italic'>
                /{cat.slug}
              </td>
              {type === 'sub' && (
                <td className='p-6 text-sm font-bold text-indigo-500'>
                  <span className='bg-indigo-50 px-3 py-1 rounded-full'>
                    {cat.parent}
                  </span>
                </td>
              )}
              <td className='p-6 text-center'>
                <span className='bg-slate-100 px-3 py-1 rounded-full text-xs font-black'>
                  {cat.count}
                </span>
              </td>
              <td className='p-6'>
                <div className='flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='rounded-full hover:bg-white hover:shadow-sm'
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='rounded-full hover:bg-red-50 hover:text-red-500'
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CategoryManager
