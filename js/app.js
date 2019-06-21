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
        center: {lat: -30.0221623, lng: -51.1817744},
        zoom: 13
    });
    infoWindow = new google.maps.InfoWindow({});

    var places = [
        new Place("Beira-Rio Stadium", {lat: -30.065253864184932, lng: -51.23587800048611}),
        new Place("Arena do Grêmio", {lat: -29.973729615823974, lng: -51.196223254122714}),
        new Place("Farroupilha Park", {lat: -30.037808405552457, lng: -51.21502674542615}),
        new Place("Moinhos de Vento Park", {lat: -30.026532508331343, lng: -51.200639199452134}),
        new Place("Germânia Park", {lat: -30.024847, lng: -51.157899}),
        new Place("Botanic Gardens", {lat: -30.05209165371639, lng: -51.17752669710054}),
        new Place("Marinha do Brasil Park", {lat: -30.052743467344015, lng: -51.229601476877804}),
        new Place("Iberê Camargo Museum", {lat: -30.077744430372565, lng: -51.245532599836416}),
        new Place("Public Market", {lat: -30.02752939776655, lng: -51.227893126881966}),
        new Place("Gasômetro Plant", {lat: -30.035143496634777, lng: -51.240882275997535}),
    ];
    ko.applyBindings(new ViewModel(places));
}

function initFailed() {
    window.alert("Failed to load Google Maps :(");
}