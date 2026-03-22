(function () {
  function isNarrowMobile() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 640px)').matches;
  }

  function getDevicePixelRatio() {
    return Math.min(window.devicePixelRatio || 1, isNarrowMobile() ? 1.5 : 2);
  }

  function getAnimation() {
    return isNarrowMobile() ? false : { duration: 400 };
  }

  /**
   * Добавляет devicePixelRatio, animation и на мобилке отключает datalabels.
   * @param {object} options — опции Chart.js
   */
  function mergeChartOptions(options) {
    if (!options || typeof options !== 'object') return options;
    var o = Object.assign({}, options);
    o.devicePixelRatio = getDevicePixelRatio();
    o.animation = getAnimation();
    if (o.plugins && o.plugins.datalabels) {
      o.plugins = Object.assign({}, o.plugins);
      o.plugins.datalabels = Object.assign({}, options.plugins.datalabels);
      if (isNarrowMobile()) {
        o.plugins.datalabels.display = false;
      }
    }
    return o;
  }

  window.CallsChartEnv = {
    isNarrowMobile: isNarrowMobile,
    getDevicePixelRatio: getDevicePixelRatio,
    getAnimation: getAnimation,
    mergeChartOptions: mergeChartOptions
  };
})();
