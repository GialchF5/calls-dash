(function () {
  var YEAR = 2026;

  function pct(num, den) {
    return den ? (num / den) * 100 : 0;
  }
  var round0 = function (x) {
    return Math.round(x);
  };
  var round1 = function (x) {
    return Math.round(x * 10) / 10;
  };

  function ensureDerived(projectData) {
    for (var mi = 0; mi < 2; mi++) {
      var m = mi === 0 ? 'feb' : 'mar';
      var L = projectData[m] && projectData[m].leads ? projectData[m].leads : [];
      var C = projectData[m] && projectData[m].calls ? projectData[m].calls : [];
      var P = projectData[m] && projectData[m].presentations ? projectData[m].presentations : [];
      var Q = projectData[m] && projectData[m].qualified ? projectData[m].qualified : [];
      if (!projectData[m]) projectData[m] = {};
      projectData[m].contactPct = C.map(function (c, i) {
        return pct(c, L[i]);
      });
      projectData[m].presentationsPct = P.map(function (p, i) {
        return pct(p, L[i]);
      });
      projectData[m].qualifiedPct = Q.map(function (q, i) {
        return pct(q, L[i]);
      });
    }
    return projectData;
  }

  /**
   * Суммирует фев/мар по календарным дням из daily-data.
   * @returns {Record<string, { feb: object, mar: object }>}
   */
  function aggregateMonthTotals(data) {
    var projectNames = ['Сеосейлс', 'Kineiro', 'Урман Билд'];
    var out = {};
    for (var pi = 0; pi < projectNames.length; pi++) {
      var projName = projectNames[pi];
      var raw = data.projects && data.projects[projName] ? data.projects[projName] : {};
      var pd = ensureDerived(JSON.parse(JSON.stringify(raw)));
      out[projName] = { feb: {}, mar: {} };
      for (var mi = 0; mi < 2; mi++) {
        var monthKey = mi === 0 ? 'feb' : 'mar';
        var monthIndex = monthKey === 'feb' ? 1 : 2;
        var s = pd[monthKey];
        if (!s) continue;
        var leads = 0,
          calls = 0,
          presentations = 0,
          qualified = 0;
        var days = data.days || [];
        for (var i = 0; i < days.length; i++) {
          var dayNum = days[i];
          var dt = new Date(YEAR, monthIndex, dayNum);
          if (dt.getMonth() !== monthIndex) continue;
          leads += +s.leads[i] || 0;
          calls += +s.calls[i] || 0;
          presentations += +s.presentations[i] || 0;
          qualified += +s.qualified[i] || 0;
        }
        out[projName][monthKey] = {
          leads: leads,
          calls: calls,
          presentations: presentations,
          qualified: qualified,
          contactPct: round0(pct(calls, leads)),
          presentationsPct: round0(pct(presentations, leads)),
          qualifiedPct: round1(pct(qualified, leads))
        };
      }
    }
    return out;
  }

  window.CallsDashboardMonthAggregate = {
    aggregateMonthTotals: aggregateMonthTotals,
    PROJECTS: ['Сеосейлс', 'Kineiro', 'Урман Билд']
  };
})();
