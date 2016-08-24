var avatarMargin = 20;
var blockSize = 50;
var avatarCanvasSize = 2*avatarMargin + 5*blockSize;

var fillColor = "#539dc2";
var backgroundColor = "#f0f0f0";

var textBoxPreviousValue = "";

//Drawing

function drawLine(x1, y1, x2, y2)
{
    var gridCanvas = document.getElementById("gridCanvas");
    var context = gridCanvas.getContext("2d");
    
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.strokeStyle = "#606060";
    context.stroke();
}

function drawLines()
{
    for(var i = avatarMargin; i <= avatarCanvasSize-avatarMargin; i+=blockSize)
    {
        drawLine(i, 0, i, avatarCanvasSize);
        drawLine(0, i, avatarCanvasSize, i);
    }
}

function paintBlock(corner)
{
    var canvasAvatar = document.getElementById("avatarCanvas");
    var context = canvasAvatar.getContext("2d");
    var pixel = context.getImageData(
        avatarMargin+corner[1],
        avatarMargin+corner[0],
        1,1).data;
    
    var currentColor = 
        "#" +("000000" + rgbToHex(pixel[0], pixel[1], 
                                  pixel[2])).slice(-6);

    if(currentColor == fillColor)
    {
        context.fillStyle = backgroundColor;
    }
    else
    {
        context.fillStyle = fillColor;
    }

    context.fillRect(avatarMargin+corner[1], 
                     avatarMargin+corner[0], 
                     blockSize, blockSize);
}

function changeColor()
{
    var textBox = document.getElementById("textBox");
    if(!/^[0-9A-F]*$/i.test(textBox.value)) //Check for valid hexcode
    {
        textBox.value = textBoxPreviousValue;
        return;
    }
    textBoxPreviousValue = textBox.value;
    if(textBox.value.length == 6 || textBox.value.length == 3) //Check for valid color length, 3 and 6 are fine
    {
        fillColor = "#" + textBox.value.toLowerCase();
    }
}

//Misc
function componentToHex(c) 
{
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) 
{
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


//Logic

function getBlockCorner(event)
{
    var canvasAvatar = document.getElementById("avatarCanvas");
    var rect = canvasAvatar.getBoundingClientRect();
    
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    
    x -= avatarMargin;
    y -= avatarMargin;

    if(x < 0 || y < 0|| x >250 || y >250 ) return;

    var corner = [0, 0];
    var column = Math.floor(x/blockSize);
    var row = Math.floor(y/blockSize);
    
    corner[0] = row*blockSize;
    corner[1] = column*blockSize;

    paintBlock(corner);
}

//Download
function downloadAvatar()
{
    var canvas = document.getElementById("avatarCanvas");
    download("gavatar", canvas);
}

function download(filename, canvas) 
{
    var canvasContext = canvas.getContext("2d");
    var imageData = canvasContext.getImageData(
        0,
        0,
        canvas.width,
        canvas.height);
    var saveCanvas = document.createElement("canvas");
    saveCanvas.width = canvas.width;
    saveCanvas.height = canvas.height;
    var saveCanvasContext = saveCanvas.getContext('2d');
    saveCanvasContext.putImageData(imageData, 0, 0);
    var link = document.createElement('a'), e;
    link.download = filename;
    link.href = saveCanvas.toDataURL();
    if (document.createEvent) 
    {
        e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, true, window,
                         0, 0, 0, 0, 0, false, false, false,
                         false, 0, null);
        
        link.dispatchEvent(e);
    } 
    else if (lnk.fireEvent) 
    {
        link.fireEvent("onclick");
    }
}
