/* global Module */

/* Magic Mirror
 * Module: DC Metro
 *
 * By Dan T.
 * based on a Script from Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

Module.register("dcmetro",{

    // Default module config.
    defaults: {
        location: false,
        locationID: false,
        fade: true,
        fadePoint: 0.25, // Start on 1/4th of the list.

        initialLoadDelay: 2500, // 2.5 seconds delay.
        updateInterval: 10 * 60 * 1000, // every 10 minutes
        retryDelay: 2500,

        apiBase: "https://api.wmata.com",
        TrainPredictionEndpoint: "StationPrediction.svc/json/GetPrediction/",

        appendLocationNameToHeader: true,
        
        lineColors: {
        	"RD": "Red",
        	"BL": "Blue",
        	"YL": "Yellow",
        	"OR": "Orange",
        	"GR": "Green",
        	"SV": "Silver",
        	"No": "No Passengers",
        	"": "No Passengers"
        }

    },

    // create a variable to hold the location name based on the API result.
    fetchedLocatioName: "",

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    // Define required scripts.
    getStyles: function() {
        return ["dcmetro.css", "font-awesome.css"];
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

        this.loaded = false;
        this.scheduleUpdate(this.config.initialLoadDelay);
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        var table = document.createElement("table");
        table.className = "small";

        for (var t in this.trains) {
            var train = this.trains[t];

            var row = document.createElement("tr");
            table.appendChild(row);

            var trainDestCell = document.createElement("td");
            trainDestCell.className = "from";
            trainDestCell.innerHTML = train.DestinationName;
            row.appendChild(trainDestCell);

            var departureTimeCell = document.createElement("td");
            departureTimeCell.className = "departuretime";
            departureTimeCell.innerHTML = "(" + train.Line + ")";
            row.appendChild(departureTimeCell);

            var MinutesAwayCell = document.createElement("td");
            MinutesAwayCell.innerHTML = "-" + train.Min + " min";
            MinutesAwayCell.className = "align-right trainto";
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
            return this.data.header + " " + this.fetchedLocatioName;
        }

        return this.data.header;
    },

    /* updateTrains(compliments)
     * Requests new data from wmata
     * Calls processTrains on succesfull response.
     */
    updateTrains: function() {
        Log.log("[dcmetro] updateTrains");
		// 	https://api.wmata.com/StationPrediction.svc/json/GetPrediction/{StationCodes}

		var url = this.config.apiBase + "/" + this.config.TrainPredictionEndpoint + this.config.myStationCode + "/" + this.getQuerystring();
		var self = this;
		var retry = true;

        var xhr = new XMLHttpRequest();
        xhr.timeout = 2000;
        xhr.onreadystatechange = function(e){
            console.log("readyState = " + xhr.readyState);
            if (xhr.readyState === 4){
                if (xhr.status === 200){
                    //console.log(xhr.response);
                    self.processTrains(JSON.parse(xhr.response));
                } else if (xhr.status === 401) {
                    self.updateDom(self.config.animationSpeed);

                    Log.error(self.name + ": Incorrect APPID.");
                    retry = true;
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
    
    /* processTrains(data)
	 * Uses the received data to set the various values.
	 *
	 * argument data object - Train information received form WMATA
	 */
	processTrains: function(data) {
		Log.log("[dcmetro] processTrains");

		if (!data && !data.Trains) {
			console.log("processTrains: Did not receive usable new data.");
			return;
		}
		
		for (var i=0; i < data.Trains.length; i++) {
			this.trains.push(data.Trains[i]);
		}

        this.show(this.config.animationSpeed, {lockString:this.identifier});
        this.loaded = true;
        this.updateDom(this.config.animationSpeed);
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
    }
});