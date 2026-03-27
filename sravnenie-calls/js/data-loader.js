(function () {
  var bundledLoadPromise = null;

  function loadBundledScript() {
    if (bundledLoadPromise) return bundledLoadPromise;
    bundledLoadPromise = new Promise(function (resolve, reject) {
      if (typeof window.__CALLS_DASHBOARD_DATA === 'object' && window.__CALLS_DASHBOARD_DATA !== null) {
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = './data/bundled.js';
      s.async = true;
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        reject(new Error('Не удалось загрузить data/bundled.js'));
      };
      document.head.appendChild(s);
    });
    return bundledLoadPromise;
  }

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
      throw new Error(
        'Нет данных для «' + key + '». Проверьте, что в репозитории есть calls-dashboard/data/' + key + '.json'
      );
    }

    await loadBundledScript();
    var bundle = typeof window.__CALLS_DASHBOARD_DATA === 'object' ? window.__CALLS_DASHBOARD_DATA : null;
    if (bundle && bundle[key]) return JSON.parse(JSON.stringify(bundle[key]));
    throw new Error(
      'Нет данных для «' +
        key +
        '». Для file:// нужен data/bundled.js (запустите scripts/sync_calls_dashboard_data.py).'
    );
  }

  window.CallsDashboardData = {
    loadDailyData: loadDailyData
  };
})();
