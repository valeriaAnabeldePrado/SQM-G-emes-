import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Apartaments from '../components/web-sections/apartments/apartaments.jsx'
import ApartmentDetail from '../components/web-sections/apartments/ApartmentDetail.jsx'
import BuildSection from '../components/web-sections/inmersive/build/BuildSection.jsx'
import Roadmap from '../components/web-sections/roadmap/Roadmap.jsx'
import Layout from '../components/layout/Layout.jsx'
import NavBar from '../components/ui-components-generics/navBar/NavBar.jsx'
import ScrollApartment from '../components/web-sections/inmersive/ScrollApartment.jsx'
import ErrorBoundary from '../components/error/ErrorBoundary.jsx'
import NotFound from '../components/error/NotFound.jsx'
// import ScrollApartmentOptimized from '../components/web-sections/inmersive/ScrollApartmentOptimized.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <NavBar />
        <App />
      </Layout>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/apartments',
    element: (
      <Layout>
        <NavBar />
        <Apartaments />
      </Layout>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/apartments/:apartmentId',
    element: (
      <Layout>
        <NavBar />
        <ApartmentDetail />
      </Layout>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/inmersive-apartament',
    element: (
      <Layout>
        <NavBar />
        <ScrollApartment />
        {/* <ScrollApartmentOptimized /> */}
      </Layout>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/inmersive-build',
    element: (
      <Layout>
        <NavBar />
        <BuildSection />
      </Layout>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/roadmap',
    element: (
      <Layout>
        <NavBar />
        <Roadmap />
      </Layout>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '*',
    element: <NotFound />
  }
])
