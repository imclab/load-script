
/**
 * Expose `load`.
 */

exports = module.exports = load;

/**
 * Callbacks for each url.
 */

exports.callbacks = {};

/**
 * Load a script asyncronously.
 *
 * If the script is already loaded, it will callback immediately.
 *
 *    load('https://connect.facebook.net/en_US/all.js', function(){
 *      // facebook script loaded.
 *    });
 *
 * @param {String} src
 * @param {Function} [fn] Callback
 * @param {String} [name] The name of the method if this
 *   a callback used by some library like Facebook that has
 *   an initialize function called.
 * @api public
 */

function load(src, fn, name) {
  // if the script is already loaded, callback immediately
  if (document.getElementById(src)) {
    if (!exports.callbacks[src])
      if (fn) fn();
    else
      exports.callbacks[src].push(fn);
    
    return;
  }

  // add callback for src
  exports.callbacks[src] = [];
  if (fn) exports.callbacks[src].push(fn);

  var head = document.head || document.getElementsByTagName('head')[0];
  var script = document.createElement('script');

  script.id = src;
  script.type = 'text/javascript';
  script.charset = 'utf8';
  script.async = true;
  script.src = src;

  if (name) {
    // callback when script initialize function is called.
    window[name] = function(){
      exec(null, src);
    };
  } else {
    // callback when script loads
    var onend = 'onload' in script ? loadScript : loadScriptOnIE;
    onend(script);
  }

  head.appendChild(script);
}

/**
 * Load script on modern browsers.
 */

function loadScript(script, src) {
  script.onload = function(){
    this.onerror = this.onload = null;
    exec(null, src);
  };

  script.onerror = function(){
    // this.onload = null here is necessary
    // because even IE9 works not like others
    this.onerror = this.onload = null;
    exec(new Error('Failed to load ' + src), src);
  };
}

/**
 * Load script on legacy browser.
 */

function loadScriptOnIE(script) {
  script.onreadystatechange = function(){
    if (this.readyState != 'complete') return;
    this.onreadystatechange = null;
    exec(null, src); // there is no way to catch loading errors in IE8
  }
}

/**
 * Call all callbacks for `src`.
 */

function exec(err, src) {
  var calls = exports.callbacks[src];
  if (calls) {
    while (calls.length) calls.shift()(err);
  }
  delete exports.callbacks[src];
}