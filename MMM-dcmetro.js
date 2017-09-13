/* global Module */

/* Magic Mirror
 * Module: DC Metro
 *
 * By Dan T.
 * based on a Script from Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("MMM-dcmetro",{

    // Default module config.
    defaults: {
        location: false,
        locationID: false,
        fade: true,
        fadePoint: 0.7,

        initialLoadDelay: 2500, // 2.5 seconds delay.
        updateInterval: 1 * 60 * 1000, // every X minutes
        retryDelay: 2500,

        apiBase: "https://api.wmata.com",
        TrainPredictionEndpoint: "StationPrediction.svc/json/GetPrediction",
        StationInfoEndpoint: "Rail.svc/json/jStationInfo",

        appendLocationNameToHeader: true,

        lineColors: {
            "RD": "#FF0000",
            "BL": "#0000FF",
            "YL": "#FFFF00",
            "OR": "#FFA500",
            "GR": "#006400",
            "SV": "#C0C0C0"
        },
        defaultColor: "#000000"

    },

    // create a variable to hold the location name based on the API result.
    fetchedLocatioName: "",

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    // Define required scripts.
    getStyles: function() {
        return ["MM-dcmetro.css", "font-awesome.css"];
    },

    // Define required translations.
    getTranslations: function() {
        return false;
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        moment.locale(config.language);

        this.trains = [];
        this.getStationInfo();

        this.loaded = false;
        this.scheduleUpdate(this.config.initialLoadDelay);
    },

    // Override dom generator.
    getDom: function() {
        var self = this;
        var wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (!this.authorized) {
            wrapper.innerHTML = this.translate("CONFIGURE API KEY");
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (this.trains.length == 0) {
            wrapper.innerHTML = this.translate("NO TRAINS");
            wrapper.className = "dimmed light small";
        }

        var table = document.createElement("table");
        table.className = "small";

        var updateTimeRow = document.createElement("tr");
        updateTimeRow.className = "update-time";
        updateTimeRow.innerHTML = "<td>Last Update: " + new Date().toLocaleTimeString() + "</td>";
        table.appendChild(updateTimeRow);

        for (var t in this.trains) {
            var train = this.trains[t];

            var row = document.createElement("tr");
            table.appendChild(row);

            var trainDestCell = document.createElement("td");
            trainDestCell.className = "destination";
            trainDestCell.innerHTML = train.DestinationName;
            row.appendChild(trainDestCell);

            var blockColor = this.config.lineColors[train.Line] || this.config.defaultColor;
            var departureTimeCell = document.createElement("td");
            departureTimeCell.className = "lineColor";
            departureTimeCell.innerHTML = "<p style='background:" + blockColor + "'>" + train.Line   + "</p>";
            row.appendChild(departureTimeCell);

            var MinutesAwayCell = document.createElement("td");
            MinutesAwayCell.innerHTML = " " + train.Min + (self.isNumeric(train.Min) ? " min" : "");
            MinutesAwayCell.className = "align-right minutes";
            row.appendChild(MinutesAwayCell);

            if (this.config.fade && this.config.fadePoint < 1) {
                if (this.config.fadePoint < 0) {
                    this.config.fadePoint = 0;
                }
                var startingPoint = this.trains.length * this.config.fadePoint;
                var steps = this.trains.length - startingPoint;
                if (t >= startingPoint) {
                    var currentStep = t - startingPoint;
                    row.style.opacity = 1 - (1 / steps * currentStep);
                }
            }
        }

        return table;
    },

    // Override getHeader method.
    getHeader: function() {
        if (this.config.appendLocationNameToHeader) {
            return this.stationName || this.data.header;
        }

        return this.data.header;
    },

    getStationInfo: function () {
        Log.log("[dcmetro] getStationInfo");
        // https://api.wmata.com/Rail.svc/json/jStationInfo[?StationCode]

        var url = this.config.apiBase + "/" + this.config.StationInfoEndpoint + this.getQuerystring() + "&StationCode=" + this.config.myStationCode;
        var self = this;
        var retry = true;

        self.authorized = true;

        var xhr = new XMLHttpRequest();
        xhr.timeout = 10000;
        xhr.onreadystatechange = function(e){
            //console.log("readyState = " + xhr.readyState);
            if (xhr.readyState === 4){
                if (xhr.status === 200){
                    //console.log(xhr.response);
                    self.processStation(JSON.parse(xhr.response));
                } else if (xhr.status === 401) { //unauthorized
                    self.updateDom(self.config.animationSpeed);

                    Log.error(self.name + ": Incorrect API Key.");
                    retry = true;
                    self.authorized = false;
                } else {
                    console.error("XHR failed: ", xhr.status);
                }
            }
        };
        xhr.ontimeout = function (){
            console.error("request timedout: ", xhr);
        };
        xhr.open("get", url, /*async*/ true);
        // xhr.responseType = "text";
        xhr.send();
    },

    /* updateTrains(compliments)
     * Requests new data from wmata
     * Calls processTrains on succesfull response.
     */
    updateTrains: function() {
        Log.log("[dcmetro] updateTrains");
        // 	https://api.wmata.com/StationPrediction.svc/json/GetPrediction/{StationCodes}

		var url = this.config.apiBase + "/" + this.config.TrainPredictionEndpoint + "/" + this.config.myStationCode + this.getQuerystring();
		var self = this;
		var retry = true;

        self.authorized = true;

        var xhr = new XMLHttpRequest();
        xhr.timeout = 10000;
        xhr.onreadystatechange = function(e){
            //console.log("readyState = " + xhr.readyState);
            if (xhr.readyState === 4){
                if (xhr.status === 200){
                    //console.log(xhr.response);
                    self.processTrains(JSON.parse(xhr.response));
                } else if (xhr.status === 401) { //unauthorized
                    self.updateDom(self.config.animationSpeed);

                    Log.error(self.name + ": Incorrect API Key.");
                    retry = true;
                    self.authorized = false;
                } else {
                    console.error("XHR failed: ", xhr.status);
                }

                if (retry) {
                    self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
                }
            }
        };
        xhr.ontimeout = function (){
            console.error("request timedout: ", xhr);
        };
        xhr.open("get", url, /*async*/ true);
        // xhr.responseType = "text";
        xhr.send();

    },

    /* processTrains(data)
	 * Uses the received data to set the various values.
	 *
	 * argument data object - Train information received form WMATA
	 */
	processTrains: function(data) {
//		Log.log("[dcmetro] processTrains");

		if (!data && !data.Trains) {
			console.log("processTrains: Did not receive usable new data.");
			return;
		}

		this.trains = [];
		for (var i=0; i < data.Trains.length; i++) {
			this.trains.push(data.Trains[i]);
		}

        this.show(this.config.animationSpeed, {lockString:this.identifier});
        this.loaded = true;
        this.updateDom(this.config.animationSpeed);
    },

    processStation: function (data) {
        if (!data) {
            console.log("processStation: Did not receive usable new data.");
            return;
        }

        this.stationName = data.Name;
        Log.log("[dcmetro] processStation set to: " + this.stationName);
    },

    processStation: function (data) {
        if (!data) {
            console.log("processStation: Did not receive usable new data.");
            return;
        }

        this.stationName = data.Name;
        Log.log("[dcmetro] processStation set to: " + this.stationName);
    },

    // Override notification handler.
    notificationReceived: function(notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            if (this.config.appendLocationNameToHeader) {
                this.hide(0, {lockString: this.identifier});
            }
        }
    },

    /* getQuerystring(compliments)
     * Generates an url with api parameters based on the config.
     *
     * return String - URL params.
     */
    getQuerystring: function() {
        var params = "?";
        if(this.config.apiKey) {
            params += "api_key=" + this.config.apiKey;
        } else {
            this.hide(this.config.animationSpeed, {lockString:this.identifier});
            return;
        }

        return params;
    },

    /* scheduleUpdate()
     * Schedule next update.
     *
     * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
     */
    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(function() {
            self.updateTrains();
        }, nextLoad);
    },

    isNumeric: function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
});
