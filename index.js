//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");
const QRCode = require("qrcode");
// Read HTML Template
var html = fs.readFileSync("template.html", "utf8");

var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "15mm",
        contents: '<div style="text-align: center;">Habit Calendar</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            first: 'Cover page',
            2: 'Second page', // Any page number is working. 1-based index
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
            last: 'Last Page'
        }
    }
};

let tableRows = [];
const numberOfDays = 40;
const habits = [
    {name: "Habit 1"},
    {name: "Habit 2"},
    {name: "Habit 3"},
    {name: "Habit 4"},
    {name: "Habit 5"},
    {name: "Habit 6"},
];


for(let i = 1; i < numberOfDays; i++) {
    tableRows.push({day: i, habits: habits})
}




async function createQRCode(url) {
    return new Promise((resolve) => {
        QRCode.toDataURL(
            url,
            (err, url) => {
                resolve(url);
            }
        )
    });
}

async function main() {
    const qrcode = await createQRCode('http://maxistar.ru');

    const document = {
        html: html,
        data: {
            qrcode: qrcode,
            tableRows: tableRows,
            habits: habits
        },
        path: "./output.pdf",
        type: "",
    };
    
    pdf
        .create(document, options)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.error(error);
        });

}

main()
    .then()








