// ===========================================================================
// KLON: Im Einbett-Modus (iframe der AGE-LAN-Website) keine Emojis anzeigen –
// die Website kommt ohne aus, die App soll genauso ruhig aussehen.
//
// Statt jede Stelle im Code anzufassen, werden Emojis beim Anzeigen aus den
// Texten genommen (auch aus allem, was die App später nachzeichnet).
// ⚠️ Ausnahme: Besteht ein Element NUR aus einem Emoji (⚙️-, 🗑-, QR-Knopf …),
// bleibt es stehen – sonst wäre der Knopf leer und nicht mehr zu finden.
// ===========================================================================
(function () {
  if (!document.documentElement.classList.contains("eingebettet")) return;

  // Bildzeichen samt Variations-Selektor, Hautfarben, ZWJ-Folgen und Keycaps.
  var EMOJI = /(?:[\u{1F1E6}-\u{1F1FF}]{2}|(?:\p{Extended_Pictographic}|[0-9#*]️?⃣)(?:️|[\u{1F3FB}-\u{1F3FF}])?(?:‍\p{Extended_Pictographic}(?:️|[\u{1F3FB}-\u{1F3FF}])?)*)[  ]?/gu;
  var PRUEFEN = /\p{Extended_Pictographic}|⃣|[\u{1F1E6}-\u{1F1FF}]/u;
  var NICHT = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, OPTION: 0, CODE: 1, PRE: 1 };

  function nurEmoji(el) {
    var t = (el.textContent || "").replace(EMOJI, "").trim();
    return t === "";
  }

  function textKnoten(knoten) {
    var wert = knoten.nodeValue;
    if (!wert || !PRUEFEN.test(wert)) return;
    var eltern = knoten.parentElement;
    if (!eltern || NICHT[eltern.nodeName]) return;
    // Symbol-Knöpfe und -Marken behalten ihr Zeichen.
    var halter = eltern.closest("button, a, label, [role=button], [title]") || eltern;
    if (nurEmoji(halter)) return;
    var neu = wert.replace(EMOJI, "");
    // Wo das Emoji am Anfang stand, keine verwaiste Leerstelle zurücklassen.
    if (neu !== wert) knoten.nodeValue = /^\s/.test(wert) ? neu : neu.replace(/^\s+/, "");
  }

  function durchgehen(wurzel) {
    if (wurzel.nodeType === 3) { textKnoten(wurzel); return; }
    if (wurzel.nodeType !== 1 || NICHT[wurzel.nodeName]) return;
    var gang = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = gang.nextNode())) textKnoten(n);
  }

  function start() {
    durchgehen(document.body);
    new MutationObserver(function (aenderungen) {
      aenderungen.forEach(function (a) {
        if (a.type === "characterData") textKnoten(a.target);
        else a.addedNodes.forEach(durchgehen);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
