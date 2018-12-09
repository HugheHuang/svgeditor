ming='http://www.w3.org/2000/svg';
//填充颜色，填充规则，填充明度，描边颜色，描边宽度，描边透明度，描边顶点形状，交点处过渡性状
USERFILLCOLOR = '#66CCFF', USERFILLRULE = 'nonzero', USERFILLOPACITY = 1, USERSTROKE = '#000000',
    USERSTROKEWIDTH = 1, USERSTROKEOPACITY = 1, USERSTROKELINECAP = 'butt', USERSTROKELINEJOIN = 'miter';
USERFONTSIZE = 86, USERFONTFAMILY = 'SimHei';
//svg元素的id
SVGIDPRE='svgelement';SVGID=1;
//鼠标选中的元素的id
MOUSESVGELEMENTID = null;
//鼠标位置
MOUSEPOSITION=[0,0];
//线段点数组
LINEPOINTS=[];




$(document).ready(function() {
    //svg画布的位置
    // SVGX=document.querySelectorAll('.svgdiv')[0].offsetLeft;
    // SVGY=document.querySelectorAll('.svgdiv')[0].offsetTop;
    SVGX = $("#svg").offset().left;
    SVGY = $("#svg").offset().top;
    console.log(SVGX+" "+SVGY);

    var svg = Snap("#svg");
    var basicfiguresvg = Snap("#basicfiguresvg");
    var basicfiguresvgline = Snap("#basicfiguresvgline");
    var basicfiguresvgrect = Snap("#basicfiguresvgrect");
    var basicfiguresvgcircle = Snap("#basicfiguresvgcircle");
    var basicfiguresvgellipse = Snap("#basicfiguresvgellipse");
    var basicfiguresvgpolyline = Snap("#basicfiguresvgpolyline");
    var basicfiguresvgpolygon = Snap("#basicfiguresvgpolygon");

    //调色盘
    $('#colorpicker').farbtastic('#color');
    $("#fillcolorbutton").click(function () {
        console.log($("#color").val());
        USERFILLCOLOR=$("#color").val();
    });
    $("#strokecolorbutton").click(function () {
        console.log($("#color").val());
        USERSTROKE=$("#color").val();
    });
    //各个内置图形库的绑定
    basicfiguresvgline.click(function () {
        LINEPOINTS = [];
        $("#svg").unbind();
        $("#svg").click(getLineFirstPoint);
        console.log("zero");
    });
    basicfiguresvgrect.click(function () {
        addRect(svg, 10, 10, 20, 30)
    });
    basicfiguresvgcircle.click(function () {
        addCircle(svg, 20, 20, 20)
    });
    basicfiguresvgellipse.click(function () {
        addEllipse(svg, 30, 40, 20, 10)
    });
    basicfiguresvgpolyline.click(function () {
        $("#svg").unbind();
        var oPolyLine = null;
        var pointsNum = '';
        var oSvg = document.getElementById('svg');
        oSvg.onmousedown=function (e) {
            var point = getMousePosition(e);
            var x = point[0],y=point[1];
            if (pointsNum == '') {
                pointsNum = x + ',' + y;
            } else {
                pointsNum += ',' + x + ',' + y;
            }
            console.log(pointsNum);

            if (!oPolyLine) {
                var id = SVGIDPRE + SVGID;
                SVGID++;
                oPolyLine = createTag('polyline', {
                    'id' : id,
                    'stroke': USERSTROKE,
                    "stroke-width": USERSTROKEWIDTH,
                    "stroke-opacity": USERSTROKEOPACITY,
                    'fill': 'none'
                });
                oSvg.appendChild(oPolyLine);
                Snap("#"+id).drag().dblclick(function () {
                    this.remove();
                }).click(function () {

                });;
            }
            oPolyLine.setAttribute('points', pointsNum);
            if (e.button === 2) {
                oSvg.onmousemove = null;
                oSvg.onmousedown = null;
            } else {
                oSvg.onmousemove = function(e) {

                    if (oPolyLine) {
                        var point = getMousePosition(e);
                        var x = point[0],y=point[1];
                        oPolyLine.setAttribute('points', pointsNum + ',' + x + ',' + y);
                    }

                };
            }
        }
    });
    basicfiguresvgpolygon.click(function () {
        $("#svg").unbind();
        var oPolygon = null;
        var pointsNum = '';
        var oSvg = document.getElementById('svg');
        oSvg.onmousedown=function (e) {
            var point = getMousePosition(e);
            var x = point[0],y=point[1];
            if (pointsNum == '') {
                pointsNum = x + ',' + y;
            } else {
                pointsNum += ',' + x + ',' + y;
            }
            console.log(pointsNum);

            if (!oPolygon) {
                var id = SVGIDPRE + SVGID;
                SVGID++;
                oPolygon = createTag('polygon', {
                    'id' : id,
                    'stroke': USERSTROKE,
                    "stroke-width": USERSTROKEWIDTH,
                    "stroke-opacity": USERSTROKEOPACITY,
                    'fill': USERFILLCOLOR,
                    'fill-rule': USERFILLRULE,
                    "fill-opacity": USERFILLOPACITY
                });
                oSvg.appendChild(oPolygon);
                Snap("#"+id).drag().dblclick(function () {
                    this.remove();
                }).click(function () {

                });;
            }
            oPolygon.setAttribute('points', pointsNum);
            if (e.button === 2) {
                oSvg.onmousemove = null;
                oSvg.oncontextmenu = function() {
                    oSvg.onmousemove = null;
                    return false;
                };
                oSvg.onmousedown = null;
            } else {
                oSvg.onmousemove = function(e) {

                    if (oPolygon) {
                        var point = getMousePosition(e);
                        var x = point[0],y=point[1];
                        oPolygon.setAttribute('points', pointsNum + ',' + x + ',' + y);
                    }

                };
            }
        }
    });

    //工具栏
    //文字
    document.getElementById("svgtext").addEventListener("click",createText);




    // 事件


});

function getOffsetTop(el){
    console.log(el);
    return el.offsetParent
        ? el.offsetTop + getOffsetTop(el.offsetParent)
        : el.offsetTop
}

function getOffsetLeft(el){
    return el.offsetParent
        ? el.offsetLeft + getOffsetLeft(el.offsetParent)
        : el.offsetLeft
}

function createText(ev) {
    console.log("点击了文本框");
    document.getElementById("svgtext").removeEventListener("click",createText);
    document.addEventListener("keydown",createTextEnter);
}

function createTextEnter(ev2) {
    console.log("按下了键盘");
    //enter输入
    if (ev2.keyCode == 13) {
        var textcontent = $("#svgtext").val().toString();
        console.log("按下了enter");
        console.log(textcontent);
        addText(Snap("#svg"), 50, 50, textcontent);
        document.removeEventListener("keydown",createTextEnter);
        document.getElementById("svgtext").addEventListener("click",createText);
    }
}
//创造标签
function createTag(tagName, tagAttr) {
    let tag = document.createElementNS(ming, tagName);
    for (var attr in tagAttr) {
        tag.setAttribute(attr, tagAttr[attr]);
    }
    return tag;
}

//线段第一个点
function  getLineFirstPoint(e) {
    var point = getMousePosition(e);
    LINEPOINTS.push(point[0]);
    LINEPOINTS.push(point[1]);
    console.log("first"+point[0]+" "+point[1]);
    $("#svg").unbind();
    $("#svg").click(getLineSecondPoint);
}
//线段第二个点
function getLineSecondPoint(e) {
    var point = getMousePosition(e);
    LINEPOINTS.push(point[0]);
    LINEPOINTS.push(point[1]);
    console.log("first"+point[0]+" "+point[1]);
    console.log("second"+point[0]+" "+point[1]);
    console.log("linepoints:"+LINEPOINTS);
    addLine(Snap("#svg"),LINEPOINTS[0],LINEPOINTS[1],LINEPOINTS[2],LINEPOINTS[3]);
    $("#svg").unbind();
   // $("#svg").click(getElement);
}

function getMousePosition(e){
    console.log(e.clientX+" "+e.clientY);
    var x = e.clientX + $(window).scrollLeft()-SVGX;
    var y = e.clientY + $(window).scrollTop()-SVGY;
    MOUSEPOSITION = [x,y];
    return [x,y]
}

function getElement(e) {
    MOUSESVGELEMENTID = e.target.id;
    var point = getMousePosition(e);
    console.log(MOUSESVGELEMENTID);
}


function addLine(svg, x1, y1, x2, y2){
    var id = SVGIDPRE + SVGID;
    SVGID++;
    svg.paper.line(x1, y1, x2, y2).attr({
        id : id,
        stroke: USERSTROKE,
        "stroke-width": 30,   //
        "stroke-opacity": USERSTROKEOPACITY,
        "stroke-linecap": USERSTROKELINECAP,
        "stroke-linejoin": USERSTROKELINEJOIN
    }).drag().dblclick(function () {
        this.remove();
    }).click(function () {

    });
    console.log("#"+id);
}

function addRect(svg, x, y, width, height, rx, ry){
    var id = SVGIDPRE + SVGID;
    SVGID++;
    rx = rx || 0;
    ry = ry || 0;
    svg.paper.rect(x, y, width, height, rx, ry).attr({
        id : id,
        stroke: USERSTROKE,
        "stroke-width": USERSTROKEWIDTH,
        "stroke-opacity": USERSTROKEOPACITY,
        fill: USERFILLCOLOR,
        "fill-opacity": USERFILLOPACITY
    }).drag().dblclick(function () {
        this.remove();
    }).click(function () {

    });
    console.log("#"+id);
}

function addCircle(svg,cx,cy,r){
    var id = SVGIDPRE + SVGID;
    SVGID++;
    svg.paper.circle(cx, cy, r).attr({
        id : id,
        stroke: USERSTROKE,
        "stroke-width": USERSTROKEWIDTH,
        "stroke-opacity": USERSTROKEOPACITY,
        fill: USERFILLCOLOR,
        "fill-opacity": USERFILLOPACITY
    }).drag().dblclick(function () {
        this.remove();
    }).click(function () {

    });
    console.log("#"+id);

}

function addEllipse(svg,cx, cy, rx, ry){
    var id = SVGIDPRE + SVGID;
    SVGID++;
    svg.paper.ellipse(cx, cy, rx, ry).attr({
        id : id,
        stroke: USERSTROKE,
        "stroke-width": USERSTROKEWIDTH,
        "stroke-opacity": USERSTROKEOPACITY,
        fill: USERFILLCOLOR,
        "fill-opacity": USERFILLOPACITY
    }).drag().dblclick(function () {
        this.remove();
    }).click(function () {

    });
    console.log("#"+id);
}

function addPolyline(svg,points){
    var id = SVGIDPRE + SVGID;
    SVGID++;
    svg.paper.polyline(points).attr({
        id : id,
        stroke: USERSTROKE,
        "stroke-width": USERSTROKEWIDTH,
        "stroke-opacity": USERSTROKEOPACITY,
        fill: 'none'

    }).drag().dblclick(function () {
        this.remove();
    }).click(function () {

    });
    console.log("#"+id);
}

function addPolygon(svg,points){
    var id = SVGIDPRE + SVGID;
    SVGID++;
    svg.paper.polygon(svg,points).attr({
        id : id,
        stroke: USERSTROKE,
        "stroke-width": USERSTROKEWIDTH,
        "stroke-opacity": USERSTROKEOPACITY,
        fill: USERFILLCOLOR,
        'fill-rule': USERFILLRULE,
        "fill-opacity": USERFILLOPACITY
    }).drag().dblclick(function () {
        this.remove();
    }).click(function () {

    });
    console.log("#"+id);
}

function addImage(svg,src, x, y, width, height){
    var id = SVGIDPRE + SVGID;
    SVGID++;
    svg.paper.image(src, x, y, width, height).attr({
        id : id
    }).drag().dblclick(function () {
        this.remove();
    }).click(function () {

    });
    console.log("#"+id);
}

function addText(svg,x, y, text){
    var id = SVGIDPRE + SVGID;
    SVGID++;
    svg.paper.text(x, y, text).attr({
        'id' : id,
        'font-size' :  USERFONTSIZE,
        'fill' :  USERFILLCOLOR,
        'stroke' :  USERSTROKE,
        'opacity' : USERFILLOPACITY,
        'font-family' : USERFONTFAMILY
    }).drag().dblclick(function () {
        this.remove();
    }).click(function () {

    });
    console.log("#"+id);
}