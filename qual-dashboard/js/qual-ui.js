(function (global) {
  'use strict';

  function fmtNum(value) {
    return Number(value || 0).toLocaleString('ru-RU');
  }

  function fmtPct(value) {
    return (Math.round(Number(value || 0) * 10) / 10).toString().replace('.', ',') + '%';
  }

  function optionsFromRows(rows, key) {
    return Array.from(new Set(rows.map((r) => r[key]))).sort(function (a, b) {
      return String(a).localeCompare(String(b), 'ru');
    });
  }

  function fillSelect(id, values, allLabel, includeAll) {
    const el = document.getElementById(id);
    const withAll = includeAll !== false;
    const opts = (withAll ? ['<option value="all">' + allLabel + '</option>'] : [])
      .concat(values.map((v) => '<option value="' + v + '">' + v + '</option>'));
    el.innerHTML = opts.join('');
  }

  function readFilters() {
    const projectEl = document.getElementById('projectSelect');
    const monthEl = document.getElementById('monthSelect');
    const sourceEl = document.getElementById('sourceSelect');
    const roleEl = document.getElementById('roleSelect');
    return {
      project: projectEl ? projectEl.value : 'all',
      month: monthEl ? monthEl.value : 'all',
      source: sourceEl ? sourceEl.value : 'all',
      role: roleEl ? roleEl.value : 'all'
    };
  }

  function bindFilters(onChange) {
    ['projectSelect', 'monthSelect', 'sourceSelect', 'roleSelect'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', onChange);
    });
  }

  function makeBaseChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#e5e7eb', font: { size: 11 } } },
        datalabels: {
          color: '#e5e7eb',
          anchor: 'end',
          align: 'end',
          offset: -2,
          font: { size: 10, weight: '600' },
          formatter: function (value) {
            return Number.isFinite(value) ? value.toLocaleString('ru-RU') : value;
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.95)',
          borderColor: 'rgba(55,65,81,1)',
          borderWidth: 1,
          titleColor: '#e5e7eb',
          bodyColor: '#e5e7eb',
          padding: 8
        }
      },
      scales: {
        x: { ticks: { color: '#9ca3af', font: { size: 11 } }, grid: { color: 'rgba(31,41,55,0.5)' } },
        y: { ticks: { color: '#9ca3af', font: { size: 11 } }, grid: { color: 'rgba(31,41,55,0.5)' } }
      }
    };
  }

  global.QualUi = {
    fmtNum: fmtNum,
    fmtPct: fmtPct,
    optionsFromRows: optionsFromRows,
    fillSelect: fillSelect,
    readFilters: readFilters,
    bindFilters: bindFilters,
    makeBaseChartOptions: makeBaseChartOptions
  };
})(window);
