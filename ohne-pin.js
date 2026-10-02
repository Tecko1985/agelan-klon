// ===========================================================================
// KLON: Keine Veranstalter-PINs mehr.
//
// Wer verwalten darf, steht am KONTO (Orga / Veranstalter auf der AGE-LAN-
// Website – eine feste Gruppe, die von LAN zu LAN bleibt). Die Teilnehmer
// wechseln je LAN und werden beim Check-in freigeschaltet.
//
// Die Datenbank-Struktur der App verlangt beim Anlegen trotzdem eine PIN.
// Deshalb: PIN-Felder ausblenden und beim Anlegen eine zufällige PIN eintragen,
// die niemand kennen muss. Verwaltet wird über das Konto (Firebase-Rolle).
//
// ⚠️ Das geht nur mit echtem Firebase: Im lokalen Test-Modus (Platzhalter in
// firebase-config.js) gibt es keine Rollen, die Verwaltung hängt dann am
// anlegenden Tab. Ohne PIN käme nach dem Schließen niemand mehr hinein –
// deshalb bleiben die PIN-Felder dort sichtbar und werden nicht vorbelegt.
// ===========================================================================
(function () {
  var NEU_PIN = ["neu-pin", "sk-neu-pin", "fr-neu-pin", "es-neu-pin"];
  var wurzel = document.documentElement;

  var stil = document.createElement("style");
  stil.textContent = [
    NEU_PIN.map(function (id) { return "html.pin-aus #" + id + ", html.pin-aus label[for=" + id + "], html.pin-aus #" + id + "-hinweis"; }).join(", "),
    "html.pin-aus #sk-admin-login, html.pin-aus #fr-admin-login, html.pin-aus #es-admin-login, html.pin-aus #admin-login, html.pin-aus #veranstalter-gate .notausgang",
  ].join(", ") + " { display: none !important; }";
  document.head.appendChild(stil);

  // Echtes Firebase eingetragen? (Globale aus firebase-config.js, wird später nachgeladen.)
  function echtesFirebase() {
    try {
      // eslint-disable-next-line no-undef
      return typeof istPlatzhalterKonfig !== "undefined" && !istPlatzhalterKonfig && !willTestModus;
    } catch (e) {
      return false;
    }
  }
  function pruefen() {
    var an = echtesFirebase();
    wurzel.classList.toggle("pin-aus", an);
    return an;
  }

  function zufallsPin() {
    var zeichen = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    var a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return Array.prototype.map.call(a, function (b) { return zeichen[b % zeichen.length]; }).join("");
  }

  // Vor jedem Klick/Enter (Capture-Phase, also VOR dem Anlegen-Handler der App)
  // leere PIN-Felder füllen – die App leert sie nach dem Anlegen wieder.
  function fuellen() {
    if (!pruefen()) return;
    NEU_PIN.forEach(function (id) {
      var feld = document.getElementById(id);
      if (feld && !feld.value) feld.value = zufallsPin();
    });
  }
  document.addEventListener("click", fuellen, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Enter") fuellen(); }, true);
  document.addEventListener("DOMContentLoaded", pruefen);
  window.addEventListener("load", pruefen);
})();
