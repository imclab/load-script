# Load Scripts

Load client-side scripts asynchronously.

## Install

```
component install viatropos/load-script
```

## Example

```js
var load = require('load-script');

load('https://connect.facebook.net/en_US/all.js', function(){
  // facebook script loaded.
});
```

It doesn't matter how many times you try to load a specific url, it will only load once, and all callbacks will be called in order.

## License

MIT