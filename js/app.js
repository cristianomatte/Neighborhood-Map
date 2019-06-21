var map;
var infoWindow;

var Place = function(name, position, fsid) {
    this.name = name;
    this.position = position;
    this.fsid = fsid;
    this.marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(position.lat, position.lng),
        title: name
    });

    this.showInfo = function() {
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ this.marker.setAnimation(null); }.bind(this), 500);

        var infoWindowContent = "<h3>"+this.name+"</h3>";
        infoWindow.setContent(infoWindowContent+"<div>Fetching information...</div>");

        // var url = "https://api.foursquare.com/v2/venues/"+this.fsid
        //     +"?client_id=2WF30CMX1YRYLGYIT0O30YGXMRILD4RMONZQK2VW1GGF1NUJ"
        //     +"&client_secret=KHZ55DPWALRNWRO51302OJSS43PCFUTR51IA0MUV5SSIPKLF"
        //     +"&v=20190621";
        $.getJSON(url)
            .done(function(json) {
                var venue = json.response.venue;
                if (!venue) {
                    infoWindowContent += "<p>Failed to fetch information about this place. Try again later.</p>";
                    return;
                }

                infoWindowContent += "<style>a {display: block;}</style>"
                if (venue.contact.formattedPhone) {
                    infoWindowContent += "<p>Phone: "+venue.contact.formattedPhone+"</p>";
                }
                if (venue.canonicalUrl) {
                    infoWindowContent += "<p><a href="+venue.canonicalUrl+">Foursquare</a></p>";
                }
                if (venue.contact.facebook) {
                    infoWindowContent += "<p><a href=https://facebook.com/"+venue.contact.facebook+">Facebook</a></p>";
                }
                if (venue.contact.twitter) {
                    infoWindowContent += "<p><a href=https://twitter.com/"+venue.contact.twitter+">Twitter</a></p>";
                }
                if (venue.url) {
                    infoWindowContent += "<p><a href="+venue.url+">Website</a></p>";
                }
            }.bind(this))
            .fail(function() {
                infoWindowContent += "<p>Failed to fetch information about this place. Try again later.</p>";
            }.bind(this))
            .always(function() {
                infoWindow.setContent(infoWindowContent);
            });

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
        new Place("Beira-Rio Stadium", {lat: -30.065253864184932, lng: -51.23587800048611}, "4b7dd2cff964a520ead62fe3"),
        new Place("Arena do Grêmio", {lat: -29.973729615823974, lng: -51.196223254122714}, "54bac14f498e0b8a26d7e819"),
        new Place("Farroupilha Park", {lat: -30.037808405552457, lng: -51.21502674542615}, "4bec5abd2bc1b713e977bf3a"),
        new Place("Moinhos de Vento Park", {lat: -30.026532508331343, lng: -51.200639199452134}, "4b0ff875f964a520e46623e3"),
        new Place("Germânia Park", {lat: -30.024847, lng: -51.157899}, "4bcb683ab6c49c746e279291"),
        new Place("Botanic Gardens", {lat: -30.05209165371639, lng: -51.17752669710054}, "4bc1d242920eb71396291b2c"),
        new Place("Iberê Camargo Museum", {lat: -30.077744430372565, lng: -51.245532599836416}, "4b6f0c9cf964a5208ad92ce3"),
        new Place("Public Market", {lat: -30.02752939776655, lng: -51.227893126881966}, "4b073237f964a52063f922e3"),
        new Place("Gasômetro Plant", {lat: -30.035143496634777, lng: -51.240882275997535}, "4b2e2a95f964a5201cdd24e3"),
    ];
    ko.applyBindings(new ViewModel(places));

    $(".sidebar ul").on("click tap", function() {
        $(".sidebar").toggleClass("open");
        $(".menu-toggle").toggleClass("open");
    });

    $(".menu-toggle").on("click tap", function() {
        $(".sidebar").toggleClass("open");
        $(".menu-toggle").toggleClass("open");
    });
}

function initFailed() {
    window.alert("Failed to load Google Maps :(");
}