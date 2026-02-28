export const banners = [
  { id: 1, titulo: "Transformamos el Suroeste", subtitulo: "Formación, empleo y cultura para nuestra comunidad", imagen: "hero-banner-1", ctaTexto: "Conoce más", ctaLink: "/quienes-somos" },
  { id: 2, titulo: "Educación que Transforma", subtitulo: "Abrimos convocatorias para el desarrollo de tu talento", imagen: "hero-banner-2", ctaTexto: "Ver convocatorias", ctaLink: "/convocatorias" },
  { id: 3, titulo: "Comunidad y Cultura", subtitulo: "Celebramos la riqueza del Suroeste Antioqueño", imagen: "hero-banner-3", ctaTexto: "Párchate", ctaLink: "/parchate" },
];

export const convocatorias = [
  {
    id: 1, titulo: "Curso de Marketing Digital", descripcion: "Aprende las herramientas digitales más demandadas del mercado actual.", descripcionCompleta: "Programa intensivo de 3 meses en marketing digital, incluyendo SEO, SEM, redes sociales, email marketing y analítica web. Dirigido a jóvenes del Suroeste Antioqueño entre 18 y 30 años.", imagen: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600", fechaInicio: "2026-01-15", fechaFin: "2026-03-15", estado: "abierta", requisitos: ["Ser mayor de 18 años", "Residir en el Suroeste Antioqueño", "Tener acceso a computador e internet"], enlaceInscripcion: "#", categoria: "Formación"
  },
  {
    id: 2, titulo: "Emprendimiento Rural", descripcion: "Fortalece tu idea de negocio con acompañamiento profesional.", descripcionCompleta: "Programa de aceleración para emprendedores rurales con mentoría, financiación semilla y acceso a redes de negocio.", imagen: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600", fechaInicio: "2026-02-01", fechaFin: "2026-04-30", estado: "abierta", requisitos: ["Tener una idea de negocio", "Ser residente de la región", "Disponibilidad de 10h semanales"], enlaceInscripcion: "#", categoria: "Emprendimiento"
  },
  {
    id: 3, titulo: "Diplomado en Liderazgo Comunitario", descripcion: "Fortalece tus habilidades de liderazgo para tu comunidad.", descripcionCompleta: "Diplomado de 120 horas para líderes comunales y sociales del Suroeste.", imagen: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600", fechaInicio: "2025-06-01", fechaFin: "2025-12-15", estado: "cerrada", requisitos: ["Ser líder comunitario activo", "Disponibilidad fines de semana"], enlaceInscripcion: "#", categoria: "Liderazgo"
  },
  {
    id: 4, titulo: "Taller de Fotografía Documental", descripcion: "Captura la esencia del Suroeste a través de la lente.", descripcionCompleta: "Taller práctico de fotografía documental para contar historias de nuestra región.", imagen: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600", fechaInicio: "2026-03-01", fechaFin: "2026-05-30", estado: "abierta", requisitos: ["Cámara fotográfica o smartphone", "Interés por la fotografía"], enlaceInscripcion: "#", categoria: "Cultura"
  },
];

export const oportunidades = [
  {
    id: 1, titulo: "Asistente Administrativo", empresa: "Cooperativa Cafetera del Suroeste", descripcion: "Buscamos asistente administrativo con experiencia en gestión documental.", descripcionCompleta: "La Cooperativa Cafetera del Suroeste requiere profesional en áreas administrativas para apoyo en gestión documental, atención al cliente y coordinación de actividades.", imagen: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600", ubicacion: "Andes, Antioquia", tipo: "Tiempo completo", fechaPublicacion: "2026-02-01", fechaCierre: "2026-03-01", estado: "abierta", requisitos: ["Técnico o tecnólogo en administración", "1 año de experiencia", "Manejo de Office"], procesoReferencia: "Enviar hoja de vida al correo rrhh@coopcafe.org"
  },
  {
    id: 2, titulo: "Técnico Agrícola", empresa: "Finca La Esperanza", descripcion: "Se necesita técnico agrícola para proyecto de cultivos orgánicos.", descripcionCompleta: "Proyecto agrícola de producción orgánica busca técnico para supervisión de cultivos, manejo integrado de plagas y buenas prácticas agrícolas.", imagen: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600", ubicacion: "Jardín, Antioquia", tipo: "Tiempo completo", fechaPublicacion: "2026-02-10", fechaCierre: "2026-03-10", estado: "abierta", requisitos: ["Tecnólogo agropecuario", "Experiencia en cultivos orgánicos", "Licencia de conducción"], procesoReferencia: "Aplicar en la oficina de empleo municipal"
  },
  {
    id: 3, titulo: "Docente de Inglés", empresa: "Institución Educativa Rural", descripcion: "Se requiere docente de inglés para institución educativa rural.", descripcionCompleta: "Institución educativa rural del municipio de Betania busca docente de inglés para básica secundaria.", imagen: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600", ubicacion: "Betania, Antioquia", tipo: "Contrato término fijo", fechaPublicacion: "2026-01-20", fechaCierre: "2026-02-20", estado: "cerrada", requisitos: ["Licenciatura en idiomas", "Nivel B2 de inglés certificado"], procesoReferencia: "Contactar Secretaría de Educación"
  },
];

export const actividades = [
  {
    id: 1, titulo: "Festival del Café del Suroeste", descripcion: "Celebra la cultura cafetera con música, gastronomía y tradición.", contenido: "El Festival del Café del Suroeste Antioqueño es el evento más importante de la región, reuniendo a productores, artistas y visitantes en una celebración única de nuestra identidad cafetera. Durante tres días, los asistentes pueden disfrutar de catas de café de origen, talleres de barismo, música en vivo, muestra gastronómica típica y recorridos por fincas cafeteras.", imagen: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600", fecha: "2026-04-15", categoria: "cultural", ubicacion: "Andes, Antioquia"
  },
  {
    id: 2, titulo: "Senderismo por la Reserva Natural", descripcion: "Explora los senderos ecológicos del Suroeste Antioqueño.", contenido: "Recorrido guiado de 8 km por la Reserva Natural, atravesando bosques de niebla, cascadas y miradores con vistas panorámicas del Suroeste. Incluye guía certificado, refrigerio y seguro.", imagen: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600", fecha: "2026-03-22", categoria: "turistica", ubicacion: "Jardín, Antioquia"
  },
  {
    id: 3, titulo: "Taller de Cerámica Artesanal", descripcion: "Aprende técnicas ancestrales de cerámica de la región.", contenido: "Taller práctico de cerámica con técnicas heredadas de los artesanos del Suroeste. Los participantes aprenderán modelado, esmaltado y horneado para crear sus propias piezas.", imagen: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600", fecha: "2026-03-10", categoria: "recreativa", ubicacion: "Santa Bárbara, Antioquia"
  },
];

export const proyectos = [
  { id: 1, titulo: "Escuelas Digitales Rurales", descripcion: "Dotamos de tecnología y conectividad a escuelas rurales del Suroeste.", imagen: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600", estado: "activo", beneficiarios: 1200, presupuesto: "$450.000.000", progreso: 65 },
  { id: 2, titulo: "Huertas Comunitarias", descripcion: "Promovemos la soberanía alimentaria con huertas urbanas y rurales.", imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600", estado: "activo", beneficiarios: 800, presupuesto: "$180.000.000", progreso: 80 },
  { id: 3, titulo: "Emprendimiento Juvenil", descripcion: "Impulsamos ideas de negocio de jóvenes de la región.", imagen: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600", estado: "activo", beneficiarios: 350, presupuesto: "$220.000.000", progreso: 45 },
  { id: 4, titulo: "Agua Potable para Todos", descripcion: "Llevamos agua potable a veredas del Suroeste Antioqueño.", imagen: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600", estado: "finalizado", beneficiarios: 2500, presupuesto: "$680.000.000", progreso: 100 },
];

export const noticias = [
  { id: 1, titulo: "Se inauguró el Centro de Formación Digital en Andes", resumen: "El nuevo centro permitirá a más de 500 jóvenes acceder a formación tecnológica de calidad.", contenido: "Con la presencia del alcalde municipal y representantes de la Fundación Fomento, se inauguró oficialmente el Centro de Formación Digital en el municipio de Andes. Este espacio cuenta con 30 computadores de última generación, conectividad de alta velocidad y un equipo docente especializado en tecnologías de la información.", imagen: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600", fecha: "2026-02-15", autor: "Comunicaciones Fundación" },
  { id: 2, titulo: "Más de 200 familias beneficiadas con huertas comunitarias", resumen: "El proyecto de soberanía alimentaria sigue creciendo en el Suroeste.", contenido: "El programa de Huertas Comunitarias de la Fundación Fomento ha superado las expectativas, beneficiando a más de 200 familias en 5 municipios del Suroeste Antioqueño.", imagen: "https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600", fecha: "2026-02-10", autor: "Comunicaciones Fundación" },
  { id: 3, titulo: "Alianza estratégica con la Universidad de Antioquia", resumen: "Nueva alianza permitirá llevar programas universitarios a la región.", contenido: "La Fundación Fomento y la Universidad de Antioquia firmaron un convenio de cooperación para llevar programas de extensión universitaria al Suroeste Antioqueño.", imagen: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600", fecha: "2026-01-28", autor: "Comunicaciones Fundación" },
];

export const aliados = [
  { id: 1, nombre: "Gobernación de Antioquia", logo: "🏛️", url: "#" },
  { id: 2, nombre: "Universidad de Antioquia", logo: "🎓", url: "#" },
  { id: 3, nombre: "Cooperativa Cafetera", logo: "☕", url: "#" },
  { id: 4, nombre: "SENA Regional", logo: "📚", url: "#" },
  { id: 5, nombre: "Cámara de Comercio", logo: "🏢", url: "#" },
  { id: 6, nombre: "ONG Ambiente Vivo", logo: "🌿", url: "#" },
];

export const metricas = [
  { label: "Personas beneficiadas", valor: "5.200+", icono: "Users" },
  { label: "Proyectos activos", valor: "12", icono: "FolderOpen" },
  { label: "Municipios impactados", valor: "8", icono: "MapPin" },
  { label: "Aliados estratégicos", valor: "24", icono: "Handshake" },
];

export const mockUsers = [
  { id: "1", nombre: "Administrador", email: "admin@fundacionfomento.org", rol: "admin" },
  { id: "2", nombre: "María García", email: "empleado@fundacionfomento.org", rol: "empleado" },
  { id: "3", nombre: "Carlos Pérez", email: "donante@test.com", rol: "donante", telefono: "3001234567" },
  { id: "4", nombre: "Ana López", email: "ciudadano@test.com", rol: "ciudadano", telefono: "3009876543", municipio: "Andes" },
];

export const donaciones = [
  { id: 1, donante: "Carlos Pérez", monto: "$500.000", fecha: "2026-02-20", proyecto: "Escuelas Digitales Rurales", anonimo: false },
  { id: 2, donante: "Anónimo", monto: "$200.000", fecha: "2026-02-18", anonimo: true },
  { id: 3, donante: "Carlos Pérez", monto: "$1.000.000", fecha: "2026-01-15", proyecto: "Huertas Comunitarias", anonimo: false },
];
