Chart.defaults.global.animation = false;
function BuildChart(labels, values, chartTitle) {
    var data = {
        labels: labels,
        datasets: [{
            label: chartTitle, // Name the series
            data: values,
            backgroundColor: ['#d62828'],
            fill: true,
        }],
    };
    var ctx = document.getElementById("myChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Zeit'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperatur'
                    }
                }]
            },
        }
    });
    return myChart;
}

function updateChart() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.response);
            var labels = json.map(function (e) {
                let btime = new Date(e.time);
                let zeit = btime.toLocaleTimeString('de-DE');
                return zeit
            });
            var values = json.map(function (e) {
                return (e.temperatur);
            });

            BuildChart(labels, values, "Tankwächter")
        }
    }

    xhttp.open("GET", "http://172.16.2.68:3000/api/v1", false);
    xhttp.send();
}

function updateTemp() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var json = JSON.parse(this.response);
            document.getElementById('akttemp').innerHTML = "" + json[0].temperatur + "°C";
            let atime = new Date(json[0].time);
            let ptime = atime.toLocaleTimeString('de-DE');
            document.getElementById('akttime').innerHTML = "Messung um " + ptime + " Uhr" 

            BuildChart(labels, values, "Tankwächter")
        }
    }

    xhttp.open("GET", "http://172.16.2.68:3000/api/v1/temp", false);
    xhttp.send();
}

updateTemp();
updateChart();

setInterval(updateTemp, 30000)
setInterval(updateChart, 30000)