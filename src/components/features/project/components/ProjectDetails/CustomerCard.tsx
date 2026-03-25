import ContactInfo from '@/components/features/project/components/ProjectDetails/ContactInfo'
import { Button } from '@/components/ui'
import { Mail, MapPin, Phone, User, UserPlus } from 'lucide-react'
import React from 'react'

const CustomerCard = ({ project }: any) => {
  return (
    <div
      className='lg:col-span-1 bg-white p-6 rounded-4xl border flex flex-col
              justify-between'
    >
      <div>
        <div className='flex items-center gap-4 mb-6'>
          <div
            className='w-12 h-12 bg-slate-100 rounded-xl flex items-center 
                    justify-center text-slate-600'
          >
            <User size={24} />
          </div>
          <div>
            <p className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>
              Khách hàng
            </p>
            <h4 className='font-bold text-slate-800 uppercase'>
              {project.customerName || 'N/A'}
            </h4>
          </div>
        </div>
        <div className='space-y-3'>
          <ContactInfo
            icon={<Phone size={14} />}
            text={project.customerPhone || '---'}
          />
          <ContactInfo
            icon={<Mail size={14} />}
            text={project.customerEmail || '---'}
          />
          <ContactInfo
            icon={<MapPin size={14} />}
            text={project.location || ''}
          />
        </div>
      </div>
      {/* <Button
        className='w-full mt-6 py-3 text-white rounded-full font-bold 
                text-xs transition-all flex items-center 
                justify-center gap-2'
      >
        <UserPlus size={14} /> Thay đổi thông tin
      </Button> */}
    </div>
  )
}

export default CustomerCard
