'use client'

import { motion } from 'framer-motion'
import { Box, Trash2, User, MapPin, Edit3 } from 'lucide-react'

const DeviceCard = ({ device, index, onClick, onDelete, onEdit }: any) => {
  const isOnSite = !device.inWarehouse

  return (
    <motion.div
      className='group relative h-56 rounded-[2.5rem] bg-[#F1F3F6] overflow-hidden border 
                cursor-pointer transition-all duration-300
                hover:border-primary'
      onClick={onClick}
    >
      {/* 1. Background Layer */}
      <div className='absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent' />
        <div
          className='absolute inset-0'
          style={{
            backgroundImage:
              'radial-gradient(#8b5cf6 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* 2. Main Content */}
      <div className='relative h-full z-10 p-7 flex flex-col justify-between'>
        {/* Top: Status & Action Buttons */}
        <div className='flex justify-between items-start'>
          <div className='space-y-1'>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md border ${
                isOnSite
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-600'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${isOnSite ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}
              />
              <span className='text-[10px] font-black uppercase tracking-tighter'>
                {isOnSite ? 'Ngoài công trình' : 'Trong kho'}
              </span>
            </div>
            <p className='text-[11px] font-bold text-slate-400 tracking-widest pl-1'>
              #{device.code}
            </p>
          </div>

          {/* --- Action Buttons: Hover on Desktop, Always on Mobile --- */}
          <div className='flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-[-10px] lg:group-hover:translate-y-0 transition-all duration-300'>
            <button
              onClick={e => {
                e.stopPropagation()
                onEdit(device)
              }}
              className='w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors border border-slate-100'
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
                onDelete(device._id, device.name)
              }}
              className='w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors border border-slate-100'
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Middle: Title */}
        <div className='mt-2'>
          <h3 className='text-xl font-black text-slate-800 leading-tight group-hover:text-primary transition-colors line-clamp-2'>
            {device.name}
          </h3>
        </div>

        {/* Bottom: Contextual Info */}
        <div className='pt-4 border-t border-slate-200/50'>
          <div className='flex flex-col gap-1.5'>
            {isOnSite ? (
              <>
                <div className='flex items-center gap-2'>
                  <User size={13} className='text-indigo-500' />
                  <span className='text-[11px] font-black text-slate-700 uppercase'>
                    {device.userRealTime?.fullName || 'N/A'}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <MapPin size={13} className='text-slate-400' />
                  <span className='text-[10px] uppercase font-bold text-slate-500 line-clamp-1'>
                    {device.currentProject?.projectName || 'Chưa rõ dự án'}
                  </span>
                </div>
              </>
            ) : (
              <div className='flex items-center gap-2 text-emerald-600'>
                <Box size={14} />
                <span className='text-[10px] font-black uppercase tracking-widest'>
                  Sẵn sàng bàn giao
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Decorative Accent Bar */}
      <div
        className={`absolute bottom-0 left-0 h-1.5 transition-all duration-700 ${
          isOnSite
            ? 'bg-amber-500 w-1/4 group-hover:w-full'
            : 'bg-emerald-500 w-1/6 group-hover:w-full'
        }`}
      />
    </motion.div>
  )
}

export default DeviceCard
