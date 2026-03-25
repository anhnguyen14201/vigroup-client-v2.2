import React from 'react'

const ContactInfo = ({ icon, text }: any) => (
  <div className='flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100'>
    <span className='text-primary'>{icon}</span> {text}
  </div>
)

export default ContactInfo
