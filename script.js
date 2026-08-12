// ===================== SCRIPT.JS (MODELO EDITORIAL) =====================
// ⚠️ IMPORTANTE: NO usar "$" porque rsvp.js ya lo usa.
// Usamos "$$" para evitar conflicto.
const $$ = (s) => document.querySelector(s);
const ENVELOPE_OPEN_DURATION = 850;

let isInvitationOpening = false;
let hasPendingMusicUnlock = false;

function unlockMusicOnNextInteraction() {
  if (hasPendingMusicUnlock) return;

  hasPendingMusicUnlock = true;

  const retryPlayback = () => {
    hasPendingMusicUnlock = false;
    document.removeEventListener("pointerdown", retryPlayback);
    document.removeEventListener("touchstart", retryPlayback);
    document.removeEventListener("click", retryPlayback);
    playWeddingMusic();
  };

  document.addEventListener("pointerdown", retryPlayback, { once: true });
  document.addEventListener("touchstart", retryPlayback, { once: true });
  document.addEventListener("click", retryPlayback, { once: true });
}

document.addEventListener("DOMContentLoaded", () => {
  // 1) Pintar invitado en portada (desde loads.js)
  paintGuestCard();
  window.addEventListener("guest:updated", paintGuestCard);

  // 2) Botón abrir invitación
  initMusicPlayer();

  const btnOpenInvite = $$("#btnOpenInvite");
  if (btnOpenInvite) {
    btnOpenInvite.addEventListener("click", openInvitation);
  }

  const seal = $$("#seal");
  if (seal) {
    seal.addEventListener("click", openInvitation);
  }

  // 3) Animaciones al hacer scroll
  initScrollReveal();

  initGoldReveal();

  // 4) Contador (cambia a tu fecha real)
  // Formato recomendado: YYYY-MM-DDT00:00:00-06:00 (Guatemala -06)
  initCountdown("2026-10-10T00:00:00-06:00");

  // 5) Foto separador rotativa (si existe el elemento)
  initRotatingSep([
    "images/G2.jpg",
    "images/G4.jpg",
    "images/G5.jpg",
    "images/G7.jpg",
  ]);

  initWeatherCard();
  initHotelSection();
});

/* ===================== INVITADO EN PORTADA ===================== */
function paintGuestCard() {
  const nameEl = $$("#guestCardName");
  const seatsEl = $$("#guestCardSeats");
  const seatsTxtEl = $$("#guestCardSeatsTxt");

  // Si no existen (por si aún no pegaste el HTML), no rompe
  if (!nameEl || !seatsEl) return;

  const g = window.currentGuest;

  if (g && g.name) {
    nameEl.textContent = g.name;
    const p = Number(g.passes || 1);
    seatsEl.textContent = String(p);
    if (seatsTxtEl) seatsTxtEl.textContent = p === 1 ? "lugar" : "lugares";
  } else {
    // Si entraste sin ?id=
    nameEl.textContent = "Nombre del invitado";
    seatsEl.textContent = "x";
    if (seatsTxtEl) seatsTxtEl.textContent = "lugares";
  }
}

/* ===================== ABRIR INVITACIÓN ===================== */
function openInvitation() {
  if (isInvitationOpening) return;

  const cover = $$("#cover");
  const main = $$("#invitation");
  const envelope = $$("#envelope");
  const seal = $$("#seal");
  const btnOpenInvite = $$("#btnOpenInvite");

  if (!cover || !main) return;

  isInvitationOpening = true;

  if (seal) seal.disabled = true;
  if (btnOpenInvite) btnOpenInvite.disabled = true;

  playWeddingMusic();

  envelope?.classList.add("is-opening");
  cover.classList.add("is-opening");

  cover.classList.add("is-hidden");
  cover.style.display = "none";

  main.classList.add("is-open");
  main.setAttribute("aria-hidden", "false");

  main.querySelectorAll(".fade-in-element").forEach((el) => {
    el.classList.add("is-visible");
    el.classList.add("visible");
  });
}

/* ===================== MÚSICA ===================== */
function initMusicPlayer() {
  const audio = $$("#weddingMusic");
  const bubble = $$("#musicBubble");
  const playPauseButton = $$("#playPauseButton");
  const playPauseIcon = $$("#iconoPlayPause");
  const musicTitle = $$("#musicTitle");
  const progressBar = $$("#progress-bar");
  const currentTime = $$("#current-time");
  const durationTime = $$("#duration-time");
  if (!audio) return;

  const configuredTrack = window.config?.musica?.archivo?.trim();
  if (configuredTrack) {
    audio.src = configuredTrack;
  }

  if (musicTitle && window.config?.musica?.titulo) {
    musicTitle.textContent = window.config.musica.titulo;
  }

  audio.loop = true;

  const formatTime = (seconds) => {
    const safeSeconds = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const syncProgress = () => {
    if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
    if (durationTime) durationTime.textContent = formatTime(audio.duration);

    if (!progressBar) return;
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
    progressBar.value = duration ? String(Math.round((audio.currentTime / duration) * 100)) : "0";
  };

  const syncPlayerState = (isPlaying) => {
    setMusicBubbleState(isPlaying);

    if (playPauseButton) {
      playPauseButton.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
      playPauseButton.setAttribute("aria-pressed", String(isPlaying));
    }

    if (playPauseIcon) {
      playPauseIcon.className = `fas ${isPlaying ? "fa-pause" : "fa-play"}`;
    }
  };

  const toggleMusic = async () => {
    if (audio.paused) {
      try {
        await audio.play();
        if (bubble) bubble.hidden = false;
        syncPlayerState(true);
      } catch {
        if (bubble) bubble.hidden = false;
        syncPlayerState(false);
      }
      return;
    }

    audio.pause();
    syncPlayerState(false);
  };

  bubble?.addEventListener("click", toggleMusic);
  playPauseButton?.addEventListener("click", toggleMusic);
  progressBar?.addEventListener("input", () => {
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0;
    if (!duration) return;
    audio.currentTime = (Number(progressBar.value) / 100) * duration;
    syncProgress();
  });
  audio.addEventListener("play", () => syncPlayerState(true));
  audio.addEventListener("pause", () => syncPlayerState(false));
  audio.addEventListener("timeupdate", syncProgress);
  audio.addEventListener("loadedmetadata", syncProgress);
  audio.addEventListener("durationchange", syncProgress);
  syncPlayerState(!audio.paused);
  syncProgress();
}

function playWeddingMusic() {
  const audio = $$("#weddingMusic");
  const bubble = $$("#musicBubble");
  if (!audio) return;

  audio.loop = true;

  if (!audio.paused) {
    if (bubble) {
      bubble.hidden = false;
      setMusicBubbleState(true);
    }
    return;
  }

  if (bubble) {
    bubble.hidden = false;
  }

  const playPromise = audio.play();
  if (!playPromise || typeof playPromise.then !== "function") {
    setMusicBubbleState(!audio.paused);
    return;
  }

  playPromise
    .then(() => {
      setMusicBubbleState(true);
    })
    .catch((error) => {
      if (bubble) bubble.hidden = false;
      setMusicBubbleState(false);
      unlockMusicOnNextInteraction();
      console.warn("No se pudo reproducir la musica de la invitacion.", error);
    });
}

function setMusicBubbleState(isPlaying) {
  const bubble = $$("#musicBubble");
  if (!bubble) return;

  bubble.classList.toggle("is-playing", isPlaying);
  bubble.setAttribute("aria-label", isPlaying ? "Pausar música" : "Reproducir música");
  bubble.setAttribute("aria-pressed", String(isPlaying));
  bubble.innerHTML = `<i class="fa-solid ${isPlaying ? "fa-pause" : "fa-play"}" aria-hidden="true"></i>`;
}

function initHotelSection() {
  const infoBox = document.getElementById("hotelInfoBox");
  const webLink = document.getElementById("hotelLinkWeb");
  const whatsappLink = document.getElementById("hotelLinkWhatsapp");
  const bookingLink = document.getElementById("hotelLinkBooking");
  const dotButtons = Array.from(document.querySelectorAll(".hotel-dot[data-hotel-index]"));
  if (!infoBox || !webLink || !whatsappLink || !bookingLink || dotButtons.length === 0) return;

  const introEl = infoBox.querySelector(".hotel-intro");
  const addressEl = infoBox.querySelector(".hotel-address");
  const distanceEl = infoBox.querySelector(".hotel-distance");
  const descriptionEl = infoBox.querySelector(".hotel-description");
  if (!introEl || !addressEl || !distanceEl || !descriptionEl) return;

  const hotels = [
    {
      intro: "Hotel Hilton",
      address: "Kilómetro 12.5 Carretera a El Salvador, Complejo East Vista Real, Zona 15, Ciudad de Guatemala",
      distance: "Distancia de 28 minutos al lugar del evento",
      description: "Puedes hacer tu reserva, por medio de alguno de estos canales:",
      web: "https://www.hilton.com/es/hotels/guallhh-hilton-guatemala-city/",
      whatsapp: "https://wa.me/50247709858",
      booking: "https://www.booking.com/Share-Ipf5uv",
    },
    {
      intro: "The Westin Camino Real",
      address: "14 Calle 0-20, Zona 10, Ciudad de Guatemala",
      distance: "Distancia de 40 minutos al lugar del evento",
      description: "Puedes hacer tu reserva, por medio de alguno de estos canales:",
      web: "https://www.marriott.com/es/hotels/guawi-the-westin-camino-real-guatemala/overview/",
      whatsapp: "https://wa.me/50242182974",
      booking: "https://www.booking.com/Share-KfIIrkb",
    },
    {
      intro: "Hotel Biltmore",
      address: "15 Calle 0-31, Zona 10, Ciudad de Guatemala",
      distance: "Distancia de 38 minutos al lugar del evento",
      description: "Puedes hacer tu reserva, por medio de alguno de estos canales:",
      web: "https://www.hotelbiltmore.com.gt/",
      whatsapp: "https://wa.me/50235656026",
      booking: "https://www.booking.com/Share-o8dbxi",
    },
    {
      intro: "Hotel Clarion Suites",
      address: "14 Calle 3-08, Zona 10, Ciudad de Guatemala",
      distance: "Distancia de 42 minutos al lugar del evento",
      description: "Puedes hacer tu reserva, por medio de alguno de estos canales:",
      web: "https://clarionguatemala.com/",
      whatsapp: "https://wa.me/50224213333",
      booking: "https://www.booking.com/Share-1s974J",
    },
  ];

  const renderHotel = (index) => {
    const hotel = hotels[index] || hotels[0];
    introEl.textContent = hotel.intro;
    addressEl.textContent = hotel.address;
    distanceEl.textContent = hotel.distance;
    descriptionEl.textContent = hotel.description;
    webLink.href = hotel.web;
    whatsappLink.href = hotel.whatsapp;
    bookingLink.href = hotel.booking;

    dotButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  dotButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderHotel(Number(button.dataset.hotelIndex || 0));
    });
  });

  renderHotel(0);
}

/* ===================== REVEAL AL SCROLL ===================== */
function initScrollReveal() {
  const els = document.querySelectorAll(".fade-in-element");
  if (!els || els.length === 0) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    },
    { threshold: 0.15 }
  );

  els.forEach((el) => obs.observe(el));
}

/* ================= Animar True Love ================= */
function initGoldReveal() {
  const el = document.querySelector(".reveal-gold");
  if (!el) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.5 }
  );

  obs.observe(el);
}

/* ===================== CONTADOR ===================== */
function initCountdown(targetISO) {
  const dEl = $$("#cdDays");
  const hEl = $$("#cdHours");
  const mEl = $$("#cdMins");
  const sEl = $$("#cdSecs");
  if (!dEl || !hEl || !mEl || !sEl) return;

  const target = new Date(targetISO).getTime();
  const pad2 = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const now = Date.now();
    let diff = target - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dEl.textContent = pad2(days);
    hEl.textContent = pad2(hours);
    mEl.textContent = pad2(mins);
    sEl.textContent = pad2(secs);
  };

  tick();
  setInterval(tick, 1000);
}

/* ===================== SEPARADOR ROTATIVO ===================== */
function initRotatingSep(images){

  const imgEl = document.getElementById("rotatingSepImg");
  if(!imgEl || !images || images.length === 0) return;

  let currentIndex = 0;

  function changeImage(){

    imgEl.style.opacity = 0;

    setTimeout(() => {

      currentIndex = (currentIndex + 1) % images.length;

      imgEl.src = images[currentIndex];

      imgEl.onload = () => {
        imgEl.style.opacity = 1;
      };

    }, 400);

  }

  setInterval(changeImage, 5000);
}

//contador
function initFlipCountdown(targetISO){
  const target = new Date(targetISO).getTime();
  const pad2 = (n) => String(n).padStart(2, "0");

  const setFlip = (flipEl, newValue) => {
    if (!flipEl) return;

    const top = flipEl.querySelector(".top .digit");
    const bottom = flipEl.querySelector(".bottom .digit");
    const topFlip = flipEl.querySelector(".top-flip .digit");
    const bottomFlip = flipEl.querySelector(".bottom-flip .digit");

    const current = top?.textContent ?? "00";
    if (current === newValue) return;

    topFlip.textContent = current;
    bottomFlip.textContent = newValue;

    bottom.textContent = newValue;

    flipEl.classList.add("is-flipping");

    setTimeout(() => { top.textContent = newValue; }, 650);
    setTimeout(() => { flipEl.classList.remove("is-flipping"); }, 1300);
  };

  const flipDays = document.getElementById("flipDays");
  const flipHours = document.getElementById("flipHours");
  const flipMins = document.getElementById("flipMins");
  const flipSecs = document.getElementById("flipSecs");

  const initVal = (el, v) => {
    if (!el) return;
    el.querySelector(".top .digit").textContent = v;
    el.querySelector(".bottom .digit").textContent = v;
    el.querySelector(".top-flip .digit").textContent = v;
    el.querySelector(".bottom-flip .digit").textContent = v;
  };

  initVal(flipDays, "00");
  initVal(flipHours, "00");
  initVal(flipMins, "00");
  initVal(flipSecs, "00");

  const tick = () => {
    const now = Date.now();
    let diff = target - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins = Math.floor((diff / (1000*60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    setFlip(flipDays, pad2(days));
    setFlip(flipHours, pad2(hours));
    setFlip(flipMins, pad2(mins));
    setFlip(flipSecs, pad2(secs));
  };

  tick();
  setInterval(tick, 1000);
}

//animaciones
// ================= ANIMACIONES POR SECCIÓN (AUTO) =================
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  if (!("IntersectionObserver" in window)) {
    sections.forEach((s) => s.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  sections.forEach((s) => io.observe(s));
});

// ================= GIFTS POPUPS =================
document.addEventListener("DOMContentLoaded", () => {
  const btnOpen = document.getElementById("btnVerCuentas");
  const accountsBackdrop = document.getElementById("accountsBackdrop");
  const accountDetailBackdrop = document.getElementById("accountDetailBackdrop");
  const btnCloseAccounts = document.getElementById("btnCloseAccounts");
  const btnCloseAccountDetail = document.getElementById("btnCloseAccountDetail");
  const btnCuentaNovio = document.getElementById("btnCuentaNovio");
  const btnCuentaNovia = document.getElementById("btnCuentaNovia");
  const detailTitle = document.getElementById("accountDetailTitle");
  const detailInfo = document.getElementById("accountDetailInfo");
  const btnCopyAccountDetail = document.getElementById("btnCopyAccountDetail");

  const openModal = (el) => {
    if (!el) return;
    el.style.display = "flex";
    el.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => el.classList.add("is-open"));
  };

  const closeModal = (el) => {
    if (!el) return;
    el.classList.remove("is-open");
    setTimeout(() => {
      el.style.display = "none";
      el.setAttribute("aria-hidden", "true");
    }, 260);
  };

  const renderAccount = (title, owner, bank, type, number) => {
    if (!detailTitle || !detailInfo) return;
    detailTitle.textContent = title;
    detailInfo.innerHTML = `
      <p><strong>Nombre:</strong> ${owner}</p>
      <p><strong>Banco:</strong> ${bank}</p>
      <p><strong>Tipo:</strong> ${type}</p>
      <p><strong>No.:</strong> ${number}</p>
    `;
    detailInfo.dataset.copy = `Nombre: ${owner}\nBanco: ${bank}\nTipo: ${type}\nNo.: ${number}`;
    closeModal(accountsBackdrop);
    openModal(accountDetailBackdrop);
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  };

  if (btnOpen) btnOpen.addEventListener("click", () => openModal(accountsBackdrop));
  if (btnCloseAccounts) btnCloseAccounts.addEventListener("click", () => closeModal(accountsBackdrop));
  if (btnCloseAccountDetail) btnCloseAccountDetail.addEventListener("click", () => closeModal(accountDetailBackdrop));

  if (accountsBackdrop) {
    accountsBackdrop.addEventListener("click", (e) => {
      if (e.target === accountsBackdrop) closeModal(accountsBackdrop);
    });
  }

  if (accountDetailBackdrop) {
    accountDetailBackdrop.addEventListener("click", (e) => {
      if (e.target === accountDetailBackdrop) closeModal(accountDetailBackdrop);
    });
  }

  if (btnCuentaNovio) {
    btnCuentaNovio.addEventListener("click", () => {
        renderAccount(
          "Cuenta Ricardo",
          "Ricardo Velasquez",
          "Banco Industrial",
          "Monetaria",
          "12345678"
        );
    });
  }

  if (btnCuentaNovia) {
    btnCuentaNovia.addEventListener("click", () => {
        renderAccount(
          "Cuenta Iris",
          "Iris Lopez",
          "Banco G&T Continental",
          "Ahorro",
          "12345678"
        );
    });
  }

  if (btnCopyAccountDetail) {
    btnCopyAccountDetail.addEventListener("click", async () => {
      const text = detailInfo?.dataset.copy || "";
      if (!text) return;
      try {
        await copyText(text);
        btnCopyAccountDetail.textContent = "Copiado";
        setTimeout(() => {
          btnCopyAccountDetail.textContent = "Copiar datos";
        }, 1200);
      } catch {
        btnCopyAccountDetail.textContent = "No se pudo copiar";
        setTimeout(() => {
          btnCopyAccountDetail.textContent = "Copiar datos";
        }, 1200);
      }
    });
  }
});

function initWeatherCard() {
  const tempEl = document.getElementById("weatherTemp");
  const stateEl = document.getElementById("weatherState");
  const maxEl = document.getElementById("weatherMax");
  const minEl = document.getElementById("weatherMin");
  const rainEl = document.getElementById("weatherRain");
  const iconEl = document.getElementById("weatherIcon");
  const sourceEl = document.getElementById("weatherSource");

  if (!tempEl || !stateEl || !maxEl || !minEl || !rainEl || !iconEl) return;

  const sourceUrl = "https://weather.com/es-BO/weather/monthly/l/GTXX1866:1:GT";
  if (sourceEl) sourceEl.href = sourceUrl;

  const WEATHER_ICONS = {
    sun: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="11" stroke="currentColor" stroke-width="2.8"/><path d="M32 8V15" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M32 49V56" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M8 32H15" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M49 32H56" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M15.03 15.03L19.98 19.98" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M44.02 44.02L48.97 48.97" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M15.03 48.97L19.98 44.02" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M44.02 19.98L48.97 15.03" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>',
    cloud: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 49H46C52.0751 49 57 44.0751 57 38C57 31.9249 52.0751 27 46 27C45.5962 27 45.1975 27.0218 44.805 27.0642C42.9934 20.6538 37.1022 16 30.125 16C21.7007 16 14.875 22.8257 14.875 31.25C14.875 31.6098 14.8875 31.9667 14.912 32.3201C10.2645 33.8551 7 38.2352 7 43.375C7 46.4826 8.23839 49 19 49Z" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/></svg>',
    rain: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 42H46C51.5228 42 56 37.5228 56 32C56 26.4772 51.5228 22 46 22C45.6119 22 45.2289 22.0221 44.8525 22.065C43.1142 16.1925 37.6669 12 31.25 12C23.431 12 17.0938 18.3372 17.0938 26.1562C17.0938 26.5002 17.1063 26.8413 17.1312 27.179C12.9723 28.5898 10 32.5202 10 37.0625C10 39.8477 11.2072 42 20 42Z" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><path d="M24 47L21 53" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M34 47L31 53" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M44 47L41 53" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>'
  };

  const getWeatherVisual = (code) => {
    if ([0, 1].includes(code)) return { label: "Soleado", icon: WEATHER_ICONS.sun };
    if ([2, 3, 45, 48].includes(code)) return { label: "Nublado", icon: WEATHER_ICONS.cloud };
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { label: "Lluvias", icon: WEATHER_ICONS.rain };
    return { label: "Variable", icon: WEATHER_ICONS.cloud };
  };

  fetch("https://api.open-meteo.com/v1/forecast?latitude=14.5542592&longitude=-90.4750739&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto")
    .then((response) => response.json())
    .then((data) => {
      const currentTemp = Math.round(Number(data?.current?.temperature_2m || 0));
      const maxTemp = Math.round(Number(data?.daily?.temperature_2m_max?.[0] || 0));
      const minTemp = Math.round(Number(data?.daily?.temperature_2m_min?.[0] || 0));
      const rainProb = Math.round(Number(data?.daily?.precipitation_probability_max?.[0] || 0));
      const visual = getWeatherVisual(Number(data?.current?.weather_code));

      tempEl.textContent = `${currentTemp}°C`;
      stateEl.textContent = visual.label;
      maxEl.textContent = `${maxTemp}°C`;
      minEl.textContent = `${minTemp}°C`;
      rainEl.textContent = `${rainProb}%`;
      iconEl.innerHTML = visual.icon;
    })
    .catch(() => {
      stateEl.textContent = "Consulta el clima el mismo día por posibilidad de lluvias o calor.";
      iconEl.innerHTML = WEATHER_ICONS.cloud;
    });
}

function toggleDetails(forceOpen) {
  const dialog = document.getElementById("accountDetails");
  if (!dialog) return;

  const shouldOpen = typeof forceOpen === "boolean" ? forceOpen : !dialog.open;
  if (shouldOpen) {
    dialog.showModal();
    return;
  }

  dialog.close();
}

async function copyAccountInfo() {
  const detailText = document.getElementById("accountDetailsText")?.textContent?.trim();
  if (!detailText) return;

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(detailText);
  } else {
    const ta = document.createElement("textarea");
    ta.value = detailText;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  const copyButton = document.querySelector("#accountDetails button:last-of-type");
  if (!copyButton) return;

  const originalText = copyButton.textContent;
  copyButton.textContent = "COPIADO";
  setTimeout(() => {
    copyButton.textContent = originalText;
  }, 1200);
}

function changePhoto(img) {
  const mainPhoto = document.getElementById("main-photo");
  const modalPhoto = document.getElementById("main-photo-modal");
  if (!img || !mainPhoto || !modalPhoto) return;

  mainPhoto.src = img.src;
  mainPhoto.alt = img.alt || "Foto principal";
  modalPhoto.src = img.src;
  modalPhoto.alt = img.alt || "modal";
}

window.toggleDetails = toggleDetails;
window.copyAccountInfo = copyAccountInfo;
window.changePhoto = changePhoto;
