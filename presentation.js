 /* If you ever wondered "should I hand-code my presentation in Javascript?"
 The answer is no. You get a wonderul interactive presentation, but everything
 takes five times as long.
 Also you will get very lazy and do bad coding.
*/
  var c_x = 1024
  var c_y = 768
  var n_x = 0
  var n_y = 0
  var n_a = 0

function setup() {
  var myCanvas = createCanvas(c_x, c_y);
  myCanvas.parent('slides');

  var n_x = getRndInteger(c_x*2/3,c_x); //Needle x
  var n_y = getRndInteger(0,c_y); //Needle y
  var n_a = getRndInteger(0, TWO_PI); //Needle angle
}

var framecount = 1;

var shape_radius = 50;
var shape_sides = 3;


var madh_pi = 0;
var madh_corr = 0;
var viet_pi = 1;
var viet_term = 0;
var framecount = 1;
var x_coords = [];
var y_coords = [];
var dists = [];
var dots_in = 0;
var dots_out = 0;
var circlespan = 0;

var nlen = 20;
var needles = [];
var curr_x = 0;
var curr_y = 0;
var nspeed = 50; //Needle speed. Lower is faster.
var j = nspeed;
var crossed = 0;
var iscross = 0;
var niscross = 0;

slidenum = 0;
slidemax = 38;

/*Currently this cheats to find the side lengths and uses trig.
Should use formula from 
https://www.craig-wood.com/nick/articles/pi-archimedes/
*/
function get_inner_p(sides){
	return sides*sin(PI/sides);	
}
function get_outer_p(sides){
	return sides*tan(PI/sides);
}


function Madhava(current, step){
  thispi = current + Math.pow(-1,(step - 1))*4/((step*2)-1);
	return thispi;
}

function Madhava_correct(step){
	correction = Math.pow(-1,step)*(Math.pow(step,2)+1)/
		(4*Math.pow(step, 3)+5*step);
	return correction;
}

function Vieterm(lterm){
	thispi = (Math.pow(2+(2*lterm),0.5))/2;
	return thispi
}

function cpi(guess, x ,y){
	
	rpi = "3.1415926535897932384626433832795028841971693993751058209749445923078164"
	for (i= 0; i < guess.length; i++){
		if (guess.charAt(i) == rpi.charAt(i)){
			fill(0, 255, 0);
			text(guess.charAt(i), x, y);
		} else { 
			fill(255, 0, 0);
			text(guess.charAt(i),x,y);
		}
    x += textWidth(guess.charAt(i));
	fill(0)
	}
	return null
}

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function makelines(rds) {
	for (i = 0; i < c_y/rds; i++) {
		line(c_x*2/3, rds*i, c_x, rds*i);
	}
}

function newneedle(x,y,l,angle){
	line(x,y,x+ l*cos(angle),y+ l * sin(angle));
}

function crosses(x1,x2,radius){
	if(x1 < x2 && (Math.floor(x1/radius)*radius + radius ) < x2) {
		return true
	}
	else if (x1 > x2  && (Math.floor(x2/radius)*radius + radius ) < x1) {
		return true
	}
	else {
		return false
	}
	
}

function getRndInteger(min, max) {
    return Math.random() * (max - min) + min;
}

function slide0(){
	background(255);
	textSize(72);
	textAlign(CENTER);
	text("Calculating π", 512, 384);
	textSize(20);
	text("Peter Brohan, Philipp Stassen & María de la Paz Quirós Artacho", 512, 484);
	textAlign(LEFT);
}

function slide1(){
	slide0();
	katex.render("\\pi \\approx 3.1415", mykatex1);
	maths.style.top = "530px";
	maths.style.left = "460px";

}

function slide2(){
	/*reset all related variables if new */
	if (framecount == 1){
		shape_sides = 3;
	}
	background(255);
	noFill();
	textSize(16);
	stroke(0);
	ellipse(70, 70, shape_radius*2, shape_radius*2);
	polygon(70, 70, shape_radius, shape_sides);
	inscribe_r = shape_radius/cos(PI/(shape_sides));
	polygon(70,70, inscribe_r, shape_sides);
	if(framecount % 50 == 0){
	shape_sides = shape_sides + 1;
	}
	noStroke();
	fill(0);
	text("Sides: " + shape_sides, 200, 30);
	text("Inscribed perimeter: ", 200, 60);
	i_p = get_outer_p(shape_sides);
	cpi(i_p.toString(), 200 + textWidth("Inscribed perimeter: "), 60);
	text("Circumscribed perimeter: ", 200, 90);
	c_p = get_inner_p(shape_sides);
	cpi(c_p.toString(), 200 + textWidth("Circumscribed perimeter: "), 90);
	text("Mean perimeter: " , 200, 120);
	n = (i_p + c_p)/2;
	cpi(n.toString(), 200 + textWidth("Mean perimeter: "),120);
	framecount += 1;
	maths.style.top = framecount.toString() + "px";
}

function slide3(){
	if (framecount == 1){
		madh_pi = 0;
		madh_corr = 0;
		viet_pi = 1;
		viet_term = 0;
	}
	background(255);
	textSize(16);

  	text("Step " + framecount, 50, 200);
	newpi = Madhava(madh_pi,framecount);
	cpi(newpi.toString(), 150, 200);
	text("Madhava Sequence", 350, 200);
	madh_pi = newpi;
	
	madh_corr = Madhava_correct(framecount)*4;
	if (framecount%2 == 0) { //Adds - in correct place without the text moving
	text("-", 141, 230);
	}
	text(Math.abs(madh_corr), 150, 230);
	text("Correction term", 350, 230);
	
	cpi((madh_pi + madh_corr).toString(), 150, 260);
	text("Corrected sequence", 350, 260);
	
	text("Step " + framecount, 50, 290);
  viet_term = Vieterm(viet_term)
	viet_pi = viet_pi * viet_term;
	cpi((2/viet_pi).toString(), 150, 290);
	text("Viéte's Sequence", 350, 290);
	framecount += 1;

}

function slide4(){
	background(255);
	textSize(30);
	fill(0,0,150);
	text("The Monte Carlo Method", 20, 30);
	fill(0);
	textSize(22);
	text("○ Approximate π using statistics.", 100, 110);
}

function slide5(){
	slide4();
	text("○ Method:", 100, 145);
}

function slide6(){
	slide5();
	textSize(24);
	fill(0,0,150);
	text("1.", 120, 180);
	fill(0);
	textSize(22);
	text("Inscribe a quadrant (quarter of a circle) of radius r inside a square with side length r", 150, 180);
}

var circlespeed = 50 //Controls how fast the circle draws. Lower is faster

function slide7(){
	slide6()
	stroke(0);
	noFill();
	rect(c_x-300,c_y-300 ,250,250);
	arc(c_x-300,c_y-300, 500, 500, 0, circlespan);
	circlespan += HALF_PI/circlespeed
	noStroke();
	fill(0);
	if (circlespan + HALF_PI/circlespeed >= HALF_PI) {
		slidenum += 1
	}
}


var arcfill = 255;
var arcfill_b = 255;
var fillspeed = 3;


function slide8(){
	circlespan = 0;
	slide6();
	stroke(0);
	noFill();
	rect(c_x-300,c_y-300 ,250,250);
	arc(c_x-300,c_y-300, 500, 500, 0, HALF_PI);
	noStroke();
	fill(0);
}


function slide9(){
	slide8();
	text("-  The area of the quadrant will be      .", 155, 215);
	katex.render("\\frac{\\pi r^2}{4}", mykatex1);
	maths.style.top = "202px";
	maths.style.left = (textWidth("-  the area of the quadrant will be ")+170).toString() + "px";
	stroke(0);
	fill(arcfill, arcfill, arcfill_b);
	arc(c_x-300,c_y-300, 500, 500, 0, HALF_PI);
	noStroke();
	fill(0);
	if (arcfill > 0){
		arcfill -= fillspeed;
		arcfill_b -= fillspeed*55/255;
	}
	if (arcfill <0){
		arcfill = 0;
		arcfill_b = 200;
	}
}

function slide10(){
	slide8();
	text("-  The area of the quadrant will be      .", 155, 215);
	katex.render("\\frac{\\pi r^2}{4}", mykatex1);
	maths.style.top = "202px";
	maths.style.left = (textWidth("-  the area of the quadrant will be ")+170).toString() + "px";
	text("-  The area of the square will be    .", 155, 250);
	katex.render("r^2", mykatex2);
	maths1.style.top = "240px";
	maths1.style.left = (textWidth("-  The area of the square will be")+170).toString() + "px";
}

function slide11(){
	slide10();
	text("-  The ratio of the area of the quadrant to the area of the square is    .", 155, 285);
	katex.render("\\frac{\\pi}{4}", mykatex3);
	maths2.style.top = "273px";
	maths2.style.left = (textWidth("-  The ratio of the area of the quadrant to the area of the square is")+170)
		.toString() + "px";
}

function addDot(){
	new_x = getRndInteger(c_x - 300, c_x - 50);
	new_y = getRndInteger(c_y - 300, c_y - 50);
	if (Math.pow((
		Math.pow(new_x+300-c_x,2) + Math.pow(new_y+300-c_y,2)),0.5) < 250){
		dots_in += 1;
			dists.push(0);
		}else{
		dots_out += 1;
		dists.push(1);
	}
	x_coords.push(new_x);
	y_coords.push(new_y);
}

function slide12(){
	slide11();
	fill(0,0,150);
	textSize(24);
	text("2.", 120, 320);
	fill(0);
	textSize(22);
	text("Randomly pick N points inside the square.", 150, 320);
	addDot();
	stroke(0)
	strokeWeight(2);
  	for (i = 0; i < x_coords.length; i++) { //Maybe slow down this animation
  		point(x_coords[i], y_coords[i]);
  	}
  	strokeWeight(1);
  	noStroke();
}

function slide13(){
	slide11()
	fill(0,0,150);
	textSize(24);
	text("2.", 120, 320);
	fill(0);
	textSize(22);
	text("Randomly pick N points inside the square.", 150, 320);
	addDot();
	stroke(0)
	strokeWeight(2);
  	for (i = 0; i < x_coords.length; i++) { //Maybe slow down this animation
  		if (dists[i] == 0){stroke(255,0,0);}
  		else {stroke(0, 0, 255);}
  		point(x_coords[i], y_coords[i]);
  	}
  	strokeWeight(1);
  	stroke(0);
  	noStroke();
	text(" - The number of points chosen lying in the circle will be approximately N   .", 155, 355);
	katex.render("\\frac{\\pi}{4}", mykatex4);
	maths3.style.top = "343px";
	maths3.style.left = (textWidth("- The number of points chosen lying in the circle will be approximately N")+170)
		.toString() + "px";
}

function slide14(){
	slide13();
	fill(0,0,150);
	textSize(24);
	text("3.", 120, 390);
	fill(0);
	textSize(22);
	text("Track the number of points chosen so far (N) and the number of points lying inside the quadrant (M)",150, 370, c_x-450, 70);
	text("N: " + (dots_in + dots_out).toString(), c_x - 300, c_y-320);
	fill(255, 0, 0);
	text("M: " + dots_in.toString(), c_x - 180, c_y-320);
	fill(0);
}

function slide15(){
	slide14();
	fill(0,0,150);
	textSize(24);
	text("4.", 120, 460);
	fill(0);
	textSize(22);
	text("Approximate π using:", 150, 460);
	katex.render("\\frac{\\pi}{4} = \\frac{M}{N}", mykatex5);
	maths4.style.top ="500px";
	maths4.style.left = "300px";
	maths4.style.fontSize = "20pt";
}

function slide16(){
	slide15();
	textSize(27);
	text("π ≈", 220, 620);
	cpi((4*dots_in/(dots_in+dots_out)).toString(), 220 + textWidth("π ≈  "), 620)
	textSize(22);

}

function slide17(){
	background(255);
	text("Did you know we can measure π just by dropping sticks on a table and counting them?", 100, 300, c_x-300, c_y-350);
	dots_in = 0;
	dots_out = 0;
	dists = [];
	x_coords = [];
	y_coords = [];
}

function slide18(){
	background(255);
	textSize(30);
	fill(0,0,150);
	text("Buffon's Needle", 20, 30);
	fill(0);
	textSize(22);
	text("○ Method:", 100, 110);
}

function slide19(){
	slide18();
	textSize(24);
	fill(0,0,150);
	text("1.", 120, 145);
	fill(0);
	textSize(22);
	text("Draw a set of equally-spaced parallel lines, say d-centimetres apart.", 150, 125, 2/3*c_x - 120, 70);
	stroke(0);
	makelines(25);
	noStroke();
}

function slide20(){
	slide19();
	textSize(24);
	fill(0,0,150);
	text("2.", 120, 215);
	fill(0);
	textSize(22);
	text("Randomly drop sticks of length l on the set of lines, where l < d.", 150, 194, 2/3*c_x - 120, 70);
	stroke(0);
	for (i = 1; i < needles.length; i++){
		if (needles[i][3]) {
			stroke(iscross, 0, 0);
		} else {
			stroke(0, 0, niscross);
		}
		newneedle(needles[i][0], needles[i][1], nlen, needles[i][2]);
	}
	stroke(0);
	curr_x = c_x*5/6 + j*(n_x - c_x*5/6)/nspeed;
	curr_y = 0 + j*(n_y)/nspeed;
	curr_angle = j*(n_a+TWO_PI)/nspeed;
	newneedle(curr_x,curr_y,nlen,curr_angle);
	if (j >= nspeed){
		j = 0;
		if (crosses(n_y,n_y+ nlen*sin(n_a),25)){
			crossed += 1
		}
		needles.push([n_x,n_y,n_a,crosses(n_y,n_y+ nlen*sin(n_a),25)])
	n_x = getRndInteger(c_x*2/3,c_x);
  	n_y = getRndInteger(0,c_y);
  	n_a = getRndInteger(0,TWO_PI);
  	}
  	j += 1
  	noStroke();
}

function slide21(){
	slide20();
	text("-  An individual stick will cross the line with probability", 155, 264, 2/3*c_x - 125, 70);
	katex.render("\\frac{2l}{\\pi d}", mykatex1);
	maths.style.top = "300px";
	maths.style.left = "180px";
	iscross = 255; //set crossing needles to red
	niscross = 0;
}

function slide22(){
	slide21();
	iscross = 0;
	niscross = 255; //set not crossing needles to blue
	text("-  An individual stick will lie between the lines with probability", 155, 335, 2/3*c_x - 123, 70);
	katex.render("1 - \\frac{2l}{\\pi d}", mykatex2);
	maths1.style.top = "373px";
	maths1.style.left = "270px";
}

function slide23(){
	slide22();
	textSize(24);
	fill(0,0,150);
	text("3.", 120, 427);
	fill(0);
	textSize(22);
	text("Count the number of sticks dropped, say N, and the number of sticks that crossed a line, say M.", 150, 408, 2/3*c_x - 123, 70);
	fill(255);
	rect(c_x-100, c_y-75, 150, 75);
	fill(0);
	text("N: " + needles.length.toString(),c_x - 95, c_y - 70);
	text("M: " + crossed.toString(),c_x-95, c_y - 35);
	iscross = 255;

}

function slide24(){
	slide23();
	textSize(24);
	fill(0,0,150);
	text("4.", 120, 510);
	fill(0);
	textSize(22);
	text("Approximate π using:", 150, 510);
	katex.render("\\frac{2l}{\\pi d} = \\frac{M}{N}", mykatex5);
	maths4.style.top = "560px";


}

function slide25(){
	slide24();
	nspeed = 1;
	bpi = (2*nlen*(needles.length-1))/(25*crossed);
	textSize(27);
	text("π ≈", 220, 620);
	cpi(bpi.toString() ,220 + textWidth("π ≈  "), 620)
	textSize(22);
}

function slide26(){
	needles = [];
	crossed = 0;
	background(255);
	textSize(30);
	fill(0,0,150);
	text("Buffon's Needle", 20, 30);
	fill(0);
	textSize(22);
	text("○ ", 100, 110);
	text("The problem was proposed in 1977 by the French philosopher Georges-Louis Leclerc, Comte du Buffon", 120, 90,
		c_x - 170, 75);
}

function slide27(){
	slide26();
	text("○ ", 100, 180);
	text("In 1901 the Italian mathematician Mario Lazzerini was the first to try out Buffon's discovery.", 120, 160, c_x - 170, 75);
}

function slide28(){
	slide27();
	text("- ", 120, 250);
	text("He dropped over 3,400 sticks onto the floor and counted up the number that crossed over lines",150, 230, c_x - 200, 75);
}

function slide29(){
	slide28();
	text("- ", 120, 320);
	text("He estimated π to be 3.1415929", 150, 320);
}

function slide30(){
	slide29();
	text("- ", 120, 355);
	text("He was correct in the first 6 digits, an error of just 0.000006%",150, 355);
}

function slide31(){
	slide30();
	text("○ ", 100, 390);
	text("With computers, simulations using randomness to give a sample of results have become much easier and of increasing importance", 120, 370, c_x - 170, 75);
}

function slide32(){
	background(255);
	textSize(30);
	fill(0,0,150);
	text("Why keep looking for new ways to calculate π?", 20, 30);
	fill(0);
	textSize(22);
	text("○ ", 100, 110);
	text("Probably, no-one will ever need more than a few hundred digits of π.", 120, 90,
		c_x - 170, 75);
}

function slide33(){
	slide32();
	fill(0,0,150);
	text("eg.", 120, 145);
	fill(0);
	text("40 digits of π are more than enough to calculate the circumference of the Milky Way to an error less than the size of a proton.", 155, 125, c_x - 170, 75);
}

function slide34(){
	slide33();
	text("○ ", 100, 215);
	text("Calculations of digits of π are excellent for testing the integrity of computer hardware and software.", 120, 195,
		c_x - 170, 75);
}

function slide35(){
	slide34();
	text("○ ", 100, 285);
	text("Stimulates research into advanced computational techniques.", 120, 285);
}

function slide36(){
	slide35();
	fill(0,0,150);
	text("eg.", 120, 320);
	fill(0);
	text("New techniques for efficiently computing linear convolutions and Fast Fourier Transforms (FFTs).", 155, 300, c_x - 170, 75);
}

function slide37(){
	slide36();
	text("○ ", 100, 390);
	text("Mathematicians want to finally solve the unresolved question of the normality of π.", 120, 390);
}

function slide38(){
	slide37();
	text("○ ", 100, 425);
	text("It is one of the most famous constants in Mathematics, and we will always be eager to find more impressive computations of π", 120, 405, c_x - 170, 75);
}

var maths = document.getElementById('mykatex1');
var maths1 = document.getElementById('mykatex2');
var maths2 = document.getElementById('mykatex3');
var maths3 = document.getElementById('mykatex4');
var maths4 = document.getElementById('mykatex5');

function draw() {
	/*
	Call function to display slide 'slidenum'
	This is pretty shaky javascript, but what does it matter?
	*/
	window["slide" + slidenum.toString()]();

}

function keyPressed(){
	/*
	Change slides using arrow keys
	*/
	if (keyCode == RIGHT_ARROW){
		if (slidenum < slidemax){
		framecount = 1;
		slidenum += 1;
		maths.innerHTML = "";
		maths1.innerHTML = "";
		maths2.innerHTML = "";
		maths3.innerHTML = "";
		maths4.innerHTML = "";
		}

	}
	if (keyCode == LEFT_ARROW){
		if (slidenum > 0){
			if (slidenum == 8){
				slidenum = 7;
			}
			framecount = 1;
			slidenum -= 1;
			maths.innerHTML = "";
			maths1.innerHTML = "";
			maths2.innerHTML = "";
			maths3.innerHTML = "";
			maths4.innerHTML = "";

		}

	}
	return false
}