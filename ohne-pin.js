// ===========================================================================
// KLON: Keine Veranstalter-PINs mehr.
//
// Wer verwalten darf, steht am KONTO (Orga ⭐ / Veranstalter 🛠 auf der
// AGE-LAN-Website – eine feste Gruppe, die von LAN zu LAN bleibt). Die
// Teilnehmer wechseln je LAN und werden beim Check-in freigeschaltet.
//
// Die Datenbank-Struktur der App verlangt beim Anlegen trotzdem eine PIN.
// Deshalb: PIN-Felder ausblenden und beim Anlegen eine zufällige PIN eintragen,
// die niemand kennen muss. Verwaltet wird über das Konto (Firebase-Rolle bzw.
// auf dem anlegenden Gerät über die hostId).
// ===========================================================================
(function () {
  var NEU_PIN = ["neu-pin", "sk-neu-pin", "fr-neu-pin", "es-neu-pin"];

  var stil = document.createElement("style");
  stil.textContent = [
    NEU_PIN.map(function (id) { return "#" + id + ", label[for=" + id + "], #" + id + "-hinweis"; }).join(", "),
    "#sk-admin-login, #fr-admin-login, #es-admin-login, #admin-login, #veranstalter-gate .notausgang",
  ].join(", ") + " { display: none !important; }";
  document.head.appendChild(stil);

  function zufallsPin() {
    var zeichen = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    var a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return Array.prototype.map.call(a, function (b) { return zeichen[b % zeichen.length]; }).join("");
  }

  // Vor jedem Klick/Enter (Capture-Phase, also VOR dem Anlegen-Handler der App)
  // leere PIN-Felder füllen – die App leert sie nach dem Anlegen wieder.
  function fuellen() {
    NEU_PIN.forEach(function (id) {
      var feld = document.getElementById(id);
      if (feld && !feld.value) feld.value = zufallsPin();
    });
  }
  document.addEventListener("click", fuellen, true);
  document.addEventListener("keydown", function (e) { if (e.key === "Enter") fuellen(); }, true);
})();
