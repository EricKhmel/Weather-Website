var url1 = "https://api.tomtom.com/search/2/search/";
var url2 = "https://api.openweathermap.org/data/3.0/onecall?";
var lat = 0;
var lon = 0;
var country = "";
var subcountry = "";
var exc = "current,minutely,hourly";
var apikey1 = "UMn6W2KNpnXeG5KXswmvG5W2aa9Al0vu";
var apikey2 = "1235744e1f4359c4f4f3097f0d8fe64a";
var input = "";
var dates = [];
var days = [];
var highs = [];
var lows = [];
var forecasts = [];
var icons = [];
var vis = 0;
var hum = [];
var iconurl = [];
var MapJson = {};
var WeatherJson = {};

function callTomTom() {
	input = document.getElementById("inp").value;	
	$.ajax({
		url: url1 + input + ".json?typeahead=true&minFuzzyLevel=1&maxFuzzyLevel=4&view=Unified&relatedPois=all&key=" + apikey1,
		method: "GET"
	}).done(function (result) {
		MapJson = result;
		lat = result.results[0].position.lat;
		lon = result.results[0].position.lon;
		country = result.results[0].address.country;
		subcountry = result.results[0].address.countrySubdivision;
		callWeather();
	}).fail(function (e) {
		console.log(e);
	});
}

function callWeather() {
	$.ajax({
		url: url2 + "lat=" + lat + "&lon=" + lon+ "&exclude=" + exc + "&appid=" + apikey2,
		method: "GET"
	}).done(function (result) {
		WeatherJson = result;
		//vis = result.current.visibility;
		for(let i = 0; i < 5; i++){
			dates[i] = new Date((result.daily[i].dt) * 1000);
			days[i] = (new Date((result.daily[i].dt) * 1000)).getDay();
			highs[i] = (1.8 * ((result.daily[i].temp.max) - 273.15)) + 32;
			lows[i] = (1.8 * ((result.daily[i].temp.min) - 273.15)) + 32;
			forecasts[i] = result.daily[i].weather[0].description;
			icons[i] = result.daily[i].weather[0].icon;
			hum[i] = result.daily[i].humidity;
		}
		printWeather();
	}).fail(function (e) {
		console.log(e);
	});
}

function printWeather(){
	$("#w1").css("visibility", "hidden");
 	$("#w2").css("visibility", "visible");
	for(let i = 1; i < 6; i++){
		let y = dates[i-1].getFullYear();
		let m = dates[i-1].getMonth();
		let d = dates[i-1].getDate();
		let day = days[i-1]
		$("#col" + i).append("<br><p>" + getDay(day) + "</p>");
		$("#col" + i).append("<p>" + m + "/" + d + "/" + y + "</p><br>");
		$("#col" + i).append("<p>Forecast: " + forecasts[i-1] + "</p>");
		$("#col" + i).append("<img src='http://openweathermap.org/img/wn/" + icons[i-1] + ".png' width='100px' height='100px'><br><br>");
		$("#col" + i).append("<p>High: " + Math.trunc(highs[i-1]) + "°F</p>");
		$("#col" + i).append("<p>Low: " + Math.trunc(lows[i-1]) + "°F</p>");
		$("#col" + i).append("<p>Humidity: " + hum[i-1] + "%</p><br>");
	}
	$("#location").append(subcountry + ", " + country);
	$.ajax({
		url: "../final.php?method=setWeather&Location=" + input + "&MapJson=" + MapJson + "&WeatherJson=" + WeatherJson,
		method: "GET",
	}).done(function (result) {
                console.log("History status: " + result.status);
        }).fail(function(e) {
                console.log(e);
	});
}

function getDay(n){
	let d = "";
	switch(n){
		case 0:
			d = "Sunday";
			break;
		case 1:
			d = "Monday";
			break;
		case 2:
			d = "Tuesday";
			break;
		case 3:
			d = "Wednesday";
			break;
		case 4:
			d = "Thursday";
			break;
		case 5:
			d = "Friday";
			break;
		case 6:
			d = "Saturday";
			break;
	}
	return d;
}

function callRest(){
	var dateinput = new Date(document.getElementById("dt").value);
	var lineinput = document.getElementById("ln").value;
	let y = dateinput.getFullYear();
        let m = dateinput.getMonth();
        let d = dateinput.getDate();
	$("#w1").css("visibility", "hidden");
	$("#w2").css("visibility", "visible");
	$.ajax({
                url: "../final.php?method=getWeather&date=" + y + "-" + (m + 1) + "-" + (d + 1),
                method: "GET"
        }).done(function (data) {
		console.log(JSON.stringify(data)); 
		for(let i = 0; i < 7; i++){
			let d = new Date(JSON.parse(data.result[i].DateTime)) ; 
			let c11 = d.getFullYear();
			let c12 = d.getMonth();
           	     	let c13 = d.getDate();
			let c2 = d.getTime();
			let c3 = data.result[i].Location;
			printTable(c11, c12, c13, c2, c3);			
		}
                console.log("Query status: " + data.status);
        }).fail(function(e) {
                console.log(e);
        });
}
function printTable(c11, c12, c13, c2, c3){
	$("#t1").append("<tr>");
	$("#t1").append("<td>" + c12 + "-" + c13 + "-" + c11 + "</td>");
	$("#t1").append("<td>" + c2 + "</td>");
	$("#t1").append("<td>" + c3 + "</td>");
	$("#t1").append("</tr>");
}
