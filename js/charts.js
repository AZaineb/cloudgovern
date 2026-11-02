// ===== Graphiques avec Chart.js =====
// Chart.js est chargé par une balise <script> dans le HTML (objet global "Chart").
// Si le chargement échoue, les fonctions renvoient null et le reste de la page fonctionne.

if (typeof Chart !== "undefined") {
  Chart.defaults.color = "#94a3b8";
  Chart.defaults.font.family = "'IBM Plex Sans', Arial, sans-serif";
  // respect de prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) Chart.defaults.animation = false;
}

// Écrit la valeur au-dessus de chaque barre, comme dans la première version
const valueLabels = {
  id: "valueLabels",
  afterDatasetsDraw: function (chart) {
    const ctx = chart.ctx;
    const points = chart.getDatasetMeta(0).data;
    ctx.save();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "12px 'IBM Plex Sans', Arial, sans-serif";
    ctx.textAlign = "center";
    for (let i = 0; i < points.length; i++) {
      ctx.fillText(chart.data.datasets[0].data[i], points[i].x, points[i].y - 8);
    }
    ctx.restore();
  },
};

// Graphique des coûts : type = "bar" (barres) ou "line" (courbe)
export function makeCostChart(canvas, type, labels, values) {
  if (typeof Chart === "undefined") return null;
  return new Chart(canvas, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        label: "Coût mensuel ($)",
        data: values,
        backgroundColor: type === "bar" ? "#3b82f6" : "rgba(59,130,246,0.2)",
        borderColor: "#3b82f6",
        fill: type === "line",
        tension: 0.3,
        borderRadius: { topLeft: 6, topRight: 6 },
        borderSkipped: false,
        categoryPercentage: 1,
        barPercentage: 0.92,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 24 } },
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, border: { display: false } },
        y: { display: false, beginAtZero: true, suggestedMax: 7000 },
      },
    },
    plugins: [valueLabels],
  });
}

// Donut de répartition des ressources
export function makeTypeChart(canvas, labels, values, colors) {
  if (typeof Chart === "undefined") return null;
  return new Chart(canvas, {
    type: "doughnut",
    data: { labels: labels, datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: "44%", plugins: { legend: { display: false } } },
  });
}

export function updateChart(chart, labels, values) {
  if (!chart) return;
  chart.data.labels = labels;
  chart.data.datasets[0].data = values;
  chart.update();
}
