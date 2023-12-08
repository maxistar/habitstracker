//Required package
var pdf = require("pdf-creator-node");
var fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
// Read HTML Template
var html = fs.readFileSync("template.html", "utf8");



let tableRows = [];
const numberOfDays = 44;
const habits = [
    {name: "Wake up Exercise"},
    {name: "Do not eat after 18PM"},
    {name: "Go sleep without phone"},
    {name: "Use mouth freshener"},
    {name: "Use deodorant"},
    {name: "Read with Iura"},
    {name: "Say Good Night"},
    {name: "10 Sätze in Deutsch"},
    {name: "15 minutes eye relax"},
];


for(let i = 0; i < numberOfDays; i++) {
    tableRows.push({day: i + 1, habits: habits})
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

function fileResolve(relativePath) {
    if (!relativePath) {
        return null;
    }
    return "file://" + path.resolve(relativePath);
}

function convertFileToBase64(filePath) {
    try {
        // Read the file synchronously
        const data = fs.readFileSync(filePath);

        // Convert the file data to a base64 string
        const base64String = data.toString('base64');

        return base64String;
    } catch (err) {
        console.error(`Error reading file: ${err.message}`);
        return null;
    }
}

async function main() {
    const qrcode = await createQRCode('http://maxistar.ru');

    const options = {
        format: "A4",
        orientation: "portrait",
        border: "8mm",
        header: {
            height: "10mm",
            contents: '<div style="text-align: center;">Habit Calendar</div>'
        },
        footer: {
            height: "5mm",
            contents: {
                default: '<span style="color: #444;">Habits Tracker v0.1</span>',
            }
        }
    };
    
    const document = {
        html: html,
        data: {
            qrcode: qrcode,
            tableRows: tableRows,
            habits: habits,
            cssFonts: fileResolve("./assets/style.css"),
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
