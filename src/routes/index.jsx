import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../App.jsx'
import Apartaments from '../components/web-sections/apartments/apartaments.jsx'
import ApartmentDetail from '../components/web-sections/apartments/ApartmentDetail.jsx'
import Roadmap from '../components/web-sections/roadmap/Roadmap.jsx'
import Layout from '../components/layout/Layout.jsx'
import NavBar from '../components/ui-components-generics/navBar/NavBar.jsx'
import ErrorBoundary from '../components/error/ErrorBoundary.jsx'
import NotFound from '../components/error/NotFound.jsx'
import Disponibilidad from '../components/web-sections/disponibilidad/Disponibilidad.jsx'
import { LoadingScreen } from '../components/web-sections/edificio-3d/ui/LoadingScreen.jsx'

// Carga diferida de las páginas 3D: three.js, los modelos y sus precargas solo se
// descargan al entrar a cada una (antes el GLB del 3D viejo bajaba en todo el sitio)
const Edificio3D = lazy(() => import('../components/web-sections/edificio-3d/Edificio3D.jsx'))
const NewBuild = lazy(() => import('../components/web-sections/inmersive/build/newbuild.jsx'))
const ScrollApartment = lazy(
  () => import('../components/web-sections/inmersive/ScrollApartment.jsx')
)

const PageFallback = () => <div className="h-[100svh] w-full bg-[#d6dee4]" />
// Mientras baja el código de la escena ya se ve la barra de carga
const Edificio3DFallback = () => (
  <div className="relative h-[100svh] w-full">
    <LoadingScreen />
  </div>
)

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
        <Suspense fallback={<PageFallback />}>
          <ScrollApartment />
        </Suspense>
        {/* <ScrollApartmentOptimized /> */}
      </Layout>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/new',
    element: (
      <Layout>
        <Suspense fallback={<PageFallback />}>
          <NewBuild />
        </Suspense>
      </Layout>
    ),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/edificio-3d',
    element: (
      <Layout>
        <Suspense fallback={<Edificio3DFallback />}>
          <Edificio3D />
        </Suspense>
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
    path: '/disponibilidad',
    element: <Disponibilidad />,
    errorElement: <ErrorBoundary />
  },
  {
    path: '*',
    element: <NotFound />
  }
])
