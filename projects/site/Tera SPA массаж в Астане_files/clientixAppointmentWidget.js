if (typeof Object.create !== "function") {
  Object.create = function(o) {
    return (function() {
      var F;
      F = function() {};
      F.prototype = o;
      return new F();
    })();
  };
}

(function($, win, doc) {
  "use strict";
  var clientixWidget;
  clientixWidget = {
    init: function(options, obj) {
      this.opt = $.extend({}, $.fn.clientixWidget["default"], options);
      this.doc = doc;
      this.obj = obj;
      this.win = win;
      this.$body = $('body');
      this.$doc = $(this.doc);
      this.$head = $('head');
      this.$html = $('html');
      this.$obj = $(this.obj);
      this.$win = $(this.win);
      this.Vars = {
        $iFrame: null,
        $style: null,
        $button: null,
        url: this.opt.baseUrl + this.opt.alias
      };
      this.run();
    },
    run: function() {
      if (this.opt.log) {
        console.groupCollapsed('clientixWidget');
      }
      this.__checkUrl((function(_this) {
        return function(status) {
          if (status !== 400) {
            if (!_this._checkIE()) {
              if (_this._checkOptions()) {
                _this.generateStyle();
                _this.generateButton();
                _this.setDOMEvents();
                _this.setIFrameEvents();
              }
            }
          }
        };
      })(this));
      if (this.opt.log) {
        console.groupEnd('clientixWidget');
      }
    },
    __checkUrl: function(cb) {
      $.ajax({
        url: this.Vars.url,
        dataType: 'text',
        type: 'GET',
        complete: function(xhr) {
          return cb.apply(this, [xhr.status]);
        }
      });
    },
    _checkIE: function() {
      if (this.doc.all && !this.win.atob) {
        return true;
      } else {
        return false;
      }
    },
    _checkOptions: function() {
      var result;
      if (this.opt.log) {
        console.groupCollapsed('checkOptions');
      }
      if (this.opt.log) {
        result = true;
      } else {
        result = false;
      }
      if (this.opt.log && this.opt.develop) {
        if (result) {
          console.info('options ok');
        } else {
          console.error('options not ok');
        }
      }
      if (this.opt.log) {
        console.groupEnd('checkOptions');
      }
      return result;
    },
    generateStyle: function() {
      if (this.opt.log) {
        console.groupCollapsed('uploadCss');
      }
      this.Vars.$style = $('<style id type="text/css"> #' + this.opt.widgetId + ' { z-index: 123456; display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: 0; } #clientixAppointmentButton { z-index: 12345; cursor: pointer; position: fixed; right: 100px; bottom: 30px; background: ' + this.opt.color + '; color: white; border: 1px solid white; border-radius: 0 8px 8px 8px; height: 50px; line-height: 50px; font-size: 20px; padding: 0 24px; } #clientixAppointmentButton:before { position: absolute; top: 3px; left: 3px; width: 10px; height: 10px; border-top: 1px solid white; border-left: 1px solid white; content: " "; } #clientixAppointmentButton:hover { opacity: .8; } #clientixAppointmentButton:hover:active { opacity: .6; } </style>');
      this.Vars.$style.appendTo(this.$head);
      if (this.opt.log && this.opt.develop) {
        if ($.contains(this.$head[0], this.Vars.$style[0])) {
          console.info('style generated:', this.Vars.$style);
        } else {
          console.error('style not generated', this.Vars.$style);
        }
      }
      if (this.opt.log) {
        console.groupEnd('checkOptions');
      }
      return this;
    },
    generateButton: function() {
      if (this.opt.log) {
        console.groupCollapsed('generateButton');
      }
      this.Vars.$button = $('<div id="clientixAppointmentButton">' + this.opt.text + '</div>');
      this.Vars.$button.appendTo(this.$body);
      if (this.opt.log) {
        console.groupEnd('generateButton');
      }
    },
    generateIFrame: function(params) {
      if (params == null) {
        params = [];
      }
      if (this.opt.log) {
        console.groupCollapsed('generateIFrame');
      }
      params.push('roistat_visit=' + this.getCookie('roistat_visit'));
      params = params.join('&');
      this.Vars.$iFrame = $('<iframe id="' + this.opt.widgetId + '" src="' + this.Vars.url + '?' + params + '" scrolling="no"></iframe>');
      this.Vars.$iFrame.appendTo(this.$body);
      if (this.opt.log && this.opt.develop) {
        if ($.contains(this.$body[0], this.Vars.$iFrame[0])) {
          console.info('iFrame generated:', this.Vars.$iFrame);
        } else {
          console.error('iFrame not generated', this.Vars.$iFrame);
        }
      }
      if (this.opt.log) {
        console.groupEnd('generateIFrame');
      }
      return this;
    },
    getCookie: function(name) {
      var result;
      result = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
      if (result) {
        return JSON.parse(result[1]);
      } else {
        return null;
      }
    },
    getParams: function(e) {
      var $target, classes, params;
      $target = $(e.currentTarget);
      classes = $target.attr('class').split(' ');
      params = [];
      $.each(classes, function(index, elClass) {
        var param;
        if (elClass.indexOf('jsClientixParam') > -1) {
          param = elClass.split('_');
          if (param[1] && param[2]) {
            if (param[1] === 'services') {
              param[2] = '[' + param[2].split('-').join(',') + ']';
            }
            params.push('' + param[1] + '=' + param[2]);
          }
        }
      });
      return params;
    },
    setDOMEvents: function() {
      var handler;
      if (this.opt.log) {
        console.groupCollapsed('setDOMEvents');
      }
      this.Vars.$button.off('mousedown.openWidget, touchstart.openWidget').on('mousedown.openWidget, touchstart.openWidget', (function(_this) {
        return function(e) {
          if (e.which === 1) {
            if (_this._detectWideScreen()) {
              _this.generateIFrame();
            } else {
              _this.openNew();
            }
          } else if (e.which === 2) {
            _this.openNew();
          }
        };
      })(this));
      $('body').off('mousedown.openClientixWidget, touchstart.openClientixWidget').on('mousedown.openClientixWidget, touchstart.openClientixWidget', '.jsClientix_openWidget', (function(_this) {
        return function(e) {
          var params;
          params = _this.getParams(e);
          if (e.which === 1) {
            if (_this._detectWideScreen()) {
              _this.generateIFrame(params);
            } else {
              _this.openNew(params);
            }
          } else if (e.which === 2) {
            _this.openNew(params);
          }
        };
      })(this));
      if (this.opt.log && this.opt.develop) {
        if (this.Vars.$button.length !== 0) {
          console.info('buttons found', this.Vars.$button);
          handler = true;
          $.each(this.Vars.$button, function(i, button) {
            var events;
            events = [];
            $.each($._data(button, 'events'), function(i, event) {
              events.push(i);
            });
            if (!($.inArray('mousedown', events) || $.inArray('touchstart', events))) {
              console.error('button handlers not set', $(button));
              handler = false;
              return false;
            }
          });
          if (handler === true) {
            console.info('buttons handlers set', this.Vars.$button);
          } else {
            console.error('buttons handlers not set', this.Vars.$button);
          }
        } else {
          console.error('buttons not found', this.Vars.$button);
        }
      }
      if (this.opt.log) {
        console.groupEnd('setDOMEvents');
      }
      return this;
    },
    _detectWideScreen: function() {
      if (this.win.screen.availWidth > 640) {
        return true;
      } else {
        return false;
      }
    },
    setIFrameEvents: function() {
      window.addEventListener('message', (function(_this) {
        return function(e) {
          if (_this.Vars.url.indexOf(e.origin) !== -1) {
            if (e.data === 'stopWidget') {
              return _this.hideIFrame();
            }
          }
        };
      })(this), false);
    },
    showIFrame: function() {
      if (this.opt.log) {
        console.groupCollapsed('showIFrame');
      }
      this.Vars.$iFrame.css({
        'visibility': 'visible',
        'z-index': 2147483647
      });
      if (this.opt.log && this.opt.develop) {
        if ($(this.doc.elementFromPoint(0, 0)).is(this.Vars.$iFrame)) {
          console.info('iFrame visible', $(this.doc.elementFromPoint(0, 0)));
        } else {
          console.error('iFrame not visible', $(this.doc.elementFromPoint(0, 0)));
        }
      }
      if (this.opt.log) {
        console.groupEnd('showIFrame');
      }
      return this;
    },
    hideIFrame: function() {
      if (this.opt.log) {
        console.groupCollapsed('hideIFrame');
      }
      this.Vars.$iFrame.remove();
      if (this.opt.log) {
        console.groupEnd('hideIFrame');
      }
      return this;
    },
    openNew: function(params) {
      if (params == null) {
        params = [];
      }

      if (this.opt.log) {console.groupCollapsed('openNew');}
      if (params == null || params == "") {params = [];}
      params.push('roistat_visit=' + this.getCookie('roistat_visit'));
      params = params.join('&');
      window.open(this.Vars.url + '?' + params, '_blank').location;
      if (this.opt.log) {
        console.groupEnd('openNew');
      }
      return this;
    }
  };
  $.fn.clientixWidget = function(options) {
    var Objects;
    if (this.length) {
      Objects = [];
      $.each(this, function(i, element) {
        var object;
        object = $.data(element, 'clientixWidgetObject');
        if (typeof object === 'object' && object !== null) {
          return Objects.push(object);
        } else {
          object = Object.create(clientixWidget);
          $.data(element, 'clientixWidgetObject', object);
          object.init(options, element);
          return Objects.push(object);
        }
      });
      if (Objects.length) {
        window.clientixWidget = Objects;
        return Objects;
      } else {
        return this;
      }
    } else {
      console.info('no matched objects found');
      return false;
    }
  };
  $.fn.clientixWidget["default"] = {
    develop: true,
    log: true,
    alias: null,
    baseUrl: null,
    widgetId: 'clientixAppointmentWidget',
    buttonClass: '.clientixAppointmentButton',
    stopClass: '.jsClose',
    color: '#406c8e',
    text: 'Записаться онлайн'
  };
})(jQuery, window, document);
