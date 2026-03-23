import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Clock, Timer } from 'lucide-react'
import { formatTimeCzech } from '@/utils'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'

const shiftSchema = z
  .object({
    projectId: z.string().min(1, 'Vui lòng chọn dự án hoặc loại công việc'),
    checkIn: z.string().min(1, 'Bắt buộc'),
    checkOut: z.string().min(1, 'Bắt buộc'),
    notes: z.string().optional(),
  })
  .refine(data => data.checkOut > data.checkIn, {
    message: 'Giờ kết thúc phải sau giờ bắt đầu',
    path: ['checkOut'],
  })

type ShiftFormValues = z.infer<typeof shiftSchema>

interface EditShiftModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedShift: any
  startedProjects: any[]
  getVNProjectName: (project: any) => string
  onSubmit: (values: ShiftFormValues) => Promise<void>
}

const EditShiftModal = ({
  isOpen,
  onOpenChange,
  selectedShift,
  startedProjects,
  getVNProjectName,
  onSubmit,
}: EditShiftModalProps) => {
  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema),
    defaultValues: { projectId: '', checkIn: '', checkOut: '', notes: '' },
  })

  useEffect(() => {
    if (selectedShift) {
      form.reset({
        projectId:
          selectedShift.projectId?._id ||
          (selectedShift.type === 'travel' ? 'travel_default' : ''),
        checkIn: selectedShift.checkIn
          ? formatTimeCzech(selectedShift.checkIn)
          : '',
        checkOut: selectedShift.checkOut
          ? formatTimeCzech(selectedShift.checkOut)
          : '',
        notes: selectedShift.notes || '',
      })
    }
  }, [selectedShift, form])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-156.25 z-1000 rounded-3xl p-0 overflow-hidden border-none'>
        <div className='p-6 text-white bg-[#C74242]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-3 text-xl font-bold'>
              <Timer className='w-6 h-6' /> Cập nhật ca làm
            </DialogTitle>
            <p className='text-primary-foreground/80 text-xs mt-1'>
              Thay đổi thông tin thời gian và dự án làm việc
            </p>
          </DialogHeader>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='p-6 space-y-6 bg-white'
          >
            <FormField
              control={form.control}
              name='projectId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-slate-700 font-bold'>
                    Dự án thực hiện
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='h-12 w-full py-5 bg-slate-50 shadow-none rounded-full'>
                        <SelectValue placeholder='Chọn dự án...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      position='popper'
                      sideOffset={5}
                      className='rounded-xl border-slate-100 z-1000 bg-white'
                    >
                      {startedProjects.map((proj: any) => (
                        <SelectItem key={proj._id} value={proj._id}>
                          {getVNProjectName(proj)}
                        </SelectItem>
                      ))}
                      <SelectItem
                        value='travel_default'
                        className='text-amber-600 font-medium'
                      >
                        🚗 Di chuyển giữa các dự án
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-[11px]' />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-6'>
              {['checkIn', 'checkOut'].map(name => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as any}
                  render={({ field }) => (
                    <FormItem className='space-y-2 relative pb-5'>
                      <FormLabel className='text-slate-500 font-bold text-[10px] uppercase tracking-wider ml-1'>
                        {name === 'checkIn' ? 'Giờ bắt đầu' : 'Giờ kết thúc'}
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            type='time'
                            {...field}
                            onClick={e => {
                              try {
                                e.currentTarget.showPicker()
                              } catch {}
                            }}
                            className='h-11 bg-slate-50 rounded-full font-bold text-lg px-5 w-full [&::-webkit-calendar-picker-indicator]:hidden'
                          />
                          <Clock className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-5 h-5' />
                        </div>
                      </FormControl>
                      <FormMessage className='text-[11px] absolute bottom-0 left-1' />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-slate-500 font-bold text-[10px] uppercase tracking-wider ml-1'>
                    Ghi chú công việc
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Ví dụ: Đổ bê tông tầng 2...'
                      {...field}
                      className='min-h-30 bg-slate-50 rounded-2xl p-4 resize-none'
                    />
                  </FormControl>
                  <FormMessage className='text-[11px]' />
                </FormItem>
              )}
            />

            <DialogFooter className='pt-2 flex flex-row gap-3'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                className='flex-1 h-12 rounded-full'
              >
                Hủy bỏ
              </Button>
              <Button
                type='submit'
                className='flex-1 h-12 rounded-full bg-[#C74242] hover:bg-primary/90'
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditShiftModal
