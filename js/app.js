var map;

function init() {
    var mapCanvas = $("#map").get(0);
    map = new google.maps.Map(mapCanvas, {
        center: {lat: 40.7413549, lng: -73.9980244},
        zoom: 13
    });
}

function initFailed() {
    window.alert("Failed to load Google Maps :(");
}