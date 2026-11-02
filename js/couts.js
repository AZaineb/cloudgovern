// ===== Page Coûts =====
import { resources, MONTHS, monthlyCosts } from "./data.js";
import { $, money, loadPref, savePref, startLive } from "./utils.js";
import { makeCostChart, updateChart } from "./charts.js";

// Services affichés (ordre et couleur) et regroupement des types
const SERVICES = {
  "Machines virtuelles": "#3b82f6",
  "AKS": "#ec4899",
  "Bases SQL": "#f59e0b",
  "Stockage": "#8b5cf6",
  "App Service": "#22c55e",
  "Réseau et autres": "#64748b",
};
const NAMES = {
  "Machine virtuelle": "Machines virtuelles",
  "Base SQL": "Bases SQL",
  "Réseau virtuel": "Réseau et autres",
  "Autre": "Réseau et autres",
};

let kind = loadPref("costChartType", "bar");   // type de graphique mémorisé
let costChart = null;

function drawChart() {
  if (costChart) costChart.destroy();
  costChart = makeCostChart($("#cost-chart"), kind, MONTHS, monthlyCosts());
}

function render() {
  // graphique des coûts
  if (!costChart) drawChart();
  else updateChart(costChart, MONTHS, monthlyCosts());

  // coût de chaque service
  const totals = {};
  Object.keys(SERVICES).forEach(function (name) { totals[name] = 0; });
  resources.forEach(function (r) {
    totals[NAMES[r.type] || r.type] += r.cost;
  });
  const max = Math.max.apply(null, Object.values(totals));

  let html = "";
  Object.keys(SERVICES).forEach(function (name) {
    html += '<div class="row-p"><p><span>' + name + "</span><span>" + money(totals[name]) + "</span></p>" +
      '<div class="progress"><div style="width:' + (totals[name] / max) * 100 + "%;background:" + SERVICES[name] + '"></div></div></div>';
  });
  $("#services").innerHTML = html;
}

// Choix du type de graphique (barres ou courbe)
$("#chart-type").value = kind;
$("#chart-type").addEventListener("change", function () {
  kind = $("#chart-type").value;
  savePref("costChartType", kind);
  drawChart();
});

startLive(render);
