import NextTopLoader from 'nextjs-toploader'

const ProgressProvider = ({ children }: { children: React.ReactNode }) => (
  <>
    <NextTopLoader
      color='#C74242'
      initialPosition={0.08}
      crawlSpeed={200}
      height={2}
      showSpinner={false}
      shadow='none'
    />
    {children}
  </>
)

export default ProgressProvider
