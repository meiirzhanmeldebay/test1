var clientixWidget;

clientixWidget = {
  head: document.getElementsByTagName('head')[0],
  load: function(options) {
    var script;
    this.options = options;
    if (typeof jQuery === 'undefined') {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js';
      script.onload = (function(_this) {
        return function() {
          return _this.addWidget.apply(_this);
        };
      })(this);
      this.head.appendChild(script);
    } else {
      this.addWidget();
    }
  },
  addWidget: function() {
    var script;
    console.log('jQuery downloaded');
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.options.baseUrl + '/js/online/clientixAppointmentWidget.js';
    script.onload = (function(_this) {
      return function() {
        return _this.runWidget.apply(_this);
      };
    })(this);
    this.head.appendChild(script);
  },
  runWidget: function() {
    console.log('clientixWidget downloaded');
    jQuery(document).clientixWidget(this.options);
  }
};
