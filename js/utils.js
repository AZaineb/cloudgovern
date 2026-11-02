// ===== Fonctions utilisées par toutes les pages =====
import { tick } from "./data.js";

export function $(selector) {
  return document.querySelector(selector);
}

export function money(n) {
  return n.toLocaleString("fr-FR") + " $";
}

// ----- localStorage -----
export function loadPref(name, fallback) {
  try {
    const value = localStorage.getItem("cloudgovern:" + name);
    return value === null ? fallback : JSON.parse(value);
  } catch (e) {
    return fallback;
  }
}

export function savePref(name, value) {
  try {
    localStorage.setItem("cloudgovern:" + name, JSON.stringify(value));
  } catch (e) {
    // stockage indisponible : on ignore
  }
}

// ----- Badges -----
export const STATES = {
  running: ["ok", "En cours"],
  warning: ["warn", "Alerte"],
  stopped: ["danger", "Arrêtée"],
};

export function badgeHTML(cls, text) {
  return '<span class="badge ' + cls + '"><span class="dot"></span>' + text + "</span>";
}

export function badge(state) {
  return badgeHTML(STATES[state][0], STATES[state][1]);
}

// ----- Tableaux -----
export function sortRows(rows, key, dir) {
  const sign = dir === "asc" ? 1 : -1;
  return rows.slice().sort(function (a, b) {
    if (typeof a[key] === "number") return (a[key] - b[key]) * sign;
    return String(a[key]).localeCompare(String(b[key]), "fr") * sign;
  });
}

export function renderTable(tbody, rows) {
  let html = "";
  rows.forEach(function (r) {
    html += "<tr>" +
      '<td class="mono">' + r.name + "</td>" +
      "<td>" + r.type + "</td>" +
      '<td class="mono">' + r.group + "</td>" +
      "<td>" + r.region + "</td>" +
      "<td>" + badge(r.state) + "</td>" +
      '<td><span class="badge tag">' + r.env + "</span></td>" +
      "<td>" + money(r.cost) + "</td></tr>";
  });
  tbody.innerHTML = html || '<tr><td colspan="7">Aucune ressource ne correspond aux filtres.</td></tr>';
}

// Barre de budget : texte, pourcentage, largeur et couleur orange au-delà de 88 %
export function renderBudget(total, budget) {
  const pct = Math.round((total / budget) * 100);
  $("#budget-text").textContent = money(total) + " sur " + money(budget);
  $("#budget-pct").textContent = pct + " %";
  $("#budget-bar").classList.toggle("w", pct > 88);
  $("#budget-bar").firstElementChild.style.width = Math.min(pct, 100) + "%";
}

// Export CSV (séparateur ; pour qu'Excel lise bien les colonnes et les accents)
export function exportCSV(rows) {
  const lines = ["Nom;Type;Groupe de ressources;Région;État;Abonnement;Coût ($)"];
  rows.forEach(function (r) {
    lines.push([r.name, r.type, r.group, r.region, STATES[r.state][1], r.subscription, r.cost].join(";"));
  });
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ressources.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

// ----- Actualisation automatique : toutes les 5 secondes -----
export function startLive(render) {
  const box = $("#live");
  const stamp = $("#stamp");
  let timer = null;

  function refresh() {
    tick();
    render();
    stamp.textContent = "Mis à jour à " + new Date().toLocaleTimeString("fr-FR");
  }

  function apply() {
    clearInterval(timer);
    if (box.checked) timer = setInterval(refresh, 5000);
    savePref("live", box.checked);
  }

  box.checked = loadPref("live", true);   // préférence mémorisée
  box.addEventListener("change", apply);
  render();
  apply();
}
