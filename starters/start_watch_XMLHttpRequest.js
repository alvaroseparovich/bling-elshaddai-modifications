(function() {

  var origOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
    document.back.process(this);
    //console.log("capturado o XHR");
    });
  origOpen.apply(this, arguments);
  };
})();