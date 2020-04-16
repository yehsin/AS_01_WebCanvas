# Software Studio 2020 Spring
# Assignment 01 Web Canvas
[TOC]

## Appearance
![](https://i.imgur.com/h47XEnI.png)

# Basic component

## Basic control tools
- **Brush**
>> ![](https://i.imgur.com/wTkajDJ.png)
>> - 當使用者按下這個按鈕便能實作畫筆的功能 -> onclick = pencil()
>> - pencil的能裡，會將模式轉換成 **pen** 此時在當滑鼠在畫布上操作時，就會執行畫筆的功能
>> - 詳細功能
>> >> * 於一開始時，會先做 beginpath()開始畫路徑之意，之後為確保在使用像題擦後不會一直是 destination-over的狀態，因此只要不是橡皮擦的功能都會做 source-over的設定。
>> >> * linecap、lineJoin = round 目的為使筆順不會很像毛筆刷開時的感覺。
>> >> * 從 mouse_x、mouse_y (舊座標) **lineto** mousepos.x、mousepos.y(新座標) ，stroke為將兩點連線。利用許多的小直線便能製作出看起來不規則的畫。

```javascript=
context.beginPath();
var mousepos = getMousePos(canvas, evt);
if (mode == "pen") {
    context.globalCompositeOperation = "source-over";
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.moveTo(mouse_x, mouse_y); //old xy
    context.lineTo(mousepos.x, mousepos.y);
    context.stroke();
}
```

- **Eraser**
>> ![](https://i.imgur.com/nxKIUFr.png)
>> * 詳細功能
>> >> * globalCompositeOperation = destination-out 能夠將圖形重疊部分消除，eraser便是利用此原理進行橡皮擦的功能。
~~~javascript
context.globalCompositeOperation = "destination-out";
            context.arc(mouse_x, mouse_y, brush.value, 0, 2 * Math.PI);
            context.fill();
~~~


- **Color selector**
>> ![](https://i.imgur.com/mXkVsxM.png)

>> * 右邊彩色的貼條製作說明
>> >> * 先創出一個長方形空間，並利用canvas 漸層分段出紅到紫的顏色
```javascript=
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
```
>> >> * fillgradient 將顏色方塊設立深度 : 最左上設立白色、最右下設立黑色，並填滿漸層。
```javascript=
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
```
>> >> * getimagedatar具有儲存畫布顏色資料的功能，利用他獲取我們在布顏色布條上選取的顏色，並 fillGradient 製作顏色方塊。
```javascript=
function changeblock(e) {
    x = e.offsetX;
    y = e.offsetY;

    var imageData = CS.getImageData(x, y, 1, 1).data;
    rgbcolor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    fillGradient();
}
colorStrip.addEventListener('click', changeblock, false);
```
>> >> 當選取完顏色方塊上的深度後，真正的顏色便會顯示在 label 上，方法如同在做color block 一樣。
```javascript=
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
```
- **Brush size**
>> ![](https://i.imgur.com/Lr98eaJ.png)
>> * 用 html 標籤input 裡的 range 實作 brush 的 slider。同時這個大小將會同時改變
>> >> eraser大小
>> >> 字型大小
>> >> 筆刷大小
```htmlmixed=
<input float = "right" type = "range" id = "brush" min = "0" max = "50" step = "1" value = "10" ><image id = "brush_icon" src = "./icon/brush.png" float = "right"> </image></input>

```
>> 利用 -webkit-appearance 將原本預設的外型改掉換成稍微好看的樣子
```css
#brush::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 155px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
    box-shadow: 0 .125em .125em #3b4547;
}
    
    
```


## Text input
- **type on canvas**
>> ![](https://i.imgur.com/PAluLi9.png)
>> * 詳細功能
>> >> * 用DOM生成一個 textarea 並監聽鍵盤事件。每當有鍵盤事件會傳值給 textarea ，此時會生成一串文字，再將此串文字透過 textarea.value傳給context 並設立一個文字區域以放上文字。
```javascript=
var word = document.createElement("textarea");

function texthandle(e) {
    if (e.key == "Backspace") {
        word.value--;
    } else if (e.key == "Enter") {
        window.removeEventListener('keyup', texthandle);
    } else {
        word.value += e.key;
        text_content = word.value;
        context.fillText(text_content, mousepos.x, mousepos.y);
        window.addEventListener('mousedown', function() {
            window.removeEventListener('keyup', texthandle);
        })
    }

}
window.addEventListener('keyup', texthandle);
```


- **Font menu**
>> ![](https://i.imgur.com/au18yEd.png)
>> ![](https://i.imgur.com/q2rTiGL.png)
>> * 運用 select 及 optional 標籤 建立字型選擇的樣式。 
```javascript
<select id = "font" >
    <option value = "Georgia">Georgia</option>
    <option value = "Palatino Linotype">Palatino Linotype</option>
    <option value = "Book Antiqua">Book Antiqua</option>
    <option value = "Times New Roman">Times New Roman</option>
    <option value = "Arial">Arial</option>
    <option value = "Helvetica">Helvetica</option>
    <option value = "Arial Black">Arial Black</option>
    <option value = "Impact">Impact</option>
    <option value = "Lucida Sans Unicode">Lucida Sans Unicode</option>
    <option value = "Tahoma">Tahoma</option>
    <option value = "Verdana">Verdana</option>
    <option value = "Courier New">Courier New</option>
    <option value = "Lucida Console">Lucida Console</option>
    <option value = "initial">initial</option>
    </select>
```

## Cursor icon
>> * 於每一按鈕觸發事件後，根據button觸發不同function 對應其cursor 的改變。
```javascript=
function DrawTriangle() {
    mode = "Triangle";
    fill = true;
    sides = 3;
    canvas.style.cursor = "url('./icon/tri.png'),zoom-in";
    context.fillStyle = rgbcolor;
}
```

## Refresh button
>> ![](https://i.imgur.com/ErtmNHz.png)
>> * 按下button 觸發 context.clearRect 清除整塊畫布。
```javascript=
function clearPad(e) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
```
---
# Advanced tools

## Different brush shapes 
- **circle**
>> ![](https://i.imgur.com/ycMZdKM.png) 
>> * 詳細功能
>> >> * mousedown : 
>> >> **snapshot**將畫布的狀態儲存起來 ; 
>> >> **dragStartLocation**將此時點擊的座標記錄起來。 
```javascript=
dragStartLocation = { x: mousepos.x, y: mousepos.y };
snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
```
>> >> * mousemove : 
>> >> 當我移動時，會根據先重置畫布於點擊滑鼠時的狀態，並在我移動時根據我移動到的目標與mousedown時的座標 計算半徑。
>> >> 每一移動，就會重置畫布把剛剛已經畫在上面的圖案弄掉、在畫新的移動後所繪製的圖案，以至於看起來會像是在抉擇圖形大小，直到確定後放開滑鼠。
```javascript=
context.globalCompositeOperation = "source-over";
context.putImageData(snapshot, 0, 0);
radius = Math.sqrt(Math.pow(mousepos.x - dragStartLocation.x, 2) + Math.pow(mousepos.y - dragStartLocation.y, 2)) / 2
context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI, false);
if (fill) context.fill();
else {
    context.stroke();
}
```
>> >> * mouseup： 最後當放開滑鼠，不再putImageData一直還原狀態，並放上繪製的圖案。　這裡的code 與　mousemove 一樣。

- **triangle**
>> ![](https://i.imgur.com/wT1wNiJ.png)
>> * 詳細功能 :
>> >> * 想法 : 先做一個圓，並根據角度在圓上取點，在畫出來
>> >> * 同樣的，在放開鼠標前，都將一直重置畫布以達到拖拉圖形的效果。
>> >> * angle 算出一個三角形每個角分配到的角度，接著利用迴圈將資料存進array裡 ，並一個一個連起來畫出。
```javascript=
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
```

- **rectangle**
>> ![](https://i.imgur.com/VjQTMEv.png)
>> * 詳細功能
>> >> * 利用context.rect做出一個長方形空間在將其畫出。
```javascript=
context.globalCompositeOperation = "source-over";
context.putImageData(snapshot, 0, 0);
context.rect((dragStartLocation.x - Math.abs(mousepos.x - dragStartLocation.x)), (dragStartLocation.y - Math.abs(mousepos.y - dragStartLocation.y)), 2 * Math.abs(mousepos.x - dragStartLocation.x), 2 * Math.abs(mousepos.y - dragStartLocation.y));
context.stroke();
if (fill) context.fill();
else {
    context.closePath();
    context.stroke();
}

```

## Un/Re-do button 
>> ![](https://i.imgur.com/W4KB82Z.png)
>> * 詳細功能
>> >> * 將畫布狀態儲存起來，儲存方式為window.history，能夠將每個狀態變成歷史紀錄，如此在做undo、redo時便能夠取得上、下一步狀態。
>> >> * state 與 snapeshot 不同在於 **state**儲存的是下筆的每一個狀態，**snapeshot** 為儲存同一個畫面，作為重置用。
>> >> * 將 **state** push進去，並監聽是否要求pop出狀態並執行 **changeStep**。
```javascript=
let state = context.getImageData(0, 0, canvas.width, canvas.height);
window.history.pushState(state, null);
window.addEventListener('popstate', changeStep, false);
```
>> >> * **changrStep** 的功能為 先清除整個畫布，再將pop出來的狀態放上去。
```javascript=
function changeStep(e) {
    // 清除畫布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 透過 e.state 取得先前存到 window.history 的狀態
    if (e.state) {
    context.putImageData(e.state, 0, 0);
    }
}
```
>> >> * undo : 如果是回到上一步，將歷史紀錄往前一個。
```javascript=
window.history.go(-1);
```
>> >> * redo : 如果是回到下一步，便將歷史紀錄往後一個。
```javascript=
window.history.go(1);
```
>> >> * 特別說明 : 因為是以狀態的方式儲存，因此如果將畫布reset後再畫，此時執行 undo 會將上個狀態，也就是 reset 清空畫布，呼叫出來。

## Image tool 
>> ![](https://i.imgur.com/X7gu85y.png)
>> * 
```javascript=
var img = new Image();
img.onload = function() {
    canvas.width = this.width;
    canvas.height = this.height;
    context.drawImage(this, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(src);
    }
var file = this.files[0];
img.src = URL.createObjectURL(file);
```


## Download
>> ![](https://i.imgur.com/pHvVSdV.png)
>> * 生成 **a** 的標籤，其連結為 畫布資料的URL 檔名為"myCanvas.png"。
```javascript=
var link = document.createElement('a');
link.download = 'myCanvas.png';
link.href = canvas.toDataURL()
link.click();
```



---

# Other useful widgets
## polygon
>> ![](https://i.imgur.com/n3swVna.png)![](https://i.imgur.com/astJUGS.png) 

>> * 如同三角形畫法，只要給定指定邊數，便能製造出任何想要的正多邊形。
>> * 利用 html **number** 的type輸入指定邊數，便可製造出多邊形。

## 空心圖形
>> * 空心圖形不要填滿它的色彩即可得到空心圖形。

## 響應式網頁
>> * 我做了相當在寬度為 **1024px**以下的網頁或 **768px** 以下的網頁做進行排版，以符合在較小螢幕的電腦及在平版上也能擁有良好的體驗。

# Scoring

| **Basic components**                             | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Basic control tools                              | 30%       | Y         |
| Text input                                       | 10%       | Y         |
| Cursor icon                                      | 10%       | Y         |
| Refresh button                                   | 10%       | Y         |

| **Advanced tools**                               | **Score** | **Check** |
| :----------------------------------------------- | :-------: | :-------: |
| Different brush shapes                           | 15%       | Y         |
| Un/Re-do button                                  | 10%       | Y         |
| Image tool                                       | 5%        | Y         |
| Download                                         | 5%        | Y         |

| **Other useful widgets** | **Score** | **Check** |
|:------------------------ |:---------:|:---------:|
| RWD                      |   1~5%    |     Y     |
| empty shape              |   1~5%    |     Y     |
| polygon                  |   1~5%    |     Y     |


---

## How to use 

1. 使用筆刷以控制橡皮擦、筆粗細、空心圖形及字體大小。
2. 須點選顏色方塊方能改變顏色，顏色將顯示在顏色選取上方。
3. 顏色可以改變　字、圖形、筆
4. 顏色上方有字體可供選擇。
5. 已設定成圖片不能超過畫布大小，否則將載入失敗，以免將影響網頁美觀。
6. 下載的圖片檔為　＂myCanvas.png"。
7. 即使清空畫布後仍舊可以按上一步返回。
8. 調色盤左上方有　**正多邊形邊樹輸入** 輸入後點選 ***side*** 即可點選下方多邊形繪製。
9. 文字在點選畫布上任一方後即可打字，顏色可自選。

## Demo Video
{%youtube fRksEy2gNuM%}
https://www.youtube.com/watch?v=fRksEy2gNuM&t=448s

## Gitlab page link
https://github.com/yehsin/AS_01_WebCanvas

<style>
table th{
    width: 100%;
}
</style>