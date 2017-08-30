var app = {
    initialize: function() {
        document.addEventListener("deviceReady", this.onDeviceReady.bind(this), false);
    },

    takepic: function () {
        navigator.camera.getPicture(function (imageData) {
            var image = document.getElementById('anzeige');
            image.src = "data:image/jpeg;base64," + imageData;
        }, function (error) {
            console.debug("Unable to obtain picture: " + error, "app");
        });
    },
    onBatteryStatus: function(status) {
        var bat = document.getElementById("batterie");
        bat.innerHTML = status.level;
        console.log("Level: " + status.level + " isPlugged: " + status.isPlugged);
    },

    onDeviceReady : function () {
        window.addEventListener("batterystatus", this.onBatteryStatus, false);
        window.geofence.initialize().then(function () {
            console.log("Successful initialization");
            window.geofence.addOrUpdate({
                id:             "69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb",
                latitude:       50.2980049,
                longitude:      18.6593152,
                radius:         3000,
                transitionType: TransitionType.ENTER,
                notification: {
                    id:             1,
                    title:          "Welcome in Gliwice",
                    text:           "You just arrived to Gliwice city center.",
                    openAppOnClick: true
                }
            }).then(function () {
                console.log('Geofence successfully added');
            }, function (reason) {
                console.log('Adding geofence failed', reason);
            });
        }, function (error) {
            console.log("Error", error);
        });
    },

    sendmail : function () {
        cordova.plugins.email.open({
            to:      'alex@russmail.ru',
            cc:      'mwolf@knuddels.de',
            subject: 'JoJo was geht ab Jungs?',
            body:    'lasst mal wieder was starten'
        });
    }
};

app.initialize();
$.ajax({
    type: "POST",
    data: "username=Peter&password=geheim",
    url: "localhost:3000/login",
    success: function (a,b,c) {
        console.log(a);
    },
    error: function (a, b, c) {

    }
});