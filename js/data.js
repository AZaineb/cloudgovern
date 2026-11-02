// ===== Données fictives (toujours les mêmes à chaque chargement) =====
export const BUDGET = 7000;
export const SUBS = ["Production", "Développement", "Test"];
export const MONTHS = ["Mai", "Juin", "Juil.", "Août", "Sept.", "Oct."];

// Types de ressources : nombre, coût total du mois ($), libellé et couleur du graphique
export const TYPES = [
  { type: "Machine virtuelle", prefix: "vm",   count: 42, total: 1850, label: "Machines virtuelles", color: "#3b82f6" },
  { type: "Stockage",          prefix: "stg",  count: 31, total: 1100, label: "Stockage",            color: "#8b5cf6" },
  { type: "App Service",       prefix: "app",  count: 18, total: 780,  label: "App Service",         color: "#22c55e" },
  { type: "Base SQL",          prefix: "sql",  count: 14, total: 1290, label: "Bases SQL",           color: "#f59e0b" },
  { type: "Réseau virtuel",    prefix: "vnet", count: 12, total: 150,  label: "Réseaux",             color: "#06b6d4" },
  { type: "AKS",               prefix: "aks",  count: 6,  total: 640,  label: "AKS",                 color: "#ec4899" },
  { type: "Autre",             prefix: "svc",  count: 25, total: 640,  label: "Autres",              color: "#64748b" },
];

const REGIONS = ["West Europe", "North Europe", "France Central", "East US"];
const ROLES = ["web", "api", "batch", "data", "cache"];
const ENV_PATTERN = ["prod", "prod", "prod", "prod", "prod", "prod", "dev", "dev", "dev", "test"];

// Petit générateur de nombres au hasard, reproductible
let seed = 7;
function random() {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
}

export const resources = [];

TYPES.forEach(function (t, typeIndex) {
  // 1. des coûts au hasard dont la somme fait exactement le total du type
  const weights = [];
  let sum = 0;
  for (let i = 0; i < t.count; i++) {
    const w = 0.5 + random();
    weights.push(w);
    sum += w;
  }
  const costs = weights.map(function (w) {
    return Math.floor((w / sum) * t.total);
  });
  const done = costs.reduce(function (a, b) { return a + b; }, 0);
  costs[t.count - 1] += t.total - done;

  // 2. une ressource pour chaque coût
  for (let i = 0; i < t.count; i++) {
    const n = resources.length;
    const env = ENV_PATTERN[n % 10];
    const role = ROLES[i % 5];
    resources.push({
      name: t.prefix + "-" + role + "-" + env + "-" + String(i + 1).padStart(2, "0"),
      type: t.type,
      env: env,
      group: "rg-" + env + "-" + role,
      region: REGIONS[(n + typeIndex) % 4],
      state: "running",
      subscription: SUBS[["prod", "dev", "test"].indexOf(env)],
      cost: costs[i],
      ago: Math.floor(random() * 90),   // ancienneté en jours (pour "récentes")
    });
  }
});

// Quelques ressources en alerte au départ
resources[3].state = "warning";
resources[17].state = "warning";
resources[30].state = "stopped";

export function totalCost(rows) {
  rows = rows || resources;
  return rows.reduce(function (t, r) { return t + r.cost; }, 0);
}

export const SUB_BUDGET = {};
SUBS.forEach(function (s) {
  const cost = totalCost(resources.filter(function (r) { return r.subscription === s; }));
  SUB_BUDGET[s] = Math.ceil((cost * 1.12) / 50) * 50;
});

// 5 mois passés + le mois en cours (calculé à partir des ressources)
export function monthlyCosts() {
  return [4900, 5200, 5600, 5900, 6100, totalCost()];
}

// Nombre et coût de chaque type (pour le donut)
export function typeStats() {
  return TYPES.map(function (t) {
    const rows = resources.filter(function (r) { return r.type === t.type; });
    return { type: t.type, label: t.label, color: t.color, count: rows.length, cost: totalCost(rows) };
  });
}

// Simule l'évolution des données (appelée à chaque actualisation)
export function tick() {
  resources.forEach(function (r) {
    if (r.state === "running") r.cost = Math.max(1, Math.round(r.cost * (0.97 + Math.random() * 0.06)));
  });
  if (Math.random() < 0.3) {
    const r = resources[Math.floor(Math.random() * resources.length)];
    const states = ["running", "running", "warning", "stopped"];
    r.state = states[Math.floor(Math.random() * states.length)];
  }
}
