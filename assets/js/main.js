(function () {
  var yearEls = document.querySelectorAll('[data-year]');
  yearEls.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
