var currentFile = '';
var radius = 50;
var border = 2;
var effectDepth = 2;
var gridColor = "rgb(24,25,27)";
var elementColor = "rgba(255,255,255,.8)";
var borderColor = "rgba(13,13,13,0)";
var buttonColor = 'rgba(255,255,255,0)';
var buttonSize = 24;
var canvas = new fabric.CanvasEx('c'),ctx = canvas.getContext("2d");

var snapStatus = 'lock';
var elementsStatus = 'show';
var elementsInfo = [];

var grid = [],nearPointIndex, snapToGrid = false,gridX = 0, gridY = 0;
var groups = [];
var showContextMenu = false;

var mouseDown = false, downPoint={x:0,y:0};
var mouseDrag = false;
var mouseOverElement = false;
var tooltipObject = null;
var targetElement = null, tempPoly = null, tempText = null;

var threeDots = null;
var groupTarget = null, ungroupedObjects = null, groupTargetClock = 0, ungrouping = false;

var activeSuggestInput = null;
var tempInputMoving = false;
var isNewObject = true;
var views = [],currentView = 0;

var clusters = [], positionBeforeClustering = null,
    formations = [];

var regexTimer,regexSearchCount=0;

var topbar = null, leftbar = null, rightbar = null;

var textClipboard = "";

// This is for fuzzy font problem fix
fabric.Object.prototype.set({
    objectCaching: false
});

document.onload = init();

function init(){
    //canvas.setHeight(window.innerHeight);
    //canvas.setWidth(window.innerWidth);
    canvas.setHeight(2 * window.innerHeight);
    canvas.setWidth(2 * window.innerWidth);
    $('#background-image').css({
        width: 2 * window.innerWidth,
        height: 2 * window.innerHeight
    });
    //fabric.util.loadImage($("#background-pattern").val(), function (img) {
    //    //canvas.backgroundColor = new fabric.Pattern({source: img});
    //    canvas.backgroundColor = "rgba(0,0,0,0)";
    //    canvas.renderAll();
    //});
    fabric.Object.prototype.transparentCorners = false;

    drawGrid();
    initHandlers();

    addBrowseButton();
    addButtons();
    addSearchButton();
    addHideButton();
    addUploadButton();
    addChipButton();
    addFeedButton();
    addUserButton();
    addCalendarButton();
    drawElements();
    loadAllCallbacks();

    loadFormations();
    loadPeople();
}


