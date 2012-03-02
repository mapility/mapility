(function(){

// keep this last!! it boots the maps
ContaoMapping.dynLoad.addLib({code:'ContaoMapping.bootMaps();'});

window.addEvent("domready", ContaoMapping.dynLoad.loadNext);
})();
