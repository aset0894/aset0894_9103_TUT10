let img;
let segments = []; //where we will store each segment
let numSegments = 50; //how many segments to create
let drawSegments = false;

let imgDrwPrps = {aspect: 0, width: 0, height:0, xOffset:0, yOffset:0};

let canvasAspectRatio = 0;

let pixelColour;

function preload() {
    img = loadImage("assets/Mona_Lisa.jpg");
}

function setup() {
    createCanvas(windowWidth, windowHeight); 
    
    canvasAspectRatio = width/height;
    imgDrwPrps.aspect = img.width/img.height;
    calculateImageDrawProps();

    //calculate width and height of the segments
    let segWidth = img.width/numSegments;
    let segHeight = img.height/numSegments;

    //set up all the image segments
    for (let yPos = 0; yPos < img.height; yPos += segHeight) { //vertical
        for (let xPos = 0; xPos < img.width; xPos += segWidth) { //horizontal
            let fillColor = img.get(xPos + segWidth/2, yPos + segHeight/2);
            let segment = new ImageSegment(xPos/segWidth, yPos/segHeight, fillColor); //create segment
            segment.calculateSegDrawProps();
            segments.push(segment); //add the segment to the end of the segments array
        }
    }
    pixelColour = color(0);
}

function calculateImageDrawProps() {
  if (imgDrwPrps.aspect > canvasAspectRatio) { //case where image is wider than canvas
    //draw the image to the width of the canvas
    imgDrwPrps.width = width;
    imgDrwPrps.height = width/imgDrwPrps.aspect;
    imgDrwPrps.xOffset = 0;
    imgDrwPrps.yOffset = (height - imgDrwPrps.height) / 2;

  } else if (imgDrwPrps.aspect < canvasAspectRatio) { //case where image is taller than canvas
    imgDrwPrps.width = height * imgDrwPrps.aspect;
    imgDrwPrps.height = height;
    imgDrwPrps.xOffset = (width - imgDrwPrps.width) / 2
    imgDrwPrps.yOffset = 0;

  } else if (imgDrwPrps.aspect == canvasAspectRatio) { //The case where they are the same
    imgDrwPrps.width = width;
    imgDrwPrps.height = height;
    imgDrwPrps.xOffset = 0;
    imgDrwPrps.yOffset = 0;
  }
}

function draw() {
  background(255);
    if (drawSegments) {
        for (const segment of segments) {
            segment.draw();
        }
    } else {
        image(img, imgDrwPrps.xOffset, imgDrwPrps.yOffset, imgDrwPrps.width, imgDrwPrps.height);
    }
    
    stroke(255);
    fill(pixelColour);
    //circle(mouseX, mouseY, 40);
}

function mouseMoved() {
    pixelColour = img.get(mouseX, mouseY); //read the colour under the mouse and assign to pixelcolour
}

function keyPressed() {
    if (key == " ") {
        drawSegments = !drawSegments;
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  canvasAspectRatio = width/height;
  calculateImageDrawProps();

  segments.forEach(segment => {
    segment.calculateSegDrawProps();
  });
}


class ImageSegment {

    constructor(rowPosIn, colPosIn, fillColor) {
      this.rowPos = rowPosIn;
      this.colPos = colPosIn;  
      
      this.xPos = 0;
      this.yPos = 0;
      this.width = 0;
      this.height = 0;
      this.fillColor = fillColor;
    }
    
    calculateSegDrawProps() {
      this.width = imgDrwPrps.width/numSegments;
      this.height = imgDrwPrps.height/numSegments;

      this.xPos = this.rowPos * this.width + imgDrwPrps.xOffset;
      this.yPos = this.colPos * this.height + imgDrwPrps.yOffset;
    }

    draw() {
        fill(this.fillColor);
        stroke(0);
       
        rect(this.xPos, this.yPos, this.width, this.height);
        //ellipse(this.xPos + this.width/2, this.yPos + this.width/2, this.width, this.height)
    }
}