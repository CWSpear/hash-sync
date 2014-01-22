Hash Sync
=========

**AngularJS directive for syncing a model with the URL hash.**

The goal of this module is to be able to automatically sync model changes to the URL's hash and back.

The use case would be to easily recreate a form state without any session/localStorage variables (i.e. so it could be shareable, or recreated on another computer quickly and easily).

Don't forget the following, which is needed for the hash tag to work without affecting Angular routing:

```javascript
app.config(function ($locationProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');
});
```

### Demo

[http://cwspear.github.io/hash-sync/](http://cwspear.github.io/hash-sync/)