// ---------------------------------------------------------------------------
// Firebase-Konfiguration für die AgeLan-Turnier-App.
//
// Diese Werte sind NICHT geheim (der Schutz kommt über die Datenbank-Regeln in
// der Firebase-Konsole, nicht über diesen Schlüssel).
//
// Solange hier noch die Platzhalter (DEIN_...) stehen, läuft die App im lokalen
// Test-Modus über firebase-mock.js: alle Daten bleiben nur in diesem Browser,
// aber der komplette Ablauf ist durchspielbar (auch über mehrere Tabs).
//
// Für den Live-Betrieb: Werte aus der Firebase-Konsole eintragen
// (Projekteinstellungen → "Meine Apps" → Web-App → SDK-Konfiguration).
// Schritt-für-Schritt-Anleitung: siehe FIREBASE-SETUP.md
// ---------------------------------------------------------------------------

// KLON: bewusst NICHT das Firebase-Projekt der Live-AgeLan (agelan-ab042) –
// sonst schriebe der Klon in Turniere und Bestellungen der laufenden LAN.
// Solange hier Platzhalter stehen, läuft der Klon im lokalen Test-Modus.
// Eigenes Projekt anlegen (FIREBASE-SETUP.md) und die Werte hier eintragen.
const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "DEIN_PROJEKT",
  storageBucket: "DEIN_PROJEKT.firebasestorage.app",
  messagingSenderId: "DEIN_SENDER",
  appId: "DEIN_APP_ID"
};

let db, auth;
const istPlatzhalterKonfig = !firebaseConfig.apiKey || firebaseConfig.apiKey.indexOf("DEIN_") === 0;

// ?mock=1 erzwingt den lokalen Test-Modus auch bei hinterlegtem Firebase-Projekt.
// Ohne diesen Schalter lässt sich nichts ausprobieren, ohne dabei in die echte
// Datenbank des laufenden Turniers zu schreiben.
const willTestModus = (function () {
  try {
    return /[?&]mock=1(?:&|$)/.test(window.location.search);
  } catch (e) {
    return false;
  }
})();

if (istPlatzhalterKonfig || willTestModus) {
  window.firebase = window.createFirebaseMock();
  window.__AGELAN_MOCK__ = true;
  console.warn("[AgeLan] Lokaler Test-Modus – Daten bleiben in diesem Browser.");
}

firebase.initializeApp(firebaseConfig);
db = firebase.database();
auth = firebase.auth();
