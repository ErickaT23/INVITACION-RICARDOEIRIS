const $ = (s) => document.querySelector(s);

function getGuest() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || "guest";
  const data = window.currentGuest || null;
  return {
    id: String(data?.id || id),
    name: data?.name || "Invitado",
    passes: Math.max(1, Number(data?.passes || 1)),
    childPasses: Math.max(0, Number(data?.childPasses || 0)),
  };
}

function formatGuestSelectionLabel(adultCount, childCount) {
  const adults = Math.max(0, Number(adultCount) || 0);
  const children = Math.max(0, Number(childCount) || 0);

  if (children > 0 && adults > 0) {
    return `${adults} ${adults === 1 ? "adulto" : "adultos"} y ${children} ${children === 1 ? "nino" : "ninos"}`;
  }

  if (children > 0) {
    return `${children} ${children === 1 ? "nino" : "ninos"}`;
  }

  return `${adults} ${adults === 1 ? "adulto" : "adultos"}`;
}

function buildGuestSelectionOptions(guest) {
  const adultPasses = Math.max(1, Number(guest && guest.passes) || 1);
  const childPasses = Math.max(0, Number(guest && guest.childPasses) || 0);
  const options = [];

  for (let adults = 1; adults <= adultPasses; adults += 1) {
    options.push({
      value: adults,
      label: formatGuestSelectionLabel(adults, 0),
    });
  }

  for (let children = 1; children <= childPasses; children += 1) {
    options.push({
      value: adultPasses + children,
      label: formatGuestSelectionLabel(adultPasses, children),
    });
  }

  return options;
}

function splitConfirmedGuests(totalSelected, guest) {
  const total = Math.max(0, Number(totalSelected) || 0);
  const maxAdults = Math.max(1, Number(guest && guest.passes) || 1);
  const maxChildren = Math.max(0, Number(guest && guest.childPasses) || 0);
  const adults = Math.min(total, maxAdults);
  const children = Math.min(Math.max(0, total - adults), maxChildren);
  return { adults, children };
}

function ensureGuestSummaryEl(guestsWrap) {
  if (!guestsWrap) return null;
  let summaryEl = guestsWrap.querySelector(".rsvp-guest-summary");
  if (summaryEl) return summaryEl;

  summaryEl = document.createElement("p");
  summaryEl.className = "rsvp-choice-label rsvp-guest-summary";
  guestsWrap.appendChild(summaryEl);
  return summaryEl;
}

function updateGuestSummary(summaryEl, totalSelected, guest) {
  if (!summaryEl) return;
  const detail = splitConfirmedGuests(totalSelected, guest);
  summaryEl.textContent = `Asistiran: ${formatGuestSelectionLabel(detail.adults, detail.children)}`;
}

function keyFor(id) {
  return `rsvp_state_${id}`;
}

document.addEventListener("DOMContentLoaded", () => {
  let guest = getGuest();
  const eventId = window.config?.event?.defaultEventId || "joseandres-mariandrea-2026";
  const inputName = $("#rsvpNombre");
  const selectGuests = $("#rsvpGuests");
  const guestsWrap = $("#rsvpGuestsWrap");
  const btnYes = $("#btnRsvpSi");
  const btnNo = $("#btnRsvpNo");
  const btnConfirm = $("#btnConfirmarRsvp");
  const msg = $("#msgRsvp");
  const intro = $("#rsvpSection .rsvp-strong");
  const actions = $("#rsvpInline .rsvp-actions");
  const inlineBlock = $("#rsvpInline");
  const summaryEl = ensureGuestSummaryEl(guestsWrap);

  if (!inputName || !selectGuests || !guestsWrap || !btnYes || !btnNo || !btnConfirm || !msg || !intro) return;

  const renderGuestFields = () => {
    inputName.value = guest.name;
    selectGuests.innerHTML = "";
    const options = buildGuestSelectionOptions(guest);
    options.forEach((item) => {
      const option = document.createElement("option");
      option.value = String(item.value);
      option.textContent = item.label;
      selectGuests.appendChild(option);
    });
    updateGuestSummary(summaryEl, selectGuests.value || 1, guest);
  };

  renderGuestFields();

  window.addEventListener("guest:updated", () => {
    guest = getGuest();
    renderGuestFields();
  });

  let answer = null;

  const setActive = (type) => {
    btnYes.classList.toggle("is-active", type === "yes");
    btnNo.classList.toggle("is-active", type === "no");
  };

  const paintConfirmed = (state) => {
    answer = state.answer;
    setActive(answer);
    guestsWrap.style.display = answer === "yes" ? "block" : "none";
    if (answer === "yes") {
      selectGuests.value = String(state.guests || 1);
      updateGuestSummary(summaryEl, selectGuests.value || 1, guest);
    }
    btnYes.disabled = true;
    btnNo.disabled = true;
    btnConfirm.disabled = true;
    if (actions) actions.style.display = "none";
    btnConfirm.style.display = "none";
    guestsWrap.style.display = "none";
    if (inlineBlock) inlineBlock.style.display = "none";
    if (answer === "yes") {
      intro.style.display = "block";
      intro.textContent = "Gracias por haber completado el formulario de asistencia, y confirmar tu asistencia. Te vemos pronto en nuestra boda.";
      msg.style.display = "none";
      return;
    }

    intro.style.display = "block";
    intro.textContent = "Gracias por haber completado el formulario de asistencia, y lamentamos que no puedas acompañarnos. Te vamos a extrañar.";
    msg.style.display = "none";
  };

  const savedRaw = localStorage.getItem(keyFor(guest.id));
  if (savedRaw) {
    try {
      paintConfirmed(JSON.parse(savedRaw));
      return;
    } catch {
      localStorage.removeItem(keyFor(guest.id));
    }
  }

  btnYes.addEventListener("click", () => {
    answer = "yes";
    setActive("yes");
    guestsWrap.style.display = "block";
    updateGuestSummary(summaryEl, selectGuests.value || 1, guest);
  });

  btnNo.addEventListener("click", () => {
    answer = "no";
    setActive("no");
    guestsWrap.style.display = "none";
  });

  selectGuests.addEventListener("change", () => {
    updateGuestSummary(summaryEl, selectGuests.value || 1, guest);
  });

  btnConfirm.addEventListener("click", async () => {
    if (!answer) {
      msg.style.display = "block";
      msg.className = "rsvp-msg error";
      msg.textContent = "Por favor selecciona una opción para continuar.";
      return;
    }

    btnConfirm.disabled = true;

    const confirmedSplit = answer === "yes"
      ? splitConfirmedGuests(selectGuests.value || 1, guest)
      : { adults: 0, children: 0 };

    const state = {
      eventId,
      guestId: guest.id,
      guestName: guest.name,
      assignedPasses: guest.passes,
      assignedChildPasses: guest.childPasses,
      answer,
      guests: answer === "yes" ? Number(selectGuests.value || 1) : 0,
      adultsConfirmed: confirmedSplit.adults,
      childrenConfirmed: confirmedSplit.children,
      at: Date.now(),
      atLocal: new Date().toISOString(),
    };
    localStorage.setItem(keyFor(guest.id), JSON.stringify(state));

    try {
      const rsvpDB = window.RSVPDatabase;
      if (rsvpDB?.saveConfirmation) {
        await rsvpDB.saveConfirmation(eventId, {
          id: guest.id,
          nombre: guest.name,
          pasesAsignados: guest.passes,
          adultosConfirmados: confirmedSplit.adults,
          ninosConfirmados: confirmedSplit.children,
          respuesta: answer === "yes" ? "si" : "no",
          cantidadConfirmada: answer === "yes" ? Number(selectGuests.value || 1) : 0,
          fechaConfirmacion: Date.now(),
        });
      }
    } catch (error) {
      console.error(error);
      btnConfirm.disabled = false;
      msg.style.display = "block";
      msg.className = "rsvp-msg error";
      msg.textContent = error?.code === "RSVP_ALREADY_CONFIRMED"
        ? "Esta invitación ya fue confirmada anteriormente."
        : "Tu confirmación quedó guardada en este dispositivo. Revisa Firebase.";
      return;
    }

    paintConfirmed(state);
  });
});
