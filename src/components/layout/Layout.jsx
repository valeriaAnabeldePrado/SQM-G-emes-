import WhatsAppButton from '../ui-components-generics/WhatsAppButton'
import ReactErrorBoundary from '../error/ReactErrorBoundary'

const Layout = ({ children }) => (
  <ReactErrorBoundary>
    {children}
    <WhatsAppButton />
  </ReactErrorBoundary>
)

export default Layout
