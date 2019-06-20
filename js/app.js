var map;
var infoWindow;

var Place = function(name, position) {
    this.name = name;
    this.position = position;
    this.marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(position.lat, position.lng),
        title: name
    });

    this.showInfo = function() {
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ this.marker.setAnimation(null); }.bind(this), 500);

        infoWindow.setContent("<h3>"+this.name+"</h3>");
        infoWindow.open(map, this.marker);
    }

    this.marker.addListener('click', this.showInfo.bind(this));
}

var ViewModel = function(places) {
    this.filter = ko.observable("");
    this.places = ko.observableArray(places);
    this.filteredPlaces = ko.computed(function() {
        var filter = this.filter().toLowerCase();
        return this.places().filter(function(place) {
            var isVisible = place.name.toLowerCase().includes(filter);
            place.marker.setMap(isVisible ? map : null);
            return isVisible;
        });
    }, this);
}

function init() {
    var mapCanvas = $("#map").get(0);
    map = new google.maps.Map(mapCanvas, {
        center: {lat: 0, lng: 0},
        zoom: 7
    });
    infoWindow = new google.maps.InfoWindow({});

    var places = [
        new Place("Chapecó", {lat: 0, lng: 0}),
        new Place("Santa Catarina", {lat: 1, lng: 0}),
        new Place("Brasil", {lat: 2, lng: 0}),
        new Place("América Latina", {lat: 3, lng: 0})
    ];
    ko.applyBindings(new ViewModel(places));
}

function initFailed() {
    window.alert("Failed to load Google Maps :(");
}