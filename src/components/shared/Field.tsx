const Field = ({
  label,
  children,
  required,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) => (
  <div className=''>
    <label
      className='text-[10px] font-bold text-slate-400 uppercase ml-2 flex 
                items-center gap-1'
    >
      {label} {required && <span className='text-rose-500'>*</span>}
    </label>
    {children}
  </div>
)

export default Field
