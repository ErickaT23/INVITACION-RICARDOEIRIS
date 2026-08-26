// ===================== LOADS.JS =====================
// 1) Lista de invitados
const guests = [
  { id: "1", name: "Iris López", passes: 1, childPasses: 0 },
  { id: "2", name: "Maria Eugenia Salazar y Alba López", passes: 2, childPasses: 0 },
  { id: "3", name: "Luis Gonzáles y familia", passes: 5, childPasses: 0 },
  { id: "4", name: "Dinora Sánchez y Katherine López", passes: 1, childPasses: 0 },
  { id: "5", name: "Alex López y Familia", passes: 2, childPasses: 1 },
  { id: "6", name: "Rene López y Familia", passes: 4, childPasses: 0 },
  { id: "7", name: "Vinicio López y Familia", passes: 6, childPasses: 1 },
  { id: "8", name: "Oscar Rivera y Familia", passes: 2, childPasses: 2 },
  { id: "9", name: "Letty Salazar, Donely y familia", passes: 4, childPasses: 0 },
  { id: "10", name: "Kevin Mayen", passes: 1, childPasses: 0 },
  { id: "11", name: "Luisa Paniagua", passes: 1, childPasses: 0 },
  { id: "12", name: "Luis Javier y esposa", passes: 2, childPasses: 0 },
  { id: "13", name: "Guillermo Muñoz y esposa", passes: 2, childPasses: 0 },
  { id: "14", name: "Javier Manzilla y esposa", passes: 2, childPasses: 0 },
  { id: "15", name: "Monica Tejada", passes: 1, childPasses: 0 },
  { id: "16", name: "Monica Vilchis", passes: 1, childPasses: 0 },
  { id: "17", name: "Anayanci Velásquez y esposo", passes: 2, childPasses: 0 },
  { id: "18", name: "Mario Vela y esposa", passes: 2, childPasses: 0 },
  { id: "19", name: "Jorge Rodriguez y esposa", passes: 2, childPasses: 0 },
  { id: "20", name: "Farzam Sabetian", passes: 2, childPasses: 0 },
  { id: "21", name: "Maria Eugenia Salazar", passes: 1, childPasses: 0 },
  { id: "22", name: "Melannie Sandoval y esposo", passes: 2, childPasses: 0 },
  { id: "23", name: "Nicole Sandoval y esposa", passes: 2, childPasses: 0 },
  { id: "24", name: "Hector Cheung y esposa", passes: 2, childPasses: 0 },
  { id: "25", name: "Melisa Pineda", passes: 2, childPasses: 0 },
  { id: "26", name: "Vivian Oliva y esposo", passes: 2, childPasses: 0 },
  { id: "27", name: "Wendy Chew", passes: 2, childPasses: 0 },
  { id: "28", name: "Josue Arriola y esposa", passes: 2, childPasses: 0 },
  { id: "29", name: "Carlos García Bickford", passes: 2, childPasses: 0 },
  { id: "30", name: "Froilan Montero y esposa", passes: 2, childPasses: 0 },
  { id: "31", name: "Roger Mejias", passes: 1, childPasses: 0 },
  { id: "32", name: "Alejandra Barrantes", passes: 2, childPasses: 0 },
  { id: "33", name: "Cristina del Valle", passes: 1, childPasses: 0 },
  { id: "34", name: "Marjorie Bojorge", passes: 1, childPasses: 0 },
  { id: "35", name: "Alicia Escobar", passes: 2, childPasses: 0 },
  { id: "36", name: "Jessica Villagran", passes: 2, childPasses: 0 },
  { id: "37", name: "María Angélica Pablo", passes: 1, childPasses: 0 },
  { id: "38", name: "Yolanda Figueroa", passes: 1, childPasses: 0 },
  { id: "39", name: "Sandra Vásquez", passes: 1, childPasses: 0 },
  { id: "40", name: "Mayanin López y esposo", passes: 2, childPasses: 0 },
  { id: "41", name: "Anabela de Pineda y esposo", passes: 2, childPasses: 0 },
  { id: "42", name: "Lorena Ruano", passes: 1, childPasses: 0 },
  { id: "43", name: "Paty de Rosa y esposo", passes: 2, childPasses: 0 },
  { id: "44", name: "Esmeralda Villagran", passes: 1, childPasses: 0 },
  { id: "45", name: "Nidia Hernandez", passes: 1, childPasses: 0 },
  { id: "46", name: "Leticia Torres", passes: 1, childPasses: 0 },
  { id: "47", name: "Antonio Velásquez", passes: 4, childPasses: 0 },
  { id: "48", name: "Javier Bravo", passes: 2, childPasses: 0 },
  { id: "49", name: "Maynor Bravo", passes: 2, childPasses: 0 },
  { id: "50", name: "Belen Bravo", passes: 2, childPasses: 0 },
  { id: "51", name: "Mainor Bravo", passes: 2, childPasses: 0 },
  { id: "52", name: "Maria Fernanda Bravo y familia", passes: 2, childPasses: 1 },
  { id: "53", name: "Carlos Velásquez y Familia", passes: 5, childPasses: 0 },
  { id: "54", name: "Fernando Gomez y Esposa", passes: 2, childPasses: 0 },
  { id: "55", name: "Heber Molina", passes: 2, childPasses: 0 },
  { id: "56", name: "Jorge Villatoro", passes: 2, childPasses: 0 },
  { id: "57", name: "Miguel Angel Cardona y Esposa", passes: 2, childPasses: 0 },
  { id: "58", name: "Mario Mazariegoz", passes: 2, childPasses: 0 },
  { id: "59", name: "Miguel Minera", passes: 2, childPasses: 0 },
  { id: "60", name: "Byron Roldan y Esposa", passes: 2, childPasses: 0 },
  { id: "61", name: "Gustavo Moscoso", passes: 1, childPasses: 0 },
  { id: "62", name: "Laura Jocol", passes: 1, childPasses: 0 },
  { id: "63", name: "Erick Morales y Esposa", passes: 2, childPasses: 0 },
  { id: "64", name: "Carlos Trejo y Esposa", passes: 2, childPasses: 0 },
  { id: "65", name: "Pablo Arango", passes: 1, childPasses: 0 },
  { id: "66", name: "Diego Castañeda", passes: 2, childPasses: 0 },
  { id: "67", name: "Densyl Malin y Esposa", passes: 2, childPasses: 0 },
  { id: "68", name: "Rene Quiroa y Esposa", passes: 2, childPasses: 0 },
  { id: "69", name: "Aldo Barrios y Esposa", passes: 2, childPasses: 0 },
  { id: "70", name: "Antonio Escobar", passes: 1, childPasses: 0 },
  { id: "71", name: "Jose Ricardo Hernandez y Esposa", passes: 2, childPasses: 0 },
  { id: "72", name: "Andres Arbizu y Esposa", passes: 2, childPasses: 0 },
  { id: "73", name: "Carlos Sol y Esposa", passes: 2, childPasses: 0 },
  { id: "74", name: "Kelly Gonzáles", passes: 1, childPasses: 0 },
  { id: "75", name: "Alejandra Ponce", passes: 1, childPasses: 0 },
  { id: "76", name: "Benjamín Moreno", passes: 1, childPasses: 0 },
  { id: "77", name: "Julio Canizales", passes: 1, childPasses: 0 },
  { id: "78", name: "Ernesto Miranda y Esposa", passes: 2, childPasses: 0 },
  { id: "79", name: "Luis Rosales", passes: 1, childPasses: 0 },
  { id: "80", name: "Jose Fortin y esposa", passes: 2, childPasses: 0 },
  { id: "81", name: "Jorge Girón y Esposa", passes: 2, childPasses: 0 },
  { id: "82", name: "Estephanie Regalado", passes: 1, childPasses: 0 },
  { id: "83", name: "Anaite Rodríguez", passes: 1, childPasses: 0 },
  { id: "84", name: "Luis Muralles y Esposa", passes: 2, childPasses: 0 },
  { id: "85", name: "Helen González", passes: 1, childPasses: 0 },
  { id: "86", name: "Mildred Flores", passes: 1, childPasses: 0 },
  { id: "87", name: "Carmen Gutiérrez", passes: 1, childPasses: 0 },
  { id: "88", name: "Lesly Reyes", passes: 1, childPasses: 0 },
  { id: "89", name: "Lizeth Martínez", passes: 1, childPasses: 0 },
  { id: "90", name: "Jorge Villatoro y esposa", passes: 2, childPasses: 0 },
  { id: "91", name: "Oscar Arriola y esposa", passes: 2, childPasses: 0 },
  { id: "92", name: "Ervin Vasquez y esposa", passes: 2, childPasses: 0 },
  { id: "93", name: "Rodolio Godinez y esposa", passes: 2, childPasses: 0 },
  { id: "94", name: "Felix Illescas y Esposa", passes: 2, childPasses: 0 },
  { id: "95", name: "Fernando Wagner y Esposa", passes: 2, childPasses: 0 },
  { id: "96", name: "Mario Ordoñez y Esposa", passes: 2, childPasses: 0 },
  { id: "97", name: "Maria Fernanda Ávila y Esposo", passes: 2, childPasses: 0 },
  { id: "98", name: "Javier Barragán y familia", passes: 2, childPasses: 2 },
  { id: "99", name: "David Zetina", passes: 1, childPasses: 0 },
  { id: "100", name: "Astrid Aguilar y Esposo", passes: 2, childPasses: 0 },
];

window.guests = guests;
window.LocalGuestSeeds = {
  ...(window.LocalGuestSeeds || {}),
  "ricardo-iris-2026": guests.reduce((acc, guest) => {
    acc[String(guest.id)] = {
      id: String(guest.id),
      nombre: guest.name,
      pases: Number(guest.passes || 1),
      pasesNinos: Math.max(0, Number(guest.childPasses) || 0),
      activo: true,
    };
    return acc;
  }, {}),
};

window.seedEventGuestsToFirebase = async function seedEventGuestsToFirebase() {
  const eventId = window.config?.event?.defaultEventId || "ricardo-iris-2026";
  const rsvpDB = window.RSVPDatabase;
  if (!rsvpDB?.replaceInvitados) {
    console.warn("RSVPDatabase no esta disponible. Revisa que database.js este cargado.");
    return { ok: false, guests: 0 };
  }

  await rsvpDB.seedEventConfigToFirebase?.(eventId, { force: true });
  const result = await rsvpDB.replaceInvitados(
    eventId,
    guests.map((guest) => ({
      id: guest.id,
      nombre: guest.name,
      pases: guest.passes,
      pasesNinos: guest.childPasses,
      activo: true,
    }))
  );
  console.log(`Invitados reemplazados en Firebase: ${result.total || guests.length}`);
  return { ok: true, guests: result.total || guests.length };
};

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function notifyGuestUpdated() {
  window.dispatchEvent(new CustomEvent("guest:updated", { detail: window.currentGuest || null }));
}

function formatPassesText(adultPasses, childPasses) {
  const adults = Math.max(1, Number(adultPasses) || 1);
  const children = Math.max(0, Number(childPasses) || 0);
  let text = `${adults} ${adults === 1 ? "pase" : "pases"}`;
  if (children > 0) {
    text += ` + ${children} ${children === 1 ? "nino" : "ninos"}`;
  }
  return text;
}

function setCurrentGuest(guest) {
  if (!guest) {
    window.currentGuest = null;
    notifyGuestUpdated();
    return;
  }

  window.currentGuest = {
    id: String(guest.id),
    name: String(guest.name || guest.nombre || "Invitado").trim() || "Invitado",
    passes: Math.max(1, Number(guest.passes || guest.pases) || 1),
    childPasses: Math.max(0, Number(guest.childPasses || guest.pasesNinos) || 0),
  };

  const guestNameEl = document.getElementById("guest-name");
  const passesEl = document.getElementById("passes");

  if (guestNameEl) guestNameEl.textContent = window.currentGuest.name;
  if (passesEl) {
    passesEl.textContent = formatPassesText(window.currentGuest.passes, window.currentGuest.childPasses);
  }

  notifyGuestUpdated();
}

function waitForRSVPDatabase(timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = window.setInterval(() => {
      if (window.RSVPDatabase?.getInvitadoById) {
        window.clearInterval(timer);
        resolve(window.RSVPDatabase);
        return;
      }

      if (Date.now() - start > timeoutMs) {
        window.clearInterval(timer);
        reject(new Error("RSVPDatabase no disponible."));
      }
    }, 50);
  });
}

async function loadRemoteGuest(guestId) {
  try {
    const db = await waitForRSVPDatabase();
    const eventId = window.config?.event?.defaultEventId || "ricardo-iris-2026";
    const remoteGuest = await db.getInvitadoById(eventId, guestId);
    if (remoteGuest && remoteGuest.activo !== false) {
      setCurrentGuest(remoteGuest);
    }
  } catch (error) {
    console.warn("No se pudo cargar invitado remoto:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const guestId = getQueryParam("id");

  if (getQueryParam("seedGuests") === "1") {
    window.seedEventGuestsToFirebase();
  }

  if (!guestId) {
    setCurrentGuest(null);
    return;
  }

  const guest = guests.find((g) => String(g.id) === String(guestId));

  if (guest) {
    setCurrentGuest(guest);
    loadRemoteGuest(guestId);
  } else {
    setCurrentGuest(null);
    loadRemoteGuest(guestId);

    const guestNameEl = document.getElementById("guest-name");
    if (guestNameEl) guestNameEl.textContent = "Invitado no encontrado";
  }
});
