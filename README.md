# Module: DC Metro
The `dc metro` module is a custom module to extend MagicMirror.
This module displays the upcoming trains for a pre-configured DC metro station.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'dcmetro',
		position: 'top_right',	// This can be any of the regions.
									// Best results in left or right regions.

        config: {
            // demo API key: 6b700f7ea9db408e9745c207da7ca827 (get your own for Production applications)
            apiKey: '6b700f7ea9db408e9745c207da7ca827',
            myStationCode: 'A01'
        }
	}
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>myLocationID</code></td>
			<td>The location ID used for upcoming metro times.<br>
				<br><b>Example:</b> <code>'A01'</code>
				<br><b>Default value:</b> <code>false</code><br><br>
				<strong>Note: See WMATA documentation for list of stations IDs</strong> 
			</td>
		</tr>
		<tr>
			<td><code>appid</code></td>
			<td>The <a href="https://developer.wmata.com" target="_blank">WMATA</a> API key<br>
				<br> This value is <b>REQUIRED</b>
			</td>
		</tr>
		<tr>
			<td><code>updateInterval</code></td>
			<td>How often does the content needs to be fetched? (Milliseconds)<br>
				<br><b>Possible values:</b> <code>1000</code> - <code>86400000</code>
				<br><b>Default value:</b> <code>600000</code> (10 minutes)
			</td>
		</tr>
		<tr>
			<td><code>animationSpeed</code></td>
			<td>Speed of the update animation. (Milliseconds)<br>
				<br><b>Possible values:</b><code>0</code> - <code>5000</code>
				<br><b>Default value:</b> <code>1000</code> (1 second)
			</td>
		</tr>
		<tr>
			<td><code>lang</code></td>
			<td>The language of the days.<br>
				<br><b>Possible values:</b> <code>en</code>, <code>nl</code>, <code>ru</code>, etc ...
				<br><b>Default value:</b> uses value of <i>config.language</i>
			</td>
		</tr>
		<tr>
			<td><code>fade</code></td>
			<td>Fade the future events to black. (Gradient)<br>
				<br><b>Possible values:</b> <code>true</code> or <code>false</code>
				<br><b>Default value:</b> <code>true</code>
			</td>
		</tr>
		<tr>
			<td><code>fadePoint</code></td>
			<td>Where to start fade?<br>
				<br><b>Possible values:</b> <code>0</code> (top of the list) - <code>1</code> (bottom of list)
				<br><b>Default value:</b> <code>0.25</code>
			</td>
		</tr>
		<tr>
			<td><code>initialLoadDelay</code></td>
			<td>The initial delay before loading. If you have multiple modules that use the same API key, you might want to delay one of the requests. (Milliseconds)<br>
				<br><b>Possible values:</b> <code>1000</code> - <code>5000</code>
				<br><b>Default value:</b>  <code>2500</code> (2.5 seconds delay. This delay is used to keep the OpenWeather API happy.)
			</td>
		</tr>
		<tr>
			<td><code>retryDelay</code></td>
			<td>The delay before retrying after a request failure. (Milliseconds)<br>
				<br><b>Possible values:</b> <code>1000</code> - <code>60000</code>
				<br><b>Default value:</b>  <code>2500</code>
			</td>
		</tr>
	</tbody>
</table>


## Station List

````javascript
{
    "Stations": [
        {
            "Address": {
                "City": "Rockville",
                "State": "MD",
                "Street": "15903 Somerville Drive",
                "Zip": "20855"
            },
            "Code": "A15",
            "Lat": 39.1199273249,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.1646273343,
            "Name": "Shady Grove",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Rockville",
                "State": "MD",
                "Street": "251 Hungerford Drive",
                "Zip": "20850"
            },
            "Code": "A14",
            "Lat": 39.0843216075,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.1461253392,
            "Name": "Rockville",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Rockville",
                "State": "MD",
                "Street": "1600 Chapman Avenue",
                "Zip": "20852"
            },
            "Code": "A13",
            "Lat": 39.0624676517,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.1208179517,
            "Name": "Twinbrook",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Rockville",
                "State": "MD",
                "Street": "5500 Marinelli Road",
                "Zip": "20852"
            },
            "Code": "A12",
            "Lat": 39.0481513573,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.112829859,
            "Name": "White Flint",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Bethesda",
                "State": "MD",
                "Street": "10300 Rockville Pike",
                "Zip": "20852"
            },
            "Code": "A11",
            "Lat": 39.02926895,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.10384972,
            "Name": "Grosvenor",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Bethesda",
                "State": "MD",
                "Street": "8810 Rockville Pike",
                "Zip": "20814"
            },
            "Code": "A10",
            "Lat": 39.0000564843,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0969522905,
            "Name": "Medical Center",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Bethesda",
                "State": "MD",
                "Street": "7450 Wisconsin Avenue",
                "Zip": "20814"
            },
            "Code": "A09",
            "Lat": 38.9843936603,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0941291922,
            "Name": "Bethesda",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "5337 Wisconsin Avenue NW",
                "Zip": "20015"
            },
            "Code": "A08",
            "Lat": 38.9594838736,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.084995805,
            "Name": "Friendship Heights",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "4501 Wisconsin Avenue NW",
                "Zip": "20016"
            },
            "Code": "A07",
            "Lat": 38.9488514351,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0795873255,
            "Name": "Tenleytown",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "4200 Connecticut Avenue NW",
                "Zip": "20008"
            },
            "Code": "A06",
            "Lat": 38.9432652883,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0629861805,
            "Name": "Van Ness UDC",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "3599 Connecticut Avenue NW",
                "Zip": "20008"
            },
            "Code": "A05",
            "Lat": 38.9347628908,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0580425191,
            "Name": "Cleveland Park",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "2700 Connecticut Ave., NW",
                "Zip": "20008"
            },
            "Code": "A04",
            "Lat": 38.9250851371,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0524180207,
            "Name": "Woodley Park Zoo",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "1525 20th St. NW",
                "Zip": "20036"
            },
            "Code": "A03",
            "Lat": 38.9095980575,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0434143597,
            "Name": "Dupont Circle",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "1001 Connecticut Avenue NW",
                "Zip": "20036"
            },
            "Code": "A02",
            "Lat": 38.9032019462,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0397008272,
            "Name": "Farragut North",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "607 13th St. NW",
                "Zip": "20005"
            },
            "Code": "A01",
            "Lat": 38.8983144732,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0280779971,
            "Name": "Metro Center",
            "StationTogether1": "C01",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "630 H St. NW",
                "Zip": "20001"
            },
            "Code": "B01",
            "Lat": 38.8983168097,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0219153904,
            "Name": "Gallery Place",
            "StationTogether1": "F01",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "450 F Street NW",
                "Zip": "20001"
            },
            "Code": "B02",
            "Lat": 38.8960903176,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0166389566,
            "Name": "Judiciary Square",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "701 First St. NE",
                "Zip": "20002"
            },
            "Code": "B03",
            "Lat": 38.8977660392,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0074142921,
            "Name": "Union Station",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "200 Florida Ave N.E.",
                "Zip": "20002"
            },
            "Code": "B35",
            "Lat": 38.9070162121,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0030204472,
            "Name": "New York Avenue",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "919 Rhode Island Avenue NE",
                "Zip": "20018"
            },
            "Code": "B04",
            "Lat": 38.9210596891,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -76.9959369166,
            "Name": "Rhode Island Avenue",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "801 Michigan Avenue NE",
                "Zip": "20017"
            },
            "Code": "B05",
            "Lat": 38.9332109913,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -76.9945342851,
            "Name": "Brookland",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "550 Galloway Street NE",
                "Zip": "20011"
            },
            "Code": "B06",
            "Lat": 38.9518467675,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0022030768,
            "Name": "Fort Totten",
            "StationTogether1": "E06",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Washington",
                "State": "DC",
                "Street": "327 Cedar Street NW",
                "Zip": "20012"
            },
            "Code": "B07",
            "Lat": 38.976078531,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0181766987,
            "Name": "Takoma",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Silver Spring",
                "State": "MD",
                "Street": "8400 Colesville Road",
                "Zip": "20910"
            },
            "Code": "B08",
            "Lat": 38.9939493747,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0310178268,
            "Name": "Silver Spring",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Forest Glen",
                "State": "MD",
                "Street": "9730 Georgia Avenue",
                "Zip": "20910"
            },
            "Code": "B09",
            "Lat": 39.0149542752,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0429165548,
            "Name": "Forest Glen",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Silver Spring",
                "State": "MD",
                "Street": "11171 Georgia Avenue",
                "Zip": "20902"
            },
            "Code": "B10",
            "Lat": 39.0375271436,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0501070535,
            "Name": "Wheaton",
            "StationTogether1": "",
            "StationTogether2": ""
        },
        {
            "Address": {
                "City": "Silver Spring",
                "State": "MD",
                "Street": "12501 Georgia Avenue",
                "Zip": "20906"
            },
            "Code": "B11",
            "Lat": 39.0617837655,
            "LineCode1": "RD",
            "LineCode2": null,
            "LineCode3": null,
            "LineCode4": null,
            "Lon": -77.0535573593,
            "Name": "Glenmont",
            "StationTogether1": "",
            "StationTogether2": ""
        }
    ]
}
````