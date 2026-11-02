// ===== Page Vue d'ensemble =====
import { resources, SUBS, BUDGET, MONTHS, monthlyCosts, totalCost, typeStats } from "./data.js";
import { $, money, badgeHTML, sortRows, renderTable, renderBudget, startLive } from "./utils.js";
import { makeCostChart, makeTypeChart, updateChart } from "./charts.js";

let costChart = null;
let typeChart = null;

function render() {
  // ----- Cartes KPI -----
  const vms = resources.filter(function (r) { return r.type === "Machine virtuelle"; });
  const vmsRunning = vms.filter(function (r) { return r.state === "running"; });
  const alerts = resources.filter(function (r) { return r.state !== "running"; });

  $("#k-res").textContent = resources.length;
  $("#k-sub").textContent = SUBS.length;
  $("#k-cost").textContent = money(totalCost());
  $("#k-vm").textContent = vmsRunning.length + " / " + vms.length;
  $("#k-alerts").textContent = alerts.length;

  // ----- Graphiques -----
  const stats = typeStats();
  const labels = stats.map(function (s) { return s.label; });
  const counts = stats.map(function (s) { return s.count; });
  const colors = stats.map(function (s) { return s.color; });

  if (!costChart) costChart = makeCostChart($("#cost-chart"), "bar", MONTHS, monthlyCosts());
  else updateChart(costChart, MONTHS, monthlyCosts());

  if (!typeChart) typeChart = makeTypeChart($("#type-chart"), labels, counts, colors);
  else updateChart(typeChart, labels, counts);

  let legend = "";
  stats.forEach(function (s) {
    legend += '<li><i style="background:' + s.color + '"></i>' + s.label + " " + s.count + "</li>";
  });
  $("#type-legend").innerHTML = legend;

  // ----- Tableau : les 6 ressources les plus récentes -----
  renderTable($("#rows"), sortRows(resources, "ago", "asc").slice(0, 6));

  // ----- Budget et alertes -----
  renderBudget(totalCost(), BUDGET);
  const time = new Date().toTimeString().slice(0, 5);
  let html = "";
  alerts.slice(0, 3).forEach(function (r) {
    if (r.state === "stopped") {
      html += "<li>" + badgeHTML("danger", "Critique") + "<span>" + r.name + " est arrêtée</span><time>" + time + "</time></li>";
    } else {
      html += "<li>" + badgeHTML("warn", "Moyenne") + "<span>" + r.name + " : CPU élevé</span><time>" + time + "</time></li>";
    }
  });
  html += "<li>" + badgeHTML("ok", "Info") + "<span>Sauvegarde nocturne terminée</span><time>03:00</time></li>";
  $("#alerts").innerHTML = html;
}

startLive(render);
