import React from 'react'
import { motion } from 'framer-motion' // Dùng motion để hiệu ứng mượt hơn

const ActionButton = ({ variant, icon, label, onClick }: any) => {
  const styles: any = {
    success:
      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white',
    danger:
      'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500 hover:text-white',
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center gap-2.5 px-5 py-2.5 cursor-pointer
        rounded-full font-bold text-[10px] uppercase tracking-widest
        transition-all duration-300 border backdrop-blur-md
        ${styles[variant]}
      `}
    >
      <span className='shrink-0'>{icon}</span>
      <span>{label}</span>
    </motion.button>
  )
}

export default ActionButton
