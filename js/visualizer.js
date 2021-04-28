function setup() {
  createCanvas(windowWidth, windowHeight)
}

function draw() {
  background(0)
  fill(255)
  rect(0, 0, 500, 500)

}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}
