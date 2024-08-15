const versions =
    [
        {
            version: "1.1.4",
            date: "15/08/2024",
            changes: [
                "Incorporación de históricos Vault Storage a modo de backup de los históricos locales.",
                "Agregado de reproducción especial a cámaras de tipo Axxon, permitiendo dinamizar streaming.",
                "Modificación visual de header, incorporando degradé de la paleta de colores empleada.",
            ],
            bugs: [
                "Modificación en petición de históricos para agilizar el tiempo de respuesta.",
                "Ajuste en las notificaciones de nuevos mensajes para brindar una experiencia más realista.",
            ],
            // changesEnglish: [
            //     "Agregado de menú desplegable para históricos en módulo de Mapas, .",
            //     "Agregado de botones por día .",
            //     "Descarga .",
            //     "Optimización en el reproductor de streaming .",
            //     "Medidas de .",
            //     "Rediseño estético en colores de gráficos del módulo de .",
            //     "Agregado de filtro por tipo de cámaras en el módulo de Dashboard.",
            //     "Rediseño visual en pop-ups de .",
            // ]
        },
        {
            version: "1.1.3",
            date: "25/07/2024",
            changes: [
                "Rediseño de vista de cámaras en los módulos de Mapa, Análisis y Cuadrantes, como así también en Chat.",
                "Reestructuración visual de módulo de chat y mejoras visuales en SOS y Follow Me",
                "Rediseño de vista de más información de cámaras, quitando botones obsoletos y agregando funcionalidades más intuitivas",
                "Incorporación de componente de detección de placas (LPR) con data dinámica y con conexión a bases de datos para obtener resultados y gráficos.",
                "Reestructuración de pestaña de LPR en Dashboard.",
            ],
            bugs: [
                "Actualización de credenciales para vistas de mapas en la plataforma.",
                "Modificación en el diseño para evitar superposiciones de fondos blancos sobre cámaras.",
                "Validaciones para evitar colisiones por faltante de datos en pestañas de Dashboard.",
                "Validaciones por tipo de cámara para mostrar información más certera.",
            ],
            // changesEnglish: [
            //     "Agregado de menú desplegable para históricos en módulo de Mapas, .",
            //     "Agregado de botones por día .",
            //     "Descarga .",
            //     "Optimización en el reproductor de streaming .",
            //     "Medidas de .",
            //     "Rediseño estético en colores de gráficos del módulo de .",
            //     "Agregado de filtro por tipo de cámaras en el módulo de Dashboard.",
            //     "Rediseño visual en pop-ups de .",
            // ]
        },
        {
            version: "1.1.2",
            date: "02/10/2023",
            changes: [
                "Agregado de pestañas en GridCameraDisplay, en el apartado de historial.",
                "Pestaña de conexiones funcionando correctamente con información real traída desde backend.",
                "Rediseño visual en la presentación de la información en GridCameraDisplay para mejor experiencia visual.",
            ],
            bugs: [
                "Correcciones ortográficas en cámaras tanto en Análisis, Cuadrantes y Cámaras Internas.",
                "Rediseño visual para evitar tapar información en cámaras PTZ.",
                "Mejoras visuales en chat SOS y Seguimiento para mejor funcionamiento.",
            ],
            // changesEnglish: [
            //     "Agregado de menú desplegable para históricos en módulo de Mapas, .",
            //     "Agregado de botones por día .",
            //     "Descarga .",
            //     "Optimización en el reproductor de streaming .",
            //     "Medidas de .",
            //     "Rediseño estético en colores de gráficos del módulo de .",
            //     "Agregado de filtro por tipo de cámaras en el módulo de Dashboard.",
            //     "Rediseño visual en pop-ups de .",
            // ]
        },
        {
            version: "1.1.1",
            date: "05/09/2023",
            changes: [
                "Agregado de menú desplegable para históricos en módulo de Mapas, Análisis, Cuadrantes y Cámaras internas.",
                "Agregado de botones por día para facilitar búsqueda avanzada de históricos.",
                "Descarga de históricos Axxon cada 30 minutos.",
                "Mejoras de diseño en el reproductor de streaming HLS Axxon.",
                "Rediseño estético en colores de gráficos del módulo de Dashboard para una mejor experiencia visual.",
                "Agregado de filtro por tipo de cámaras en el módulo de Dashboard, en la pestaña de cámaras.",
                "Rediseño visual en pop-ups de cámaras en el módulo de Mapas.",
            ],
            bugs: [
                "Optimización en el reproductor de streaming HLS Axxon.",
                "Medidas de seguridad reforzadas en streaming HLS Axxon.",
                "Validación arreglada para muestra de botones de históricos en ventanas pop-up de cámaras en módulo de Mapas.",
            ],
            // changesEnglish: [
            //     "Agregado de menú desplegable para históricos en módulo de Mapas, .",
            //     "Agregado de botones por día .",
            //     "Descarga .",
            //     "Optimización en el reproductor de streaming .",
            //     "Medidas de .",
            //     "Rediseño estético en colores de gráficos del módulo de .",
            //     "Agregado de filtro por tipo de cámaras en el módulo de Dashboard.",
            //     "Rediseño visual en pop-ups de .",
            // ]
        },
    ];

export default versions;