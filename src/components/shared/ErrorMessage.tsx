import { motion, AnimatePresence } from 'framer-motion'

const ErrorMessage = ({ message }: { message?: string }) => (
  <AnimatePresence mode='wait'>
    {message && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className='text-[11px] font-medium text-red-500 mt-1 ml-1'
      >
        {message}
      </motion.p>
    )}
  </AnimatePresence>
)

export default ErrorMessage
