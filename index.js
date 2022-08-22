const http = require('http');
const fs = require('fs');
var requests = require('requests');
const homeFile = fs.readFileSync("home.html", "utf-8")
const replaceval = (tempval, orgval) => {
    let tocel = 274.15;
    const tempcalc = (orgval.main.temp - tocel).toFixed(2)
    const tempcalcmax = (orgval.main.temp_max - tocel).toFixed(2)
    const tempcalcmin = (orgval.main.temp_min - tocel).toFixed(2)

    let temprature = tempval.replace("{%tempval%}", tempcalc)
    temprature = temprature.replace("{%tempmin%}", tempcalcmin)
    temprature = temprature.replace("{%tempmax%}", tempcalcmax)
    temprature = temprature.replace("{%location%}", orgval.name)
    temprature = temprature.replace("{%country%}", orgval.sys.country)
    temprature = temprature.replace("{%tempStatus%}", orgval.weather[0].main)
    console.log(orgval.weather[0].main)

    return temprature;

}
const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests("https://api.openweathermap.org/data/2.5/weather?q=mumbai&appid=b85a18c8d2159c78608d68596c0896ae")
            .on('data', (chunk) => {

                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                // console.log(arrdata[0].main.temp);
                const realtmdata = arrdata.map((val) =>
                    replaceval(homeFile, val)).join("");
                // res.write(realtmdata);)
                // console.log(realtmdata);
                res.write(realtmdata);
                // console.log(realtmdata)

            })
            .on('end', (err) => {
                if (err) return console.log("connection closed due to error", err)
                res.end();
            })
    }
});

server.listen(8000, "127.0.0.1")