let img;  // store the image
let numSegments = 10; // determine how many segments to make
let segments = [];  // where we'll store each individual segment
let drawSegments = false; // used to determine if we draw the raw image or the rectangles

let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset:0, yOffset: 0};

let canvasAspectRatio = 0;

function preload(){
  img = loadImage("assets/Mona_Lisa.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);  // set canvas size to entire window

  imgDrwPrps.aspect = img.width/img.height;
  canvasAspectRatio = width/height;

  calculateImageDrawProps()

  // calculate width and height of the segments
  let segmentWidth = img.width/numSegments;
  let segmentHeight = img.height/numSegments;

  // use nested for loops to create and position each segment
  for (let YPos = 0; YPos < img.height; YPos += segmentHeight){  // row
    for (let XPos = 0; XPos < img.width; XPos += segmentWidth){  // column
      let fillColor = img.get(XPos + segmentWidth/2, YPos + segmentHeight/2);
      let segment = new ImageSegment(XPos/segmentWidth, YPos/segmentHeight, fillColor);
      segments.push(segment);
    }
  }
}

function draw() {
  background(0);
  if (drawSegments){
    // for each element in the array segments, do something
    for(const segment of segments){
      segment.draw();
    }
  }else{
    image(img, imgDrwPrps.xOffset, imgDrwPrps.yOffset, imgDrwPrps.width, imgDrwPrps.height);
  }

}

function keyPressed(){
  if(key == " "){
    // a trick to invert a boolean
    drawSegments = !drawSegments;
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHEihgt);
  calculateImageDrawProps();
}
function calculateImageDrawProps(){
  canvasAspectRatio = width / height;
  // if the image is wider than the canvas
  if(imgDrwPrps.aspect > canvasAspectRatio){
    //then draw the image to the width of the canvas
    imgDrwPrps.width= width;
    // and calculate the height based on the aspect ratio
    imgDrwPrps.height = width/ imgDrwPrps.aspect;
    imgDrwPrps.yOffset = (height - imgDrwPrps.height)/2;
    imgDrwPrps.xOffset = 0;

  } else if(imgDrwPrps.aspect < canvasAspectRatio){
    // otherwise draw the iamge to the height of the canvas
    imgDrwPrps.height = height;
    imgDrwPrps.width = height * imgDrwPrps.aspect;
    imgDrwPrps.xOffset = (width - imgDrwPrps.width)/2;
    imgDrwPrps.yOffset = 0;

  } else if (imgDrwPrps.aspect == canvasAspectRatio){
    // if the aspect ratios are the same we can draw the image to the canvas size
    imgDrwPrps.width = width;
    imgDrwPrps.height = height;
    imgDrwPrps.xOffset = 0;
    imgDrwPrps.yOffset = 0;
  }

}

class ImageSegment {

  constructor(columnPosIn, rowPosIn, fillColorIn) {
    //these parameters are used to set the internal properties of an instance of the segment
    //These parameters are named as imageSource as they are derived from the image we are using
    this.columnPos = columnPosIn;
    this.rowPos =rowPosIn;
    this.fillColor = fillColorIn;

    this.XPos = 0;
    this.YPos = 0;
    this.width = 0;
    this.height = 0;
  }

  calculateSegDrawPRops(){
    this.width = imgDrwPrps.width/numSegments;
    this.height = imgDrwPrps.height/numSegments;

    this.xPos = this.rowPos * this.width + imgDrwPrps.xOffset;
    this.yPos = this.columnPos * this.height + imgDrwPrps.yOffset;
  }

  draw() {
    //let's draw the segment to the canvas, for now we will draw it as an empty rectangle so we can see it
    stroke(0);
    fill(this.fillColor);
    rect(this.XPos, this.YPos, this.width, this.height);
  }
}
