(function (global) {
  'use strict';

  const METRIC_KEYS = [
    'leads',
    'qualified',
    'presentations',
    'skype',
    'calls',
    'crQualified',
    'crPresentations',
    'crSkype',
    'crCalls'
  ];

  function createEmptyStats() {
    return {
      leads: 0,
      qualified: 0,
      presentations: 0,
      skype: 0,
      calls: 0,
      crQualified: 0,
      crPresentations: 0,
      crSkype: 0,
      crCalls: 0,
      count: 0
    };
  }

  function addStats(acc, row) {
    acc.leads += row.leads;
    acc.qualified += row.qualified;
    acc.presentations += row.presentations;
    acc.skype += row.skype;
    acc.calls += row.calls;
    acc.crQualified += row.crQualified;
    acc.crPresentations += row.crPresentations;
    acc.crSkype += row.crSkype;
    acc.crCalls += row.crCalls;
    acc.count += 1;
  }

  function finalize(acc) {
    if (!acc.count) return acc;
    acc.crQualified = Math.round((acc.crQualified / acc.count) * 10) / 10;
    acc.crPresentations = Math.round((acc.crPresentations / acc.count) * 10) / 10;
    acc.crSkype = Math.round((acc.crSkype / acc.count) * 10) / 10;
    acc.crCalls = Math.round((acc.crCalls / acc.count) * 10) / 10;
    return acc;
  }

  function applyFilters(rows, filters) {
    return rows.filter(function (r) {
      return (!filters.project || filters.project === 'all' || r.project === filters.project) &&
        (!filters.month || filters.month === 'all' || r.month === filters.month) &&
        (!filters.source || filters.source === 'all' || r.source === filters.source) &&
        (!filters.role || filters.role === 'all' || r.role === filters.role);
    });
  }

  function groupBy(rows, key) {
    const map = {};
    rows.forEach(function (r) {
      const k = r[key];
      if (!map[k]) map[k] = createEmptyStats();
      addStats(map[k], r);
    });
    Object.keys(map).forEach(function (k) {
      finalize(map[k]);
    });
    return map;
  }

  function totals(rows) {
    const t = createEmptyStats();
    rows.forEach(function (r) { addStats(t, r); });
    return finalize(t);
  }

  global.QualAggregates = {
    METRIC_KEYS: METRIC_KEYS,
    applyFilters: applyFilters,
    groupBy: groupBy,
    totals: totals
  };
})(window);
