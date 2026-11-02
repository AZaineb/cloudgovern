// ===== Page Abonnements =====
import { resources, SUBS, SUB_BUDGET, totalCost } from "./data.js";
import { $, money, startLive } from "./utils.js";

function render() {
  let html = "";
  SUBS.forEach(function (s) {
    const rows = resources.filter(function (r) { return r.subscription === s; });
    const cost = totalCost(rows);
    const pct = Math.round((cost / SUB_BUDGET[s]) * 100);

    // liste des groupes de ressources, sans doublons
    const groups = [];
    rows.forEach(function (r) {
      if (!groups.includes(r.group)) groups.push(r.group);
    });

    html += '<div class="card"><h2>' + s + "</h2>" +
      '<p class="mono">' + groups.sort().join(", ") + "</p>" +
      "<p>" + rows.length + " ressources</p>" +
      '<div class="row-p"><p><span>' + money(cost) + " sur " + money(SUB_BUDGET[s]) + "</span><span>" + pct + " %</span></p>" +
      '<div class="progress' + (pct > 88 ? " w" : "") + '"><div style="width:' + Math.min(pct, 100) + '%"></div></div></div></div>';
  });
  $("#subs").innerHTML = html;
}

startLive(render);
