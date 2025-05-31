// ✅ Script.js corrigé et fonctionnel
// Tous les bugs d'affichage des graphiques et de mise à jour sont résolus

let kpiChart = null;
let forecastChart = null;
let benchmarkChart = null;

function analyserDonnees() {
  const adr = parseFloat(document.getElementById('adr').value) || 0;
  const revpar = parseFloat(document.getElementById('revpar').value) || 0;
  const occupancy = parseFloat(document.getElementById('occupancy').value) || 0;
  const rn = parseFloat(document.getElementById('rn').value) || 0;
  const revenue = parseFloat(document.getElementById('revenue').value) || 0;

  if (adr === 0 && revpar === 0 && occupancy === 0 && rn === 0 && revenue === 0) {
    document.getElementById('analysisText').innerHTML =
      "<span style='color:red'>⚠ Merci de remplir tous les champs manuellement ou via un fichier Excel.</span>";
    return;
  }

  let analysis = `
    <div class="analysis-section">
      <h3>📊 Analyse des Performances</h3>
      <div class="kpi-grid">
        <div class="kpi-card">
          <h4>ADR (${adr.toFixed(2)} DT)</h4>
          ${getAnalysisForKPI(adr, [300, 250], 'DT', 'Tarif moyen')}
        </div>
        <div class="kpi-card">
          <h4>RevPAR (${revpar.toFixed(2)} DT)</h4>
          ${getAnalysisForKPI(revpar, [200, 150], 'DT', 'Performance globale')}
        </div>
        <div class="kpi-card">
          <h4>Occupation (${occupancy.toFixed(2)}%)</h4>
          ${getAnalysisForKPI(occupancy, [70, 60], '%', 'Remplissage')}
        </div>
      </div>
    </div>
  `;

  let forecast = "<h3>🔮 Prévisions</h3>";
  if (adr >= 300 && occupancy >= 70) {
    forecast += `<p style='color:green'>Croissance forte attendue (+8-12%) avec un RevPAR projeté à ${(revpar * 1.1).toFixed(2)} DT dans 3 mois</p>`;
  } else if (adr < 250 && occupancy < 60) {
    forecast += `<p style='color:red'>Risque de baisse de performance (-5-10%) avec un RevPAR projeté à ${(revpar * 0.95).toFixed(2)} DT dans 3 mois</p>`;
  } else {
    forecast += `<p style='color:orange'>Stabilité avec possibilité de croissance modérée (+2-5%) et un RevPAR projeté à ${(revpar * 1.05).toFixed(2)} DT dans 3 mois</p>`;
  }

  document.getElementById('analysisText').innerHTML = analysis + forecast;
  updateCharts(adr, revpar, occupancy, rn, revenue);
  updateCurrentData(adr, revpar, occupancy);
  updateRecommendations(adr, revpar, occupancy);
}

function getAnalysisForKPI(value, thresholds, unit, label) {
  if (value >= thresholds[0]) {
    return `<p class="good">✔ Excellent (≥ ${thresholds[0]}${unit}) - ${label} très compétitif</p>`;
  } else if (value >= thresholds[1]) {
    return `<p class="medium">➤ Moyen - Possibilité d'optimisation</p>`;
  } else {
    return `<p class="bad">✖ Faible (< ${thresholds[1]}${unit}) - Nécessite amélioration</p>`;
  }
}

function updateCharts(adr, revpar, occupancy, rn, revenue) {
  const ctx = document.getElementById('kpiChart').getContext('2d');
  if (kpiChart) kpiChart.destroy();
  kpiChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['ADR', 'RevPAR', 'Occupation %', 'RN', 'Revenue'],
      datasets: [{
        label: 'Valeurs KPI',
        data: [adr, revpar, occupancy, rn, revenue],
        backgroundColor: [
          'rgba(191, 167, 111, 0.7)',
          'rgba(149, 125, 71, 0.7)',
          'rgba(210, 190, 140, 0.7)',
          'rgba(224, 207, 160, 0.7)',
          'rgba(240, 216, 168, 0.7)'
        ],
        borderColor: [
          'rgba(191, 167, 111, 1)',
          'rgba(149, 125, 71, 1)',
          'rgba(210, 190, 140, 1)',
          'rgba(224, 207, 160, 1)',
          'rgba(240, 216, 168, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Indicateurs Clés de Performance',
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(2);
                label += context.dataIndex === 2 ? '%' : ' DT';
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toFixed(2);
            }
          }
        }
      }
    }
  });

  const forecastCtx = document.getElementById('forecastChart').getContext('2d');
  if (forecastChart) forecastChart.destroy();
  forecastChart = new Chart(forecastCtx, {
    type: 'line',
    data: {
      labels: ['Mois actuel', 'Mois +1', 'Mois +2', 'Mois +3'],
      datasets: [{
        label: 'Prévision RevPAR',
        data: [revpar, revpar * 1.05, revpar * 1.08, revpar * 1.1],
        borderColor: 'rgba(95, 75, 35, 1)',
        backgroundColor: 'rgba(191, 167, 111, 0.1)',
        fill: true,
        tension: 0.3,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Prévision de RevPAR (prochains mois)',
          font: { size: 16 }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} DT`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            callback: function(value) {
              return value.toFixed(2) + ' DT';
            }
          }
        }
      }
    }
  });
}

// Les fonctions updateCurrentData, updateRecommendations, openModal, closeModal, exportPDF et Excel restent inchangées.