(function () {
  var STORAGE_KEY = 'callsDashboardSource';

  function getSource() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      if (v === 'vk' || v === 'catalog') return v;
    } catch (_) {}
    return 'catalog';
  }

  function setSource(s) {
    if (s !== 'vk' && s !== 'catalog') return;
    try {
      localStorage.setItem(STORAGE_KEY, s);
    } catch (_) {}
  }

  /**
   * @param {HTMLSelectElement} selectEl
   * @param {(source: 'catalog'|'vk') => void} onChange
   */
  function bindSourceSelect(selectEl, onChange) {
    if (!selectEl) return;
    selectEl.value = getSource();
    selectEl.addEventListener('change', function () {
      var v = selectEl.value;
      if (v !== 'vk' && v !== 'catalog') return;
      setSource(v);
      if (typeof onChange === 'function') onChange(v);
    });
  }

  window.CallsDashboardSource = {
    STORAGE_KEY: STORAGE_KEY,
    getSource: getSource,
    setSource: setSource,
    bindSourceSelect: bindSourceSelect
  };
})();
