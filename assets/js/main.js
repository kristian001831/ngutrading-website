(function () {
  var yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  function getRemainingToMidnight() {
    var now = new Date();
    var end = new Date(now);
    end.setHours(23, 59, 59, 999);
    var diff = end.getTime() - now.getTime();
    if (diff < 0) diff = 0;
    var hours = Math.floor(diff / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);
    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  }

  function updateBonusTimers() {
    var timers = document.querySelectorAll('[data-bonus-countdown]');
    timers.forEach(function (el) {
      var rem = getRemainingToMidnight();
      el.textContent = rem.hours + ':' + rem.minutes + ':' + rem.seconds;
    });
  }

  if (document.querySelector('[data-bonus-countdown]')) {
    updateBonusTimers();
    setInterval(updateBonusTimers, 1000);
  }
})();
