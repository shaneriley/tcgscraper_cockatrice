(function() {
  if (window.__tcg_cockatrice_tool_loading) { return; }
  if (typeof Bookmarklet === "function") { Bookmarklet(); }
  window.__tcg_cockatrice_tool_loading = true;
  var head = document.getElementsByTagName('head')[0],
      path = window.__tcg_cockatrice_path;
  var widget = {
    required_assets: [
      path + 'bookmarklet.js'
    ],
    assets_loaded: 0,
    loadScript: function(src, cb) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = "async";
      script.src = src;
      script.onload = script.onreadystatechange = function() {
        if (!this.readyState || /loaded|complete/.test(script.readyState)) {
          this.onload = this.onreadystatechange = null;
          cb();
        }
      };
      head.appendChild(script);
    },
    loadjQuery: function() {
      var conflict = false;
      if ('$' in window) {
        window.temp$ = window.$;
        conflict = true;
      }
      if ('jQuery' in window) {
        window.$jQuery = jQuery.noConflict(true);
        window.$ = window.temp$;
        conflict = true;
      }
      widget.loadScript('http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js', function() {
        if (conflict) {
          var jq = jQuery.noConflict(true);
          window.j$ = jq;
          window.jQuery = window.$jQuery;
          window.$ = window.temp$ || window.jQuery;
        }
        else { window.j$ = window.$; }
        widget.loadAssets();
      });
    },
    loadAssets: function() {
      for (var i = 0, len = widget.required_assets.length; i < len; i++) {
        widget.loadScript(widget.required_assets[i], function() {
          widget.assets_loaded++;
          if (widget.assets_loaded === len) {
            window.__tcg_cockatrice_tool_loading = false;
            Bookmarklet();
          }
        });
      }
    },
    loadStyles: function() {
      var styles = document.createElement('link');
      styles.rel = 'stylesheet';
      styles.href = path.replace(/java.+\//, "") + 'screen.css';
      head.appendChild(styles);
    },
    init: function() {
      widget.loadStyles();
      widget.loadjQuery();
    }
  };
  widget.init();
})();
