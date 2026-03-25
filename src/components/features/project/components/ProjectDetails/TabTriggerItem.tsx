import { TabsTrigger } from '@/components/ui'
import React from 'react'

const TabTriggerItem = ({ value, icon, label, isWarning }: any) => (
  <TabsTrigger
    value={value}
    className={`nav-tab whitespace-nowrap ${isWarning ? 'text-amber-600 data-[state=active]:text-amber-600' : ''}`}
  >
    {icon} {label}
  </TabsTrigger>
)
export default TabTriggerItem
