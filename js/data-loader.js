(function () {
  /**
   * @param {'catalog'|'vk'} source
   * @returns {Promise<object>}
   */
  async function loadDailyData(source) {
    var key = source === 'vk' ? 'vk' : 'catalog';
    if (location.protocol !== 'file:') {
      try {
        var res = await fetch('./data/' + key + '.json', { cache: 'no-store' });
        if (res.ok) return await res.json();
      } catch (_) {}
    }
    var bundle = typeof window.__CALLS_DASHBOARD_DATA === 'object' ? window.__CALLS_DASHBOARD_DATA : null;
    if (bundle && bundle[key]) return JSON.parse(JSON.stringify(bundle[key]));
    throw new Error(
      'Нет данных для «' +
        key +
        '». Запустите scripts/sync_calls_dashboard_data.py и подключите data/bundled.js (для file://).'
    );
  }

  window.CallsDashboardData = {
    loadDailyData: loadDailyData
  };
})();
