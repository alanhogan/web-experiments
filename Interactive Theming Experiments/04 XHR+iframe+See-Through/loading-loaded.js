function _blogic_loaded() {
  var _blogic_hider = document.getElementById('_blogic_loading');
  _blogic_hider.parentNode.removeChild(_blogic_hider);
}

window.setTimeout(_blogic_loaded, 1000);