var request = require("request-promise"),
    cheerio = require("cheerio"), fs = require('fs'), conn = require('./db');
;
var data = JSON.parse(fs.readFileSync('views/test.json'));

//console.log(data);


function parserHTML() {
setTimeout(()=>console.log("sq"),5000);
    let arr = "";
    let vall = "";
    let summ = "";


    function insert() {

        const insertSql = `INSERT INTO projects(${arr})VALUES(${vall})`;
        console.log(insertSql);
        conn.query(insertSql, function (err, results) {
            if (err) throw err;
            console.log("insert to finish");
        });

        const time = [2, 12, 36, 72, 144, 288];
        time.forEach(function (value, index) {
            const sumSQL = `SELECT ${summ} FROM (SELECT * FROM projects ORDER BY id DESC LIMIT 0 , ${value}) t ORDER BY id ASC;`
            conn.query(sumSQL, function (err, results) {
                if (err) throw err;
                /*results.forEach(function (value1,index1) {
                    data[index1].timefilter[index] = value1;
                })*/
                //results = JSON.parse(results);
                let row = "";
                Object.keys(results).forEach(function (key) {
                    row = results[key];
                });
                console.log(row);

                switch (value) {
                    case 2:
                        data.forEach(function (value1, index1) {
                            value1.ten = row[`${value1.number}`];
                            console.log(index + "  " + value1.number + "  " + value1.ten);
                        });
                        break;
                    case 12:
                        data.forEach(function (value1, index1) {
                            value1.hour1 = row[`${value1.number}`];
                            console.log(index + "  " + value1.number + "  " + value1.ten);
                        });
                        break;
                    case 36:
                        data.forEach(function (value1, index1) {
                            value1.hour3 = row[`${value1.number}`];
                            console.log(index + "  " + value1.number + "  " + value1.ten);
                        });
                        break;
                    case 72:
                        data.forEach(function (value1, index1) {
                            value1.hour6 = row[`${value1.number}`];
                            console.log(index + "  " + value1.number + "  " + value1.ten);
                        });
                        break;
                    case 144:
                        data.forEach(function (value1, index1) {
                            value1.hour12 = row[`${value1.number}`];
                            console.log(index + "  " + value1.number + "  " + value1.ten);
                        });
                        break;
                    case 288:
                        data.forEach(function (value1, index1) {
                            value1.hour24 = row[`${value1.number}`];
                            console.log(index + "  " + value1.number + "  " + value1.ten);
                        });
                        break;
                }
                console.log(data);
            });
        });


    }

    let index = 0;
    let options = {
        uri: data[index].link,
        transform: function (body) {
            return cheerio.load(body);
        }
    }
    let row = null;
    const sqlVal = "SELECT * FROM (SELECT * FROM `projects` ORDER BY id DESC LIMIT 0 , 1) t ORDER BY id ASC;";
    conn.query(sqlVal, function (err, results) {
        console.log(results);
        if(results.length != 0 )
        Object.keys(results).forEach(function (key) {
            row = results[key];
        });
        else
            row = 0;
    });
    function parse($) {
        data[index].suffrage = $(".votes-count").find("strong").html();
        console.log("finish" + index);
        //console.log(row);
        if(row != 0)
        {
            console.log(row[`pr${data[index].number}`]);
            data[index].suffrage -= row[`pr${data[index].number}`];
            console.log(data[index].suffrage);
        }
        //console.log(data.length);
        if (index == (data.length - 1)) {
            vall += `'${data[index].suffrage}'`;
            arr += `pr${data[index].number}`;
            summ += `SUM(pr${data[index].number}) as '${data[index].number}'`;
            console.log("insert start");
            insert();
        } else {
            arr += `pr${data[index].number}, `;
            vall += `'${data[index].suffrage}',`;
            summ += `SUM(pr${data[index].number}) as '${data[index].number}',`;
            console.log("rekurs")
            options.uri = data[++index].link;
            request(options).then(parse);
        }

    }
    request(options).then(parse).catch(function (err) {
        console.log("Произошла ошибка: " + err);
    })
};

parserHTML();
setInterval(parserHTML, 300000);
module.exports = data;

//value1.suffrage = __$(".status").text();
/*SELECT SUM(pr732),SUM(pr2095)
   FROM (SELECT *
      FROM `projects` ORDER BY id DESC LIMIT 0 , 6) t
ORDER BY id ASC;
"SELECT SUM(pr732) as '732',SUM(pr732) as '7327' FROM (SELECT * FROM projects ORDER BY id DESC LIMIT 0 , 6) t ORDER BY id ASC;"
 switch (value) {
                        case 2:
                            data[index].ten = value1;
                            break;
                        case 12:
                            data[index].hour1 = value1;
                            break;
                        case 36:
                            data[index].hour3 = value1;
                            break;
                        case 72:
                            data[index].hour6 = value1;
                            break;
                        case 144:
                            data[index].hour = value1;
                            break;
                        case 288:
                            data[index].ten = value1;
                            break;
                    }

                     SELECT * FROM (SELECT * FROM `projects` ORDER BY id DESC LIMIT 0 , 1) t ORDER BY id ASC;*/