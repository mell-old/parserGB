var request = require("request"),
    cheerio = require("cheerio"),fs = require('fs');
var data;

function parseHTML()
{
   data = JSON.parse(fs.readFileSync('views/project.json'));
    //console.log(data);
    data.forEach(function (value1, index) {
        request(value1.link, function (error, response, body) {
            if (!error) {
                var __$ = cheerio.load(body);
                //value1.suffrage = __$(".votes-count").find("strong").html();
                value1.suffrage = __$(".status").text();
            } else {
                console.log("Произошла ошибка: " + error);
            }
        });
    })

}
parseHTML();
module.exports = data;