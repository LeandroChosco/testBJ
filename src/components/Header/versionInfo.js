const versions =
    [
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