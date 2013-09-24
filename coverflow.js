// JavaScript Document

var COVERFLOW_WIDTH = 800;
var COVERFLOW_HEIGHT = 300;
var ROTATION_STEP = 15;

var imageArr = new Array();
var coverflow;
var currentIndex = -1;
var prevTouchX;


var ImageStatus = {
	LEFT	:"left",
	RIGHT	:"right",
	TOP		:"top"
}


function trace(cont){
	try{
		console.log(cont);
	}catch(e){
		
	}
}


function init(){
	coverflow = document.getElementById("coverflow");
	//coverflow.style.width = window.outerWidth + "px";
	//coverflow.style.overflow = "hidden";
	
	var timages = coverflow.getElementsByTagName("IMG");
	var images = new Array();
	for(var i = 0; i < timages.length; i++){
		images.push(timages[i]);
	}
	
	for(i = 0; i < images.length; i++){
		imageArr.push(new Image(images[i], coverflow));
	}
	
	
	document.addEventListener("touchstart", touchStartAction, false);
	document.addEventListener("touchmove", touchMoveAction, false);
	document.addEventListener("touchend", touchEndAction, false);
	
	window.addEventListener("resize", resizeAction, false);
	
	focusImage(0);
}


function resizeAction(event){
	focusImage(currentIndex);
}


function touchStartAction(event){
	event.preventDefault();
	prevTouchX = event.touches[0].pageX;
}

function touchMoveAction(event){
	event.preventDefault();
	var diffX = event.touches[0].pageX - prevTouchX;
	var diffIndex =  Math.floor(Math.abs(diffX) / 60);
	if(diffX < 0) diffIndex *= -1;
	tracer.innerHTML = diffX;
	if(diffIndex >= 1 || diffIndex <= -1){
		prevTouchX = event.touches[0].pageX;
		tracer.innerHTML += " "+ Number(currentIndex - diffIndex);
		focusImage(currentIndex - diffIndex);
	}
}

function touchEndAction(event){
	event.preventDefault();
	
}


function focusImage(index){
	if(index < 0 || index >= imageArr.length) return;
	currentIndex = index;
	
	var centerImg = imageArr[index];
	var centerX = coverflow.offsetWidth / 2 - centerImg.getWidth() / 2;
	var centerY = window.outerHeight / 2 - centerImg.getHeight() / 2;
	
	trace(window.outerHeight + " " + centerImg.getHeight());
	
	centerImg.turn(ImageStatus.TOP);
	centerImg.setZIndex(1000);
	centerImg.setPos(centerX, centerY);
	
	var leftPos = centerX - 100;
	var leftIndex = index - 1;
	for(var i = index - 1; i >= 0; i--){
		var leftImg = imageArr[i];
		leftImg.turn(ImageStatus.LEFT);
		leftImg.setZIndex(leftIndex);
		leftImg.setPos(leftPos, centerY);
		leftPos -= 30;
		leftIndex--;
	}
	
	var rightPos = centerX + 100;
	var rightIndex = imageArr.length;
	for(i = index + 1; i < imageArr.length; i++){
		var rightImg = imageArr[i];
		rightImg.turn(ImageStatus.RIGHT);
		rightImg.setZIndex(rightIndex);
		rightImg.setPos(rightPos, centerY);
		rightPos += 30;
		rightIndex--;
	}
}


var Image = function(main, parent){
	this.status		= "";
	this.container	= document.createElement("DIV");
	this.content 	= main;
	this.posX		= 0;
	this.posY		= 0;
	
	//if(main.parentNode) main.parentNode.removeChild(main);
	this.container.style.webkitPerspective = 500;
	this.container.style.webkitTransition = "-webkit-transform 0.5s";
	this.container.style.width = main.offsetWidth + "px";
	this.container.style.height = main.offsetHeight + "px";
	this.container.style.position = "absolute";
	
	this.container.appendChild(this.content);
	parent.appendChild(this.container);
}

Image.prototype = {
	turn:function(status){
		if(this.status == status) return;
		
        var intervalId;
		var destDegree;
		var scaleTrans;
		switch(status){
			case ImageStatus.TOP:
				scaleTrans = "scale(1)";
				destDegree = 0;
				break;
			case ImageStatus.LEFT:
				scaleTrans = "scale(0.8)";
				destDegree = 60;
				break;
			case ImageStatus.RIGHT:
				scaleTrans = "scale(0.8)";
				destDegree = -60;
				break;
		}
		
		this.status = status;
		this.content.style.webkitTransform = "rotateY("+destDegree+"deg) "+ scaleTrans;
    },
	
	setPos:function(posX, posY){
		this.posX = posX;
		this.posY = posY;
		
		this.container.style.webkitTransform = "translate(" + this.posX + "px, " + this.posY + "px)";
	},
	
	setZIndex:function(zindex){
		this.container.style.zIndex = zindex;
	},
	
	getWidth:function(){
		return this.container.offsetWidth;
	},
	
	getHeight:function(){
		return this.container.offsetHeight;
	}
}