import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Apartaments from '../components/web-sections/apartments/apartaments.jsx'
import ApartmentDetail from '../components/web-sections/apartments/ApartmentDetail.jsx'
import ApartamentSection from '../components/web-sections/inmersive/apartament/ApartamentSection.jsx'
import BuildSection from '../components/web-sections/inmersive/build/BuildSection.jsx'
import Layout from '../components/layout/Layout.jsx'
import NavBar from '../components/ui-components-generics/navBar/NavBar.jsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <NavBar />
        <App />
      </Layout>
    )
  },
  {
    path: '/apartments',
    element: (
      <Layout>
        <NavBar />
        <Apartaments />
      </Layout>
    )
  },
  {
    path: '/apartments/:apartmentId',
    element: (
      <Layout>
        <NavBar />
        <ApartmentDetail />
      </Layout>
    )
  },
  {
    path: '/inmersive-apartament',
    element: (
      <Layout>
        <NavBar />
        <ApartamentSection />
      </Layout>
    )
  },
  {
    path: '/inmersive-build',
    element: (
      <Layout>
        <NavBar />
        <BuildSection />
      </Layout>
    )
  }
])
