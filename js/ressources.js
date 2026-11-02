// ===== Page Ressources : tri, filtres, recherche, export CSV =====
import { resources } from "./data.js";
import { $, loadPref, savePref, sortRows, renderTable, exportCSV, startLive } from "./utils.js";

const DEFAULTS = { key: "name", dir: "asc", sub: "", region: "", state: "", q: "" };

// Préférences retrouvées dans localStorage (tri, filtres, recherche)
const prefs = Object.assign({}, DEFAULTS, loadPref("ressources", {}));

const fields = {
  sub: $("#f-sub"),
  region: $("#f-region"),
  state: $("#f-state"),
  q: $("#search"),
};
let rows = [];

function render() {
  const q = prefs.q.toLowerCase();

  // 1. filtrer
  rows = resources.filter(function (r) {
    return (prefs.sub === "" || r.subscription === prefs.sub) &&
           (prefs.region === "" || r.region === prefs.region) &&
           (prefs.state === "" || r.state === prefs.state) &&
           r.name.includes(q);
  });

  // 2. trier puis afficher
  rows = sortRows(rows, prefs.key, prefs.dir);
  renderTable($("#rows"), rows);
  $("#count").textContent = rows.length + " / " + resources.length + " ressources";

  // 3. indiquer la colonne triée (flèche ▲ ▼ dans le CSS)
  document.querySelectorAll("th[data-col]").forEach(function (th) {
    let sort = "none";
    if (th.dataset.col === prefs.key) sort = prefs.dir === "asc" ? "ascending" : "descending";
    th.setAttribute("aria-sort", sort);
  });
}

function showPrefs() {
  Object.keys(fields).forEach(function (k) {
    fields[k].value = prefs[k];
  });
}

// Quand on change un filtre ou la recherche
Object.keys(fields).forEach(function (k) {
  fields[k].addEventListener("input", function () {
    prefs[k] = fields[k].value;
    savePref("ressources", prefs);
    render();
  });
});

// Quand on clique sur un titre de colonne
document.querySelectorAll("th[data-col] .sort").forEach(function (button) {
  button.addEventListener("click", function () {
    const key = button.parentElement.dataset.col;
    prefs.dir = prefs.key === key && prefs.dir === "asc" ? "desc" : "asc";
    prefs.key = key;
    savePref("ressources", prefs);
    render();
  });
});

$("#reset").addEventListener("click", function () {
  Object.assign(prefs, DEFAULTS);
  savePref("ressources", prefs);
  showPrefs();
  render();
});

$("#csv").addEventListener("click", function () {
  exportCSV(rows);
});

showPrefs();
startLive(render);
