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
   * Добавляет devicePixelRatio и animation (на мобилке анимация отключена).
   * Ярлыки datalabels не отключаются — остаются на всех графиках.
   * @param {object} options — опции Chart.js
   */
  function mergeChartOptions(options) {
    if (!options || typeof options !== 'object') return options;
    var o = Object.assign({}, options);
    o.devicePixelRatio = getDevicePixelRatio();
    o.animation = getAnimation();
    return o;
  }

  window.CallsChartEnv = {
    isNarrowMobile: isNarrowMobile,
    getDevicePixelRatio: getDevicePixelRatio,
    getAnimation: getAnimation,
    mergeChartOptions: mergeChartOptions
  };
})();
