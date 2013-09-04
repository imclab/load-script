
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
 * @api public
 */

function load(src, fn) {
  // if the script is already loaded, callback immediately
  if (document.getElementById(src)) {
    if (fn) fn();
    return;
  }

  // add callback for src
  if (fn) {
    (exports.callbacks[src] = exports.callbacks[url] || []).push(fn); 
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var script = document.createElement('script');

  script.id = src;
  script.type = 'text/javascript';
  script.charset = 'utf8';
  script.async = true;
  script.src = src;

  var onend = 'onload' in script ? loadScript : loadScriptOnIE;
  onend(script);

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
  delete async.callbacks[url];
}