var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
let state = context.getImageData(0, 0, canvas.width, canvas.height);
window.history.pushState(state, null);
window.addEventListener('popstate', changeStep, false);
window.addEventListener("load", drawing);
var Brush = document.getElementById("brush");
var Font = document.getElementById("font");
var rgbcolor = 'rgba(255,0,0,1)';
var fill;
var sides;

mode = "pen";
context.font = Brush.value + "px " + Font.value;
context.lineWidth = Brush.value;
context.strokeStyle = rgbcolor;
count = true;


var word = document.createElement("textarea");
old = { x: null, y: null };

var mouse_x, mouse_y, snapshot, dragStartLocation;

function drawing() {
    console.log(context.strokeStyle);
    var Draw = this.document.querySelector("#myCanvas");
    Draw.addEventListener("mousedown", mouseDown, false);
    Draw.addEventListener("mousemove", mouseMove, false);
    Draw.addEventListener("mouseup", mouseUp, false);
}

//set--------------------------------------------------------

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    console.log(rect.left, rect.top);
    return {
        x: evt.clientX - rect.left - 50,
        y: evt.clientY - rect.top - 50
    };
}

function mouseDown(evt) {

    console.log(count);
    if (mode == "text" && count) {
        word.remove();
        word = document.createElement("textarea");
        var mousepos = getMousePos(canvas, evt);
        old.x = mousepos.x, old.y = mousepos.y;
        var text_content;


        function texthandle(e) {
            if (e.key == "Backspace") {
                word.value--;
            } else if (e.key == "Enter") {
                window.removeEventListener('keyup', texthandle);
            } else {
                word.value += e.key;
                console.log(context.font);
                text_content = word.value;
                context.fillText(text_content, mousepos.x, mousepos.y);
                window.addEventListener('mousedown', function() {
                    window.removeEventListener('keyup', texthandle);
                })
            }

        }
        window.addEventListener('keyup', texthandle);



    } else {
        console.log("md");
        this.draw = true;
        var mousepos = getMousePos(canvas, evt);
        mouse_x = mousepos.x;
        mouse_y = mousepos.y;
        dragStartLocation = { x: mousepos.x, y: mousepos.y };
        snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
    }
    console.log(dragStartLocation);
}

function mouseMove(evt) {
    console.log("mv");

    console.log(context.globalCompositeOperation);
    if (this.draw) {
        context.beginPath();
        var mousepos = getMousePos(canvas, evt);
        if (mode == "pen") {
            context.globalCompositeOperation = "source-over";
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.moveTo(mouse_x, mouse_y); //old xy
            context.lineTo(mousepos.x, mousepos.y);
            context.stroke();
        } else if (mode == "circle") {

            context.globalCompositeOperation = "source-over";
            context.putImageData(snapshot, 0, 0);
            radius = Math.sqrt(Math.pow(mousepos.x - dragStartLocation.x, 2) + Math.pow(mousepos.y - dragStartLocation.y, 2)) / 2
            context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI, false);
            if (fill) context.fill();
            else {
                context.stroke();
            }
        } else if (mode == "Triangle") {

            context.globalCompositeOperation = "source-over";
            context.putImageData(snapshot, 0, 0);
            var coordinate = [];
            index = 0, angle = 2 * Math.PI / sides;
            radius = Math.sqrt(Math.pow(mousepos.x - dragStartLocation.x, 2) + Math.pow(mousepos.y - dragStartLocation.y, 2)) / 2
            for (index; index < sides; index++) {
                coordinate[index] = {
                    x: dragStartLocation.x + radius * Math.cos(angle),
                    y: dragStartLocation.y - radius * Math.sin(angle)
                };
                angle += (2 * Math.PI) / sides;
            }
            context.beginPath();
            context.moveTo(coordinate[0].x, coordinate[0].y);
            for (index = 1; index < sides; index++) {
                context.lineTo(coordinate[index].x, coordinate[index].y);
            }
            if (fill) context.fill();
            else {
                context.closePath();
                context.stroke();
            }
        } else if (mode == "polygon") {
            context.globalCompositeOperation = "source-over";
            context.putImageData(snapshot, 0, 0);
            var coordinate = [];
            index = 0, angle = 2 * Math.PI / sides;
            radius = Math.sqrt(Math.pow(mousepos.x - dragStartLocation.x, 2) + Math.pow(mousepos.y - dragStartLocation.y, 2)) / 2
            for (index; index < sides; index++) {
                coordinate[index] = {
                    x: dragStartLocation.x + radius * Math.cos(angle),
                    y: dragStartLocation.y - radius * Math.sin(angle)
                };
                angle += (2 * Math.PI) / sides;
            }
            context.beginPath();
            context.moveTo(coordinate[0].x, coordinate[0].y);
            for (index = 1; index < sides; index++) {
                context.lineTo(coordinate[index].x, coordinate[index].y);
            }
            if (fill) context.fill();
            else {
                context.closePath();
                context.stroke();
            }
        } else if (mode == "rect") {
            context.globalCompositeOperation = "source-over";
            context.putImageData(snapshot, 0, 0);
            context.rect((dragStartLocation.x - Math.abs(mousepos.x - dragStartLocation.x)), (dragStartLocation.y - Math.abs(mousepos.y - dragStartLocation.y)), 2 * Math.abs(mousepos.x - dragStartLocation.x), 2 * Math.abs(mousepos.y - dragStartLocation.y));
            context.stroke();
            if (fill) context.fill();
            else {
                context.closePath();
                context.stroke();
            }

        } else {
            context.globalCompositeOperation = "destination-out";
            context.arc(mouse_x, mouse_y, brush.value, 0, 2 * Math.PI);
            context.fill();
            if (fill) context.fill();
            else {
                context.closePath();
                context.stroke();
            }
        }
        mouse_x = mousepos.x;
        mouse_y = mousepos.y;
    }
}

function mouseUp(evt) {
    console.log("mu");
    var mousepos = getMousePos(canvas, evt);
    if (mode == "circle") {
        context.putImageData(snapshot, 0, 0);
        radius = Math.sqrt(Math.pow(mousepos.x - dragStartLocation.x, 2) + Math.pow(mousepos.y - dragStartLocation.y, 2)) / 2
        context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI, false);
        if (fill) context.fill();
        else {
            context.stroke();
        }
    }
    if (mode == "Triangle") {
        context.putImageData(snapshot, 0, 0);
        var coordinate = [];
        index = 0, angle = 2 * Math.PI / sides;
        radius = Math.sqrt(Math.pow(mousepos.x - dragStartLocation.x, 2) + Math.pow(mousepos.y - dragStartLocation.y, 2)) / 2
        for (index; index < sides; index++) {
            coordinate[index] = {
                x: dragStartLocation.x + radius * Math.cos(angle),
                y: dragStartLocation.y - radius * Math.sin(angle)
            };
            angle += (2 * Math.PI) / sides;
        }
        context.beginPath();
        context.moveTo(coordinate[0].x, coordinate[0].y);
        for (index = 1; index < sides; index++) {
            context.lineTo(coordinate[index].x, coordinate[index].y);
        }
        if (fill) context.fill();
        else {
            context.closePath();
            context.stroke();
        }
    }
    if (mode == "polygon") {
        context.putImageData(snapshot, 0, 0);
        var coordinate = [];
        index = 0, angle = 2 * Math.PI / sides;
        radius = Math.sqrt(Math.pow(mousepos.x - dragStartLocation.x, 2) + Math.pow(mousepos.y - dragStartLocation.y, 2)) / 2
        for (index; index < sides; index++) {
            coordinate[index] = {
                x: dragStartLocation.x + radius * Math.cos(angle),
                y: dragStartLocation.y - radius * Math.sin(angle)
            };
            angle += (2 * Math.PI) / sides;
        }
        context.beginPath();
        context.moveTo(coordinate[0].x, coordinate[0].y);
        for (index = 1; index < sides; index++) {
            context.lineTo(coordinate[index].x, coordinate[index].y);
        }
        if (fill) context.fill();
        else {
            context.closePath();
            context.stroke();
        }
    }
    if (mode == "rect") {
        context.globalCompositeOperation = "source-over";
        context.putImageData(snapshot, 0, 0);
        context.rect((dragStartLocation.x - Math.abs(mousepos.x - dragStartLocation.x)), (dragStartLocation.y - Math.abs(mousepos.y - dragStartLocation.y)), 2 * Math.abs(mousepos.x - dragStartLocation.x), 2 * Math.abs(mousepos.y - dragStartLocation.y));
        context.stroke();
        if (fill) context.fill();
        else {
            context.closePath();
            context.stroke();
        }
    }
    mouse_x = mousepos.x;
    mouse_y = mousepos.y;
    this.draw = false;
    var state = context.getImageData(0, 0, canvas.width, canvas.height);
    window.history.pushState(state, null);
}

function changeStep(e) {
    // 清除畫布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 透過 e.state 取得先前存到 window.history 的狀態
    if (e.state) {
        context.putImageData(e.state, 0, 0);
    }
}
//------------------------------------------------------------set


//style
function DrawCircle() {
    mode = "circle";
    fill = true;
    canvas.style.cursor = "url('./icon/circle.png'),move";
    context.fillStyle = rgbcolor;
}

function DrawTriangle() {
    mode = "Triangle";
    fill = true;
    sides = 3;
    canvas.style.cursor = "url('./icon/tri.png'),zoom-in";
    context.fillStyle = rgbcolor;
}

function DrawSquare() {
    mode = "Square";
    sides = 4;
    fill = true;
    context.fillStyle = rgbcolor;
}

function DrawRectangle() {
    mode = "rect";
    fill = true;
    canvas.style.cursor = "url('./icon/rect.png'),zoom-in";
    context.fillStyle = rgbcolor;
}

function Drawsquare() {
    mode = "Square";
    sides = 4;
    fill = false;
}

function Drawrectangle() {
    mode = "rect";
    canvas.style.cursor = "url('./icon/emp_rect.png'),zoom-in";
    fill = false;
}

function Drawtriangle() {
    mode = "Triangle";
    fill = false;
    sides = 3;
    canvas.style.cursor = "url('./icon/emp_tri.png'),zoom-in";
}

function Drawcircle() {
    mode = "circle";
    fill = false;
    canvas.style.cursor = "url('./icon/emp_circle.png'),move";
}

function Drawpolygon() {
    mode = "polygon";
    fill = true;
    context.fillStyle = rgbcolor;
}

function pencil() {
    mode = "pen";
    canvas.style.cursor = "url('./cursor/a2.png'),pointer";
}

function erase() {
    mode = "eraser";
    canvas.style.cursor = "url('./icon/51.png'),crosshair";
}

function text() {
    mode = "text";
    canvas.style.cursor = "text";
}

brush.oninput = function() {
    context.lineWidth = this.value;
    context.font = this.value + "px " + Font.value;
}

font.onchange = function() {
    context.font = Brush.value + "px " + this.value;
}

function sidechange() {
    sides = document.getElementById("sideinput").value;
}

undo.addEventListener('click', function() {
    window.history.go(-1);
}, false);

redo.addEventListener('click', function() {
    window.history.go(1);
})

function clearPad(e) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function download() {
    var link = document.createElement('a');
    link.download = 'myCanvas.png';
    link.href = canvas.toDataURL()
    link.click();
}


upload.onchange = function upload() {
    var img = new Image();
    img.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        context.drawImage(this, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(src);
    }
    var file = this.files[0];
    img.src = URL.createObjectURL(file);
}

//palatte---------------------------------------------------------------
var colorBlock = document.getElementById('color-block');
var CB = colorBlock.getContext("2d");
CB.rect(1, 1, colorBlock.width, colorBlock.height);

var colorStrip = document.getElementById('color-strip');
var CS = colorStrip.getContext("2d");
CS.rect(0, 0, colorStrip.width, colorStrip.height);
var grad = CS.createLinearGradient(0, 0, 0, colorBlock.height);
grad.addColorStop(0, 'rgba(255, 0, 0, 1)');
grad.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
grad.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
grad.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
grad.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
grad.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
grad.addColorStop(1, 'rgba(255, 0, 0, 1)');
CS.fillStyle = grad;
CS.fill();



function fillGradient() {
    CB.fillStyle = rgbcolor;
    CB.fillRect(0, 0, colorBlock.width, colorBlock.height);

    var grdWhite = CS.createLinearGradient(0, 0, colorBlock.width, 0);
    grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
    grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
    CB.fillStyle = grdWhite;
    CB.fillRect(0, 0, colorBlock.width, colorBlock.height);

    var grdBlack = CS.createLinearGradient(0, 0, 0, colorBlock.height);
    grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
    grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
    CB.fillStyle = grdBlack;
    CB.fillRect(0, 0, colorBlock.width, colorBlock.height);
}
fillGradient();

function changeblock(e) {
    x = e.offsetX;
    y = e.offsetY;

    var imageData = CS.getImageData(x, y, 1, 1).data;
    rgbcolor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    fillGradient();
}
colorStrip.addEventListener('click', changeblock, false);

function changelabel(e) {
    x = e.offsetX;
    y = e.offsetY;

    var imageData = CB.getImageData(x, y, 1, 1).data;
    rgbcolor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    var colorLabel = document.getElementById('color-label');
    colorLabel.style.backgroundColor = rgbcolor;
    context.strokeStyle = rgbcolor;
    context.fillStyle = rgbcolor;

}
colorBlock.addEventListener('click', changelabel, false);