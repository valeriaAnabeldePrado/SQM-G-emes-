export const HOTSPOTS = [
  {
    id: 'ingreso',
    position: [0, 0.5, 5],
    label: 'Ingreso principal',
    camera: { position: [0, 0, 10], lookAt: [0, 0.5, 5], zoom: 1.2 },
    characteristics: {
      title: 'Ingreso Principal',
      description: 'Acceso principal del edificio con diseño moderno y funcional',
      features: [
        'Doble altura en el hall',
        'Sistema de seguridad 24/7',
        'Acceso para personas con movilidad reducida',
        'Área de recepción de paquetes',
        'Iluminación LED automática'
      ],
      specs: {
        'Ancho de acceso': '3.5 metros',
        Material: 'Vidrio templado y acero',
        Seguridad: 'Control de acceso biométrico'
      },
  // Safe defaults: these fields should come from canonical sources (apartmentData.json or section files)
  year: null,
  architect: null,
  materials: [],
  uses: [],
  totalArea: null,
  elevators: null,
  amenities: []
    }
  },
  {
    id: 'balcon',
    position: [0, 10, 5],
    label: 'Hall central',
    camera: { position: [0, 10, 6], lookAt: [0, 8, 2], zoom: 1.2 },
    characteristics: {
      title: 'Balcón Panorámico',
      description: 'Vista privilegiada con orientación este-oeste para disfrutar todo el día',
      features: [
        'Vista panorámica 180°',
        'Espacio para jardín vertical',
        'Orientación este-oeste',
        'Capacidad para mobiliario exterior',
        'Conexión eléctrica para iluminación'
      ],
      specs: {
        Superficie: '12 m²',
        Barandas: 'Vidrio templado 1.20m',
        Piso: 'Deck composite antideslizante'
      },
  year: null,
  architect: null,
  materials: ['Deck composite', 'Vidrio templado'],
  uses: ['Espacio común', 'Recreación'],
  totalArea: '12 m²',
  elevators: 0,
  amenities: ['Jardín vertical', 'Iluminación ambiental']
    }
  },
  {
    id: 'hall',
    position: [0, 1.5, -3.5],
    label: 'Balcón panorámico',
    camera: { position: [0, 2, -7], lookAt: [0, 0, 0], zoom: 1.2 },
    characteristics: {
      title: 'Hall Central',
      description: 'Espacio de distribución amplio con diseño arquitectónico destacado',
      features: [
        'Doble altura arquitectónica',
        'Iluminación cenital natural',
        'Detalles en mármol travertino',
        'Circulación fluida a todos los ambientes',
        'Climatización centralizada'
      ],
      specs: {
        Altura: '4.5 metros',
        Superficie: '18 m²',
        Iluminación: 'LED dimerizables + luz natural'
      },
  year: null,
  architect: null,
  materials: ['Mármol travertino', 'Hormigón visto'],
  uses: ['Recepción', 'Circulación'],
  totalArea: '18 m²',
  elevators: 0,
  amenities: ['Climatización', 'Acústica tratada']
    }
  }
]
