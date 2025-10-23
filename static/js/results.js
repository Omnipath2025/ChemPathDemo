// ChemPath Results - Interactive Visualizations and Controls
let resultsData = null;
let charts = {};
let compoundsArray = [];

// ======================
// Data Loading
// ======================
function loadResults() {
    fetch('/api/simulation-status')
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                resultsData = data.results;
                compoundsArray = [...data.results.compounds];
                displayResults(data.results);
                initializeCharts(data.results);
            } else {
                document.querySelector('.results-subtitle').textContent = 'No results available. Please run a simulation first.';
            }
        })
        .catch(error => {
            console.error('Error loading results:', error);
            document.querySelector('.results-subtitle').textContent = 'Error loading results.';
        });
}

// ======================
// Display Results
// ======================
function displayResults(results) {
    // Update header
    document.getElementById('plantName').textContent = results.plant_name;
    document.getElementById('timestamp').textContent = 'Completed: ' + results.timestamp;

    // Update quick stats
    updateQuickStats(results);

    // Display compounds in card view
    displayCompoundsCards(compoundsArray);

    // Display compensation summary
    displayCompensationSummary(results);

    // Display key findings
    updateKeyFindings(results);
}

function updateQuickStats(results) {
    const metrics = results.performance_metrics;
    document.getElementById('quickSpeed').textContent = metrics.speed_improvement;
    document.getElementById('quickAccuracy').textContent = metrics.accuracy_enhancement;
    document.getElementById('quickCompounds').textContent = results.compounds.length;
    document.getElementById('quickCompensation').textContent = '$' + results.total_compensation.toFixed(2);
}

function displayCompoundsCards(compounds) {
    const container = document.getElementById('compoundsContainer');
    container.innerHTML = compounds.map((compound, index) => `
        <div class="compound-card" data-index="${index}">
            <div class="compound-header" onclick="toggleCompoundDetails(${index})">
                <div>
                    <h4>${compound.name}</h4>
                    <span class="confidence-badge">${compound.development_confidence}% confidence</span>
                </div>
                <span class="expand-icon" id="expandIcon${index}">▼</span>
            </div>
            <div class="compound-metrics">
                <div class="compound-metric">
                    <span class="label">QSAR Score:</span>
                    <span class="value">${compound.qsar_score} pIC50</span>
                </div>
                <div class="compound-metric">
                    <span class="label">Binding Affinity:</span>
                    <span class="value">${compound.binding_affinity} pKd</span>
                </div>
                <div class="compound-metric">
                    <span class="label">Bioavailability:</span>
                    <span class="value highlight">${compound.bioavailability}%</span>
                </div>
                <div class="compound-metric">
                    <span class="label">Improvement:</span>
                    <span class="value highlight">${compound.bioavailability_improvement}x</span>
                </div>
                <div class="compound-metric">
                    <span class="label">Safety Enhancement:</span>
                    <span class="value">${compound.safety_enhancement}</span>
                </div>
                <div class="compound-metric">
                    <span class="label">Synthesis:</span>
                    <span class="value">${compound.synthesis_pathway.toUpperCase()}</span>
                </div>
            </div>
            <div class="compound-details" id="details${index}" style="display: none;">
                <div class="detail-row">
                    <strong>Optimal Solvent:</strong> ${compound.optimal_solvent}
                </div>
                <div class="detail-row">
                    <strong>Enhancers:</strong> ${compound.enhancers.join(', ')}
                </div>
                <div class="detail-row">
                    <strong>Sustainability:</strong> ${compound.sustainability}
                </div>
                <div class="detail-row">
                    <strong>Cultural Preservation:</strong> ${compound.cultural_preservation}
                </div>
                ${compound.compensation ? `
                    <div class="compensation-info">
                        <strong>💰 EquiPath Compensation:</strong> $${compound.compensation.amount.toFixed(2)}
                        <br><small>Record ID: ${compound.compensation.record_id}</small>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function displayCompensationSummary(results) {
    document.getElementById('compensationSummary').innerHTML = `
        <div class="compensation-total">
            <div class="total-label">Total Compensation Distributed:</div>
            <div class="total-value">$${results.total_compensation.toFixed(2)}</div>
        </div>
        <div class="compensation-details">
            <p>✅ Privacy-preserving attribution via zero-knowledge proofs</p>
            <p>✅ Blockchain-ready compensation records generated</p>
            <p>✅ Traditional knowledge contributors protected and compensated</p>
            <p>✅ Cultural context preservation maintained throughout workflow</p>
        </div>
    `;
}

function updateKeyFindings(results) {
    const compounds = results.compounds;
    const avgBioavailability = compounds.reduce((sum, c) => sum + parseFloat(c.bioavailability), 0) / compounds.length;
    const avgCulturalPreservation = compounds.reduce((sum, c) => sum + parseFloat(c.cultural_preservation.split('/')[0]), 0) / compounds.length;

    document.getElementById('findingsGrid').innerHTML = `
        <div class="finding-card">
            <div class="finding-icon">🎯</div>
            <div class="finding-content">
                <h4>Bioavailability Enhancement</h4>
                <p>Average ${avgBioavailability.toFixed(1)}% bioavailability achieved through traditional preparations</p>
            </div>
        </div>
        <div class="finding-card">
            <div class="finding-icon">🌿</div>
            <div class="finding-content">
                <h4>Cultural Preservation</h4>
                <p>Average ${avgCulturalPreservation.toFixed(1)}/10 preservation score maintained across all compounds</p>
            </div>
        </div>
        <div class="finding-card">
            <div class="finding-icon">⚗️</div>
            <div class="finding-content">
                <h4>Synthesis Pathways</h4>
                <p>Optimized pathways balance efficiency with cultural integrity using hybrid approaches</p>
            </div>
        </div>
        <div class="finding-card">
            <div class="finding-icon">✅</div>
            <div class="finding-content">
                <h4>Safety Profile</h4>
                <p>Enhanced safety profiles through culturally-informed preparation methods</p>
            </div>
        </div>
    `;
}

// ======================
// Chart.js Visualizations
// ======================
function initializeCharts(results) {
    const compounds = results.compounds;

    // Overview Tab Charts
    createBioavailabilityChart(compounds);
    createConfidenceChart(compounds);

    // Comparison Tab Charts
    createRadarChart(compounds);
    createScatterChart(compounds);
    createSafetyChart(compounds);

    // Synthesis Tab Charts
    createSynthesisChart(compounds);
    createSustainabilityChart(compounds);

    // Compensation Tab Charts
    createCompensationChart(compounds);
    createCulturalChart(compounds);
}

function createBioavailabilityChart(compounds) {
    const ctx = document.getElementById('bioavailabilityChart').getContext('2d');
    charts.bioavailability = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: compounds.map(c => c.name),
            datasets: [{
                label: 'Bioavailability (%)',
                data: compounds.map(c => parseFloat(c.bioavailability)),
                backgroundColor: 'rgba(34, 197, 94, 0.7)',
                borderColor: 'rgba(34, 197, 94, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function createConfidenceChart(compounds) {
    const ctx = document.getElementById('confidenceChart').getContext('2d');
    charts.confidence = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: compounds.map(c => c.name),
            datasets: [{
                label: 'Development Confidence (%)',
                data: compounds.map(c => c.development_confidence),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                    'rgba(236, 72, 153, 0.7)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function createRadarChart(compounds) {
    const ctx = document.getElementById('radarChart').getContext('2d');

    const datasets = compounds.map((c, idx) => ({
        label: c.name,
        data: [
            parseFloat(c.qsar_score) * 10,
            parseFloat(c.binding_affinity) * 10,
            parseFloat(c.bioavailability),
            c.development_confidence,
            parseFloat(c.cultural_preservation.split('/')[0]) * 10
        ],
        backgroundColor: `rgba(${59 + idx * 50}, ${130 - idx * 20}, ${246 - idx * 50}, 0.2)`,
        borderColor: `rgba(${59 + idx * 50}, ${130 - idx * 20}, ${246 - idx * 50}, 1)`,
        borderWidth: 2
    }));

    charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['QSAR Score', 'Binding Affinity', 'Bioavailability', 'Confidence', 'Cultural Preservation'],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function createScatterChart(compounds) {
    const ctx = document.getElementById('scatterChart').getContext('2d');
    charts.scatter = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Compounds',
                data: compounds.map(c => ({
                    x: parseFloat(c.qsar_score),
                    y: parseFloat(c.binding_affinity),
                    label: c.name
                })),
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderColor: 'rgba(245, 158, 11, 1)',
                pointRadius: 8,
                pointHoverRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'QSAR Score (pIC50)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Binding Affinity (pKd)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw.label + ': (' + context.parsed.x + ', ' + context.parsed.y + ')';
                        }
                    }
                }
            }
        }
    });
}

function createSafetyChart(compounds) {
    const ctx = document.getElementById('safetyChart').getContext('2d');
    charts.safety = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: compounds.map(c => c.name),
            datasets: [{
                label: 'Safety Enhancement',
                data: compounds.map(c => parseFloat(c.safety_enhancement.replace('+', '').replace('%', ''))),
                backgroundColor: 'rgba(16, 185, 129, 0.7)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Safety Enhancement (%)'
                    }
                }
            }
        }
    });
}

function createSynthesisChart(compounds) {
    const ctx = document.getElementById('synthesisChart').getContext('2d');

    const pathwayCounts = {};
    compounds.forEach(c => {
        const pathway = c.synthesis_pathway;
        pathwayCounts[pathway] = (pathwayCounts[pathway] || 0) + 1;
    });

    charts.synthesis = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(pathwayCounts).map(p => p.toUpperCase()),
            datasets: [{
                data: Object.values(pathwayCounts),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(168, 85, 247, 0.7)',
                    'rgba(236, 72, 153, 0.7)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(236, 72, 153, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function createSustainabilityChart(compounds) {
    const ctx = document.getElementById('sustainabilityChart').getContext('2d');
    charts.sustainability = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: compounds.map(c => c.name),
            datasets: [
                {
                    label: 'Sustainability Score',
                    data: compounds.map(c => parseFloat(c.sustainability.split('/')[0])),
                    backgroundColor: 'rgba(34, 197, 94, 0.7)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Cultural Preservation',
                    data: compounds.map(c => parseFloat(c.cultural_preservation.split('/')[0])),
                    backgroundColor: 'rgba(168, 85, 247, 0.7)',
                    borderColor: 'rgba(168, 85, 247, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

function createCompensationChart(compounds) {
    const ctx = document.getElementById('compensationChart').getContext('2d');
    charts.compensation = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: compounds.map(c => c.name),
            datasets: [{
                label: 'Compensation ($)',
                data: compounds.map(c => c.compensation ? c.compensation.amount : 0),
                backgroundColor: 'rgba(245, 158, 11, 0.7)',
                borderColor: 'rgba(245, 158, 11, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

function createCulturalChart(compounds) {
    const ctx = document.getElementById('culturalChart').getContext('2d');
    charts.cultural = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: compounds.map(c => c.name),
            datasets: [{
                label: 'Cultural Preservation Score',
                data: compounds.map(c => parseFloat(c.cultural_preservation.split('/')[0])),
                backgroundColor: 'rgba(168, 85, 247, 0.2)',
                borderColor: 'rgba(168, 85, 247, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10
                }
            }
        }
    });
}

// ======================
// Interactive Controls
// ======================
function showViz(vizName) {
    // Hide all viz contents
    document.querySelectorAll('.viz-content').forEach(el => {
        el.classList.remove('active');
    });

    // Remove active from all tabs
    document.querySelectorAll('.viz-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected viz
    document.getElementById('viz-' + vizName).classList.add('active');

    // Activate selected tab
    event.target.classList.add('active');
}

function toggleCompoundDetails(index) {
    const details = document.getElementById('details' + index);
    const icon = document.getElementById('expandIcon' + index);

    if (details.style.display === 'none') {
        details.style.display = 'block';
        icon.textContent = '▲';
    } else {
        details.style.display = 'none';
        icon.textContent = '▼';
    }
}

function sortCompounds(sortBy) {
    switch(sortBy) {
        case 'bioavailability':
            compoundsArray.sort((a, b) => parseFloat(b.bioavailability) - parseFloat(a.bioavailability));
            break;
        case 'confidence':
            compoundsArray.sort((a, b) => b.development_confidence - a.development_confidence);
            break;
        case 'qsar':
            compoundsArray.sort((a, b) => parseFloat(b.qsar_score) - parseFloat(a.qsar_score));
            break;
        default:
            compoundsArray = [...resultsData.compounds];
    }
    displayCompoundsCards(compoundsArray);
}

function setView(viewType) {
    const cardsView = document.getElementById('compoundsContainer');
    const tableView = document.getElementById('tableView');
    const buttons = document.querySelectorAll('.view-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (viewType === 'cards') {
        cardsView.style.display = 'block';
        tableView.style.display = 'none';
    } else {
        cardsView.style.display = 'none';
        tableView.style.display = 'block';
        displayCompoundsTable(compoundsArray);
    }
}

function displayCompoundsTable(compounds) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = compounds.map((c, idx) => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td>${c.qsar_score} pIC50</td>
            <td>${c.binding_affinity} pKd</td>
            <td>${c.bioavailability}%</td>
            <td>${c.bioavailability_improvement}x</td>
            <td><span class="confidence-badge">${c.development_confidence}%</span></td>
            <td>
                <button class="btn-small" onclick="toggleCompoundDetails(${idx})">Details</button>
            </td>
        </tr>
    `).join('');
}

// ======================
// Export Functions
// ======================
function exportJSON() {
    fetch('/api/export-json')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'chempath_results.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showToast('JSON exported successfully!');
        })
        .catch(error => {
            console.error('Export error:', error);
            showToast('Error exporting JSON', 'error');
        });
}

function exportPDF() {
    showToast('Generating PDF report...');
    fetch('/api/export-pdf')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'chempath_report.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showToast('PDF report downloaded!');
        })
        .catch(error => {
            console.error('Export error:', error);
            showToast('Error generating PDF', 'error');
        });
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'ChemPath Simulation Results',
            text: 'Check out my ChemPath simulation results!',
            url: window.location.href
        }).then(() => {
            showToast('Results shared successfully!');
        }).catch(() => {
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!');
    }).catch(() => {
        showToast('Unable to share results', 'error');
    });
}

// ======================
// Toast Notifications
// ======================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;

    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// ======================
// Initialize on Load
// ======================
window.onload = function() {
    loadResults();

    // Activate tooltips
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = this.getAttribute('data-tooltip');
            showToast(tooltip, 'info');
        });
    });
};
