const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const html = fs.readFileSync("template.html", "utf8");
const { createCanvas } = require('canvas');

async function generateLeftTopCorner() {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 10, 100);
    ctx.fillRect(0, 0, 100, 10);
    
    // Convert canvas to a Buffer representing a PNG image
    const buffer = canvas.toBuffer('image/png');

    // Convert the Buffer to a base64-encoded string
    const base64Image = buffer.toString('base64');

    return `data:image/png;base64,${base64Image}`;
}

async function generateLeftBottomCorner() {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 10, 100);
    ctx.fillRect(0, 90, 100, 10);

    // Convert canvas to a Buffer representing a PNG image
    const buffer = canvas.toBuffer('image/png');

    // Convert the Buffer to a base64-encoded string
    const base64Image = buffer.toString('base64');

    return `data:image/png;base64,${base64Image}`;
}

async function generateRightTopCorner() {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(90, 0, 10, 100);
    ctx.fillRect(0, 0, 100, 10);

    // Convert canvas to a Buffer representing a PNG image
    const buffer = canvas.toBuffer('image/png');

    // Convert the Buffer to a base64-encoded string
    const base64Image = buffer.toString('base64');

    return `data:image/png;base64,${base64Image}`;
}


async function generateImageWithText(text) {
    // Create a canvas
    // Create a canvas
    const canvas = createCanvas(100, 250);
    const ctx = canvas.getContext('2d');

    // Set background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.font = '20px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate text position
    const textX = canvas.width / 2;
    const textY = canvas.height / 2;

    // Rotate the context by 90 degrees counterclockwise
    ctx.rotate(-Math.PI / 2);

    // Draw text on the canvas
    ctx.fillText(text, -textY, textX);

    // Reset the rotation
    ctx.rotate(Math.PI / 2);

    // Convert canvas to a Buffer representing a PNG image
    const buffer = canvas.toBuffer('image/png');

    // Convert the Buffer to a base64-encoded string
    const base64Image = buffer.toString('base64');

    return `data:image/png;base64,${base64Image}`;
}


const numberOfDays = 40;


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
    const qrcode = await createQRCode('https://maxistar.ru');
    const leftTopCornerImage = await generateLeftTopCorner();
    const leftBottomCornerImage = await generateLeftBottomCorner();
    const rightTopCornerImage = await generateRightTopCorner();
    let tableRows = [];
    const habits = [
        {name: "Wake up Exercise", textImage: await generateImageWithText("Wake up Exercise")},
        {name: "Do not eat after 18PM", textImage: await generateImageWithText("Do not eat after 18PM")},
        {name: "Go sleep without phone", textImage: await generateImageWithText("Go sleep without phone")},
        {name: "Use mouth freshener", textImage: await generateImageWithText("Use mouth freshener")},
        {name: "Use deodorant", textImage: await generateImageWithText("Use deodorant")},
        {name: "Read with Jura", textImage: await generateImageWithText("Read with Jura")},
        {name: "Say Good Night", textImage: await generateImageWithText("Say Good Night")},
        {name: "10 Sätze in Deutsch", textImage: await generateImageWithText("10 Sätze in Deutsch")},
        {name: "15 minutes eye relax", textImage: await generateImageWithText("15 minutes eye relax")},
    ];
    for(let i = 0; i < numberOfDays; i++) {
        tableRows.push({day: i + 1, habits: habits})
    }
    
    const options = {
        format: "A4", 
        orientation: "portrait",
        border: "8mm",
        header: {
            height: "10mm",
            contents: '<div style="text-align: center;"><img src="' + leftTopCornerImage + '" alt="qrcode" class="left-top-marker" />Habit Tracker List<img src="' + rightTopCornerImage + '" alt="qrcode" class="right-top-marker" /></div>'
        },
        footer: {
            height: "25mm",
            contents: {
                default: '<img src="' + leftBottomCornerImage + '" alt="qrcode" class="left-bottom-marker" /><span class="habit-version">Habits Tracker v0.1</span><div class="qrcode"><img src="' + qrcode + '" alt="qrcode" class="qrcode" /></div>',
            }
        }
    };


    
    const document = {
        html: html,
        data: {
            leftTopCornerImage,
            rightTopCornerImage,
            leftBottomCornerImage,
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
