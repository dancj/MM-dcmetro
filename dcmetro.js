/* global Module */

/* Magic Mirror
 * Module: DC Metro
 *
 * By Dan T.
 * MIT Licensed.
 */

Module.register("dcmetro",{

    // Default module config.
    defaults: {
        location: false,
        locationID: false,
        appid: "",
        fade: true,
        fadePoint: 0.25, // Start on 1/4th of the list.

        initialLoadDelay: 2500, // 2.5 seconds delay.
        retryDelay: 2500,

        apiVersion: "2.5",
        apiBase: "http://api.openweathermap.org/data/",
        forecastEndpoint: "forecast/daily",

        appendLocationNameToHeader: true

    },

    // create a variable for the first upcoming calendaar event. Used if no location is specified.
    firstEvent: false,

    // create a variable to hold the location name based on the API result.
    fetchedLocatioName: "",

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    // Define required scripts.
    getStyles: function() {
        return ["dcmetro.css"];
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

        this.loaded = false;
        this.scheduleUpdate(this.config.initialLoadDelay);

        this.updateTimer = null;

    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");

        if (this.config.appid === "") {
            wrapper.innerHTML = "Please set the correct WMATA <i>appid</i> in the config for module: " + this.name + ".";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING");
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        var table = document.createElement("table");
        table.className = "small";

        // TODO: build display

        return table;
    },

    // Override getHeader method.
    getHeader: function() {
        if (this.config.appendLocationNameToHeader) {
            return this.data.header + " " + this.fetchedLocatioName;
        }

        return this.data.header;
    },

    // Override notification handler.
    notificationReceived: function(notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            if (this.config.appendLocationNameToHeader) {
                this.hide(0, {lockString: this.identifier});
            }
        }
        if (notification === "CALENDAR_EVENTS") {
            var senderClasses = sender.data.classes.toLowerCase().split(" ");
            if (senderClasses.indexOf(this.config.calendarClass.toLowerCase()) !== -1) {
                var lastEvent =  this.firstEvent;
                this.firstEvent = false;

                for (e in payload) {
                    var event = payload[e];
                    if (event.location || event.geo) {
                        this.firstEvent = event;
                        //Log.log("First upcoming event with location: ", event);
                        break;
                    }
                }
            }
        }
    },

    /* updateTrains(compliments)
     * Requests new data from wmata
     * Calls processTrains on succesfull response.
     */
    updateTrains: function() {
        if (this.config.appid === "") {
            Log.error("DCMetro: APPID not set!");
            return;
        }

        // TODO
    },

    /* getParams(compliments)
     * Generates an url with api parameters based on the config.
     *
     * return String - URL params.
     */
    getParams: function() {
        var params = "?";
        if(this.config.locationID) {
            params += "id=" + this.config.locationID;
        } else if(this.config.location) {
            params += "q=" + this.config.location;
        } else if (this.firstEvent && this.firstEvent.geo) {
            params += "lat=" + this.firstEvent.geo.lat + "&lon=" + this.firstEvent.geo.lon
        } else if (this.firstEvent && this.firstEvent.location) {
            params += "q=" + this.firstEvent.location;
        } else {
            this.hide(this.config.animationSpeed, {lockString:this.identifier});
            return;
        }

        params += "&units=" + this.config.units;
        params += "&lang=" + this.config.lang;
        /*
         * Submit a specific number of days to forecast, between 1 to 16 days.
         * The OpenWeatherMap API properly handles values outside of the 1 - 16 range and returns 7 days by default.
         * This is simply being pedantic and doing it ourselves.
         */
        params += "&cnt=" + (((this.config.maxNumberOfDays < 1) || (this.config.maxNumberOfDays > 16)) ? 7 : this.config.maxNumberOfDays);
        params += "&APPID=" + this.config.appid;

        return params;
    }
});