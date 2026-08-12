const config = {
    event: {
        defaultEventId: "ricardo-iris-2026",
        eventIdParam: "eventId",
        legacyFallback: {
            read: false,
            write: false,
            subscribe: false
        }
    },

    admin: {
        adminKey: "twodesign123",
        keyParam: "key",
        legacyKeyParam: "admin"
    },

    seo: {
        titulo: "Ricardo e Iris | Boda 2026",
        descripcion: "Boda de Ricardo e Iris - 10 de octubre de 2026",
        autor: "Two Design"
    },

    pareja: {
        nombres: "Ricardo e Iris",
        fecha: "10-10-2026",
        fechaVisible: "10.10.2026"
    },

    musica: {
        titulo: "Calling You - Blue October",
        archivo: "music.mp3"
    },

    evento: {
        ceremonia: {
            titulo: "Ceremonia",
            lugar: "Monte San Francisco",
            hora: "4:00 PM",
            direccion: "Km. 15.5 Carretera a Piedra Parada, Santa Catarina Pinula, Cdad. de Guatemala",
            ubicacionUrl: "https://ul.waze.com/ul?venue_id=176619666.1766458801.2936630&overview=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
        },
        recepcion: {
            titulo: "Recepción",
            lugar: "Casa Nicolasa",
            hora: "6:00 PM",
            direccion: "San Jorge Muxbal, Cdad. de Guatemala",
            ubicacionUrl: "https://ul.waze.com/ul?venue_id=176685201.1766589871.2225917&overview=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
        }
    },

    textos: {
        mensajeInvitado: "Eres muy especial para nosotros",
        mensajePases: "Hemos reservado para ti {pases} lugares especiales"
    },

    footer: {
        hashtag: "#RicardoEIris",
        instagramUrl: "https://www.instagram.com/thetwodesign",
        facebookUrl: "https://www.facebook.com/thetwodesign",
        marcaTexto: "Diseño",
        marcaNombre: "Two Design",
        marcaUrl: "https://twodesign.com"
    }
};

window.config = config;
