Hash Sync
=========

**AngularJS directive for syncing a model with the URL hash.**

The goal of this module is to be able to automatically sync model changes to the URL's hash and back.

### Use Case

The use case would be to easily recreate a form state without any session/localStorage variables (i.e. so it could be shareable, or recreated on another computer quickly and easily).

### Usage

Just add a `hash-sync` attribute to anything that can also usin the `ngModel` directive (which is required for this to work).

```html
<input type="text" hash-sync ng-model="test">
```

That's all there is to it! Now change the value in the input and see that it syncs (both ways) between the hash in the URL and the value in the input. Note that you do have to hit enter in the URL bar to actually change the hash value (it's not enough to just type in there).

**Important:** Don't forget the following in your config, which is needed for the hash tag to work without affecting Angular routing:

```javascript
app.config(function ['$locationProvider', ($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
}]);
```

### Location History

By default, the directive *will* replace history (via `$location.replace()` (see **Replace method** on http://docs.angularjs.org/guide/dev_guide.services.$location)). This means that updating a text field does *not* create a place in history (i.e. without this, you could hit back to undo every change to any `hash-sync` input and that's usually not desirable).

If you *do* want it to create a new item in the history, you can add a `replace-history="false"` to the element, and this will create instead of replace in the location history.

### Demo

[http://cwspear.github.io/hash-sync/](http://cwspear.github.io/hash-sync/)