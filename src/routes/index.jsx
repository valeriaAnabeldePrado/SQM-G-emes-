import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Apartaments from '../components/web-sections/apartments/apartaments.jsx'
import ApartmentDetail from '../components/web-sections/apartments/ApartmentDetail.jsx'
import ApartamentSection from '../components/web-sections/inmersive/apartament/ApartamentSection.jsx'
import BuildSection from '../components/web-sections/inmersive/build/BuildSection.jsx'
import Layout from '../components/layout/Layout.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <App />
      </Layout>
    )
  },
  {
    path: '/apartments',
    element: (
      <Layout>
        <Apartaments />
      </Layout>
    )
  },
  {
    path: '/apartments/:apartmentId',
    element: (
      <Layout>
        <ApartmentDetail />
      </Layout>
    )
  },
  {
    path: '/inmersive-apartament',
    element: (
      <Layout>
        <Apartaments />
      </Layout>
    )
  },
  {
    path: '/inmersive-build',
    element: (
      <Layout>
        <BuildSection />
      </Layout>
    )
  }
])
