 /* If you ever wondered "should I hand-code my presentation in Javascript?"
 The answer is no. You get a wonderul interactive presentation, but everything
 takes five times as long.
 Also you will get very lazy and do bad coding. Would it be significantly faster to only re-draw
 the parts of the canvas which change (and also get rid of the huge chains of functions?) Yes.
 But because nothing is broken and I don't care how fast this runs, I'm not changing it.
*/
  var c_x = 1024;
  var c_y = 768;
  var n_x = 0;
  var n_y = 0;
  var n_a = 0;
  var img_for;

/*
function preload(){
	img_for = loadImage('./formula.png');
	img_two = loadImage('https://www.craig-wood.com/nick/pub/pymath/pi_geometric_proof.png');
}
*/

function setup() {
  var myCanvas = createCanvas(c_x, c_y);
  myCanvas.parent('slides');

  var n_x = getRndInteger(c_x*2/3,c_x); //Needle x
  var n_y = getRndInteger(0,c_y); //Needle y
  var n_a = getRndInteger(0, TWO_PI); //Needle angle
}
	
var framecount = 1;

var shape_radius = 150;
var shape_sides = 3;


var madh_pi = 0;
var madh_corr = 0;
var madh_num = 1;
var madh_speed = 80; //lower is faster - CHANGED FURTHER DOWN
var nterm_viet = 0
var viet_pi = 1;
var viet_term = 0;
var viet_speed = 80; //lower is faster
var framecount = 1;
var newpi = 1;

var line_len = 1;
var line_par = 1;

var num_parts = 5; //number of parts for Madhava proof, minimum 4

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
slidemax = 81;

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
	maths.style.fontSize = "16px";

}

function slide2(){
	background(255);
	image(img_two, 250, 200);
}

function slide3(){
	/*reset all related variables if new */
	strokeWeight(2);
	if (framecount == 1){
		shape_sides = 3;
	}
	background(255);
	noFill();
	textSize(16);
	stroke(0);
	ellipse(250, 300, shape_radius*2, shape_radius*2);
	polygon(250, 300, shape_radius, shape_sides);
	inscribe_r = shape_radius/cos(PI/(shape_sides));
	polygon(250,300, inscribe_r, shape_sides);
	if(framecount % 50 == 0){
	shape_sides = shape_sides + 1;
	}
	noStroke();
	fill(0);
	text("Sides: " + shape_sides, 450, 30);
	text("Inscribed perimeter: ", 450, 60);
	i_p = get_outer_p(shape_sides);
	cpi(i_p.toString(), 450 + textWidth("Inscribed perimeter: "), 60);
	text("Circumscribed perimeter: ", 450, 90);
	c_p = get_inner_p(shape_sides);
	cpi(c_p.toString(), 450 + textWidth("Circumscribed perimeter: "), 90);
	text("Mean perimeter: " , 450, 120);
	n = (i_p + c_p)/2;
	cpi(n.toString(), 450 + textWidth("Mean perimeter: "),120);
	framecount += 1;
	maths.style.top = framecount.toString() + "px";
}

function slide4(){
	strokeWeight(1);
	background(255);
	textSize(30);
	fill(0,0,150);
	text("Viéte's Sequence", 20, 30);
	fill(0);
	textSize(22);
	text("○", 100, 110);
	text("In 1593, François Viéte published 'Variorum de rebus mathematicis responsorum, liber VIII'.", 120, 110);
}

function slide5(){
	slide4();
	text("○", 100, 145);
	text("He advances the Archemedian idea of using polygons to approximate π, but instead of using it to create an "
	+ "approximation, he used it to create an exact expression of π.", 120, 125, c_x - 150, 75);
}

/* - Try again when hosting?
function slide6(){
	slide5();
	image(img_for, 170, 210);
	nterm_viet = 0
	viet_pi = 1;
	viet_term = 0;
	vier_speed = 80;
}
*/
function slide6(){ //If I have time, could update formula as we go along as well.
	slide5();
	katex.render("\\frac{2}{\\pi}=\\frac{\\sqrt{2}}{2} \\cdot \\frac{\\sqrt{2+\\sqrt{2}}}{2} \\cdot \\frac{\\sqrt{2+ \\sqrt{2 + \\sqrt{2}}}}{2} \\ldots",mykatex1);
	maths.style.top = "210px";
	maths.style.left = "170px";
	maths.style.fontSize = "30px";
	if (framecount % viet_speed ==1){
		nterm_viet += 1;
		viet_term = Vieterm(viet_term);
		viet_pi = viet_pi * viet_term;
	}
	text("Terms: "+ nterm_viet.toString(), 120, 310);
	text("π ≈ ", 400, 310);
	cpi((2/viet_pi).toString(), 400 + textWidth("π ≈ "), 310);
	framecount += 1
}

function slide7(){
	slide6();
	text("○", 100, 380);
	text("This is the first published example of an infinite product.", 120, 380);
}

function slide8(){
	slide7();
	text("○", 100, 415);
	text("As a hand-computed method, this is relatively effective, and Viéte used it to compute π accutately to 9 decimal places", 120, 395, c_x -150, 75);	
}

function slide9(){
	slide8();
	viet_speed = 10;
}

function slide10(){
	background(255);
	textSize(30);
	fill(0,0,150);
	text("The Leibniz Sequence", 20, 30);
	fill(0);
	textSize(22);
	text("○", 100, 110);
	text("When asked how to compute π, most undergraduate mathematicians would be able to point you towards the Leibniz sequence.", 120, 90, c_x - 150, 75);
}

function slide11(){
	slide10();
	katex.render("\\frac{\\pi}{4} = 1 - \\frac{1}{3} + \\frac{1}{5} - \\frac{1}{7} + \\ldots + (-1)^n \\frac{1}{2n+1} ",mykatex1);
	maths.style.fontSize = "27px"
	maths.style.top = "170px";
	maths.style.left = "200px";
 }

 function slide12(){
 	slide11();
 	text("○", 100, 250);
 	text("In 1671, James Gregory published a paper in Mathematics Magazine stating a new expression for arctan(x):", 120, 230, c_x - 150, 75);
 	katex.render("arctan(x) = x - \\frac{x^3}{3} + \\frac{x^5}{5}- \\frac{x^7}{7} + \\ldots + (-1)^n\\frac{x^{2n+1}}{2n+1}",mykatex2);
 	maths1.style.top = "300px";
 	maths1.style.left = "200px";
 	maths1.style.fontSize = "23px";
 	text("where substituting in x = 1 give us an expression for", 120, 370);
 	katex.render("\\frac{\\pi}{4}", mykatex3)
 	maths2.style.top = "360px";
 	maths2.style.left = (textWidth("where substituting in x = 1 give us an expression for ") + 130).toString() + "px";

 }

 function slide13(){
 	slide12();
 	text("○", 100, 405);
 	text("However, in 1835, C. M. Whish published a collection of 16th century papers from the Kerala school of Astronomy and Mathematics in Eastern India.", 120, 385, c_x - 150, 75);
 }

 function slide14(){
 	slide13();
 	text("○", 100, 465);
 	text("We now generally credit this discovery to Madhava of Sangamagrama (1340 - 1425), the founder of the school.", 120, 445, c_x - 150, 75);
 }

 function slide15(){
 	background(255);
	textSize(30);
	fill(0,0,150);
	text("The Leibniz Sequence", 20, 30);
	fill(0);
	textSize(22);
 	text("○", 100, 150);
 	text("One of the later papers by the group gives a proof:", 120, 150);
 }

 function slide16(){
 	slide15();
 	textSize(30);
 	fill(255, 0, 0);
	text("^", 125, 60);
	rotate(0.4);
	textSize(25);
	text("Madhava", 100, 20);
	rotate(-0.4);
	fill(0);
	stroke(255,0,0);
	strokeWeight(2);
	line(85, 30, 170, 7);
	strokeWeight(1);
	noStroke();
	textSize(22);
 }

function msquare1(){
	stroke(0);
 	noFill();
 	rect(550, 200, 400, 400);
 	arc(550, 200, 800, 800, 0, HALF_PI);
 	fill(0);
 	noStroke();
 	 text("O", 550, 197);
 	 text("X", 950, 197);
}


 function slide17(){
 	slide16();
 	fill(0,0,150);
 	text("1", 100, 200);
 	fill(0);
 	text("Draw a quarter circle with center O and radius 1 inside a square", 120, 180, c_x - 600, 75);
 	if (slidenum == (17)){
 		 msquare1();
 	}

 }

function msquare2(){
	msquare1();
	stroke(100,100,100);
 	strokeWeight(2);
 	for (i = 1; i < num_parts+1; i++){
 		line(955,200+i*(400/num_parts),955,200+i*(400/num_parts)-line_len);
 	}
 	if (line_len < (400/num_parts - 3)){
 		line_len += 2;
 	} else{
 		line_len = (400/num_parts - 3);
 		strokeWeight(1);
 		noStroke();
 		text("𝛿", 960, 570);
 		stroke(100,100,100);
 	 	}
 	stroke(0);
 	strokeWeight(1);
 	noStroke(); 
}

 function slide18(){
 	slide17();
 	fill(0,0,150);
 	text("2", 100, 270);
 	fill(0);
 	text("Split the side of the square into n equal parts of length 𝛿, and join two ends of the rth length, A and B to the center of the arc.", 120, 250, c_x - 600, 110);
 	if (slidenum == 18); {
 	msquare2();
 	}
 }

 function msquare3(){
 	msquare2();
 	stroke(0);
	line(950,200+(400/num_parts)*3,950-(400*(line_par/50)),200+(400/num_parts)*3-((400/num_parts)*3*(line_par/50)));
	line(950,200+(400/num_parts)*4,950-(400*(line_par/50)),200+(400/num_parts)*4-((400/num_parts)*4*(line_par/50)));	
	if (line_par < 50){
			line_par += 1
	}

	noStroke();
	text("A", 960, 200+(400/num_parts)*3);
	text("B", 960, 200+(400/num_parts)*4);
}


function slide19(){
	slide18();
	if (slidenum == 19){
	msquare3();
	}

}

function msquare4(){
	msquare3();
	sf = 400/Math.pow(Math.pow(400,2)+Math.pow((400/num_parts*3),2),0.5);
	h1 = ((400/num_parts)*(4-3)*400*(400/num_parts)*4)/(Math.pow(400,2)+Math.pow((400/num_parts*4),2));
	x_t = 950-h1
	h2 = 400*h1/(400/num_parts*4);
	y_t = 200+(400/num_parts)*3+h2;

	stroke(0);
	strokeWeight(2);
	line(550 + 400*sf/400*(x_t - 550),
		200 + sf*(y_t-200)
		,550+400*sf, 200+(400/num_parts)*3*sf);
	strokeWeight(1);
	noStroke();

 	text("C",550+400*sf-9, 190+(400/num_parts)*3*sf);
 	text("D", 530 + 400*sf/400*(x_t - 550), 210 + sf*(y_t-200));
}

function slide20(){
	slide19();
	if (slidenum == 20){
	msquare4();
	}
	fill(0,0,150);
 	text("3", 100, 375);
 	fill(0);
 	text("The line OA cuts the intersects the circle at point C. Draw perpendicular lines from points C and A to the line OB.", 120, 355, c_x - 600, 110);
}

function msquare5(){
	msquare4();
	stroke(0);
	line(x_t,y_t,950,200+(400/num_parts)*3);
	noStroke();
	text("E",x_t-20,y_t+10);
}

function slide21(){
	slide20();
	msquare5();
}

function slide22(){
	slide21();
	text("This gives us two similar triangles OAE and OCD, and so", 120, 460, c_x - 600, 110);
	katex.render("\\frac{|CD|}{|OC|} = \\frac{|AE|}{|OA|}",mykatex1);
	maths.style.top = "550px";
	maths.style.left = "150px";
	maths.style.fontSize = "20px";
}

function slide23(){
	slide21();
	text("This gives us two similar triangles OAE and OCD, and so", 120, 460, c_x - 600, 110);
	katex.render("\\frac{|CD|}{|OC|} = \\frac{|AE|}{|OA|} \\therefore |CD| = \\frac{|AE|}{|OA|}",mykatex1);
	maths.style.top = "550px";
	maths.style.left = "150px";
	maths.style.fontSize = "20px";
}

function slide24(){
	background(255);
	textSize(30);
	fill(0,0,150);
	text("The Leibniz Sequence", 20, 30);
	fill(255, 0, 0);
	text("^", 125, 60);
	rotate(0.4);
	textSize(25);
	text("Madhava", 100, 20);
	rotate(-0.4);
	fill(0);
	stroke(255,0,0);
	strokeWeight(2);
	line(85, 30, 170, 7);
	strokeWeight(1);
	noStroke();
	textSize(22);
	msquare5();
	katex.render("|CD| = \\frac{|AE|}{|OA|}",mykatex1);
	maths.style.top = "140px";
	maths.style.left = "150px";
	maths.style.fontSize = "20px";

	fill(0,0,150);
 	text("4", 100, 200);
 	fill(0);
 	text("We can also see that triangles AEB and OBX are similar, and so", 120, 180, c_x - 600, 75);
}

function slide25(){
	slide24();
	katex.render("\\frac{|AB|}{|OB|} = \\frac{|AE|}{|OX|}",mykatex2);
	maths1.style.top = "250px";
	maths1.style.left = "150px";
	maths1.style.fontSize = "20px";
}

function slide26(){
	slide24();
	katex.render("\\frac{|AB|}{|OB|} = |AE|",mykatex2);
	maths1.style.top = "250px";
	maths1.style.left = "150px";
	maths1.style.fontSize = "20px";
}

function slide27(){
	slide26();
	fill(0,0,150);
 	text("5", 100, 310);
 	fill(0);
 	text("And so we can conclude that", 120, 290, c_x - 600, 75);
 	katex.render("|CD| = \\frac{|AB|}{|OA||OB|}", mykatex3);
 	maths2.style.top = "330px";
 	maths2.style.left = "150px";
 	maths2.style.fontSize = "20px";
}

function slide28(){
	slide26();
	fill(0,0,150);
 	text("5", 100, 310);
 	fill(0);
 	text("And so we can conclude that", 120, 290, c_x - 600, 75);
 	katex.render("|CD| = \\frac{|AB|}{|OA||OB|} \\approx \\frac{|AB|}{|OA|^2}", mykatex3);
 	maths2.style.top = "330px";
 	maths2.style.left = "150px";
 	maths2.style.fontSize = "20px";
}

function slide29(){
	slide28();
	fill(0,0,150);
 	text("6", 100, 390);
 	fill(0);
 	text("And so, by the Pythagorean theorem", 120, 370, c_x - 600, 75);
 	katex.render("|CD| = \\frac{\\delta}{1^2 + |XA|^2}", mykatex4)
 	maths3.style.top = "415px";
 	maths3.style.left = "150px";
 	maths3.style.fontSize = "20px";
 	 num_parts = 5;
}

function slide30(){
	slide28();
	fill(0,0,150);
 	text("6", 100, 390);
 	fill(0);
 	text("And so, by the Pythagorean theorem", 120, 370, c_x - 600, 75);
 	katex.render("|CD| = \\frac{\\delta}{1^2 + |XA|^2} = \\frac{\\delta}{1 + r^2\\delta^2}", mykatex4)
  	maths3.style.top = "415px";
 	maths3.style.left = "150px";
 	maths3.style.fontSize = "20px";
}

function slide31(){
	slide30();
	fill(0,0,150);
 	text("7", 100, 470);
 	fill(0);
 	text("As CD approximates the arc of the circle, we can in general say", 120, 450, c_x - 600, 75);
 	katex.render("\\frac{\\pi}{4}=\\lim_{n \\rightarrow \\infty}\\sum_{r = 1}^{n} \\frac{\\delta}{1 + r^2\\delta^2}; \\delta = \\frac{1}{n}", mykatex5);
 	maths4.style.top = "520px";
 	maths4.style.left = "150px";
 	maths4.style.fontSize = "20px"

}

function slide32(){
	slide31();
	if (framecount % 30 == 1){
		num_parts += 1;
	}
	framecount += 1;
}

function slide33(){
	slide31();
	katex.render("\\frac{\\pi}{4} = 1 - \\frac{1}{3}+ \\frac{1}{5} \\ldots + (-1)^n \\frac{1}{2n+1}", mykatex6);
	maths5.style.top = "570px";
	maths5.style.left = "150px"
	maths5.style.fontSize = "20px";
	madh_num = 1;
	madh_pi = 0;
	madh_corr = 0;
	madh_speed = 80;
	nterm_viet = 0
	viet_pi = 1;
	viet_term = 0;
}

function slide34(){
	background(255);
	textSize(30);
	fill(0,0,150);
	text("The Leibniz Sequence", 20, 30);
	fill(255, 0, 0);
	text("^", 125, 60);
	rotate(0.4);
	textSize(25);
	text("Madhava", 100, 20);
	rotate(-0.4);
	fill(0);
	stroke(255,0,0);
	strokeWeight(2);
	line(85, 30, 170, 7);
	strokeWeight(1);
	noStroke();
	textSize(22);

	text("Number of terms: " + madh_num , 100, 130);
	if (framecount % madh_speed == 0){
		madh_pi = Madhava(madh_pi,madh_num);
		madh_corr = Madhava_correct(madh_num)*4
		madh_num += 1
		viet_term = Vieterm(viet_term)
		viet_pi = viet_pi * viet_term;
	}
	text("π ≈", 350, 130)
	cpi(madh_pi.toString(), 400, 130);

	text("○", 100, 165);
	text("This teaches us something new about π, but there is a slight hitch.", 120, 165);
	framecount += 1;
}

function slide35(){
	madh_speed = 1;
	slide34();
}

function slide36(){
	slide34();
	text("Viéte's approximation: ", 100, 200);
	cpi((2/viet_pi).toString(), 350, 200);
}

function slide37(){
	madh_speed = 80;
	slide34();
	text("○", 100, 200);
	text("The Keralans found a series of correction terms to the sequence ",120,180,c_x - 150, 75);
	katex.render("f_1(n) = (-1)^n\\frac{1}{2n}",mykatex1);
	katex.render("f_2(n) = (-1)^n\\frac{n}{4n^2+1}",mykatex2);
	katex.render("f_3(n) = (-1)^n\\frac{n^2+1}{4n^3+5n}",mykatex3);
	maths.style.top = "235px";
	maths.style.left = "120px";
	maths.style.fontSize = "20px";
	maths1.style.top = "270px";
	maths1.style.left = "120px";
	maths1.style.fontSize = "20px";
	maths2.style.top = "305px";
	maths2.style.left = "120px";
	maths2.style.fontSize = "20px";

}

function slide38(){
	slide34();
	text("○", 100, 200);
	text("The Keralans found a series of correction terms to the sequence ",120,180,c_x - 150, 75);
	katex.render("f_1(n) = (-1)^n\\frac{1}{2n}",mykatex1);
	katex.render("f_2(n) = (-1)^n\\frac{n}{4n^2+1}",mykatex2);
	katex.render("f_3(n) = (-1)^n\\frac{n^2+1}{4n^3+5n}",mykatex3);
	maths.style.top = "235px";
	maths.style.left = "120px";
	maths.style.fontSize = "20px";
	maths1.style.top = "270px";
	maths1.style.left = "120px";
	maths1.style.fontSize = "20px";
	maths2.style.top = "305px";
	maths2.style.left = "120px";
	maths2.style.fontSize = "20px";
	text("○", 100, 355);
	text("Whilst we don't know how they came about these functions, they are the first three terms of the infinite continued fraction", 120, 335, c_x - 150, 75);
	katex.render("f_n(x) = \\frac{1}{2}\\cdot \\cfrac{1}{n + \\cfrac{1^2}{n + \\cfrac{2^2}{n + \\cfrac{3^2}{\\ldots}}}}", mykatex4);
	maths3.style.top = "390px";
	maths3.style.left = "120px";
	maths3.style.fontSize = "16px";
}

function slide39(){
	madh_num = 1;
	madh_pi = 0;
	madh_corr = 0;
	madh_speed = 50
	slidenum += 1;
}

function slide40(){
	slide38()
	if (madh_num%2 == 0) { //Adds - in correct place without the text moving
	text("-", 150 + textWidth("Correction term:  "), 550);
	}
	text(Math.abs(madh_corr), 150 + textWidth("Correction term:  - "), 550);
	text("Correction term:", 120, 550);
	
	cpi((madh_pi + madh_corr).toString(), 150 + textWidth("Correction term:  - "), 585);
	text("Corrected sequence", 120, 585);
}

function slide41(){
	madh_speed = 1;
	slide40();
}

function slide42(){
	madh_num = 1;
	madh_pi = 0;
	madh_corr = 0;
	madh_speed = 80;
	nterm_viet = 0
	viet_pi = 1;
	viet_term = 0;
	background(255);
	textSize(30);
	fill(0,0,150);
	text("Modern Calculations of π", 20, 30);
	fill(0);
	textSize(22);
	text("○", 100, 110);
	text("In his first published paper in 1914, Ramanujan published several expressions for π including the famous ", 120, 90, c_x - 150, 75);
	katex.render("\\frac{1}{\\pi} = \\frac{2\\sqrt{2}}{9801} \\sum_{k=0}^{\\infty} \\frac{(4k)!(1103 + 26390k)}{(k!)^4 396^{4k}}",mykatex1);
	maths.style.top = "160px";
	maths.style.left = "120px";
	maths.style.fontSize = "20px";
}

function slide43(){
	slide42();
	text("○", 100, 220);
	text("The formula was largely forgotten until November of 1985, when R William Gosper Jr used this formula to calculate a record-breaking 17,326,100 digits of π.", 120, 200, c_x - 150, 75);
}

function slide44(){
	slide43();
	text("○", 100, 280);
	text("The Chundovsky brothers built on Ramanujan's ideas and found an improved formula, calculating 14 correct new digits per term.", 120, 260, c_x - 150, 75);
	katex.render("\\frac{1}{\\pi}= 12 \\sum_{k=1}^{\\infty}\\frac{(-1)^k (6k)!(545140134k + 13591409)}{(3k)!(k!)^3(640320^{3k+3/2})}",mykatex2);
	maths1.style.top = "345px"
	maths1.style.left = "120px"
	maths1.style.fontSize = "20px"
}

function slide45(){
	slide44()
	text("○", 100, 410);
	text("Research continues today. The Chundovskys continue to work on high performance computing, and the Borwein brothers work with Simon Plouffe to discover the BBP algorithm for calculating arbitrary digits of π.", 120, 390, c_x - 150, 110);
}

function slide46(){
	maths.style.fontSize = "16px";
	maths1.style.fontSize = "16px";
	maths2.style.fontSize = "16px";
	maths3.style.fontSize = "16px";
	maths4.style.fontSize = "16px";
	maths5.style.fontSize = "160px";
	background(255);
	textSize(30);
	fill(0,0,150);
	text("The Monte Carlo Method", 20, 30);
	fill(0);
	textSize(22);
	text("○ Approximate π using statistics.", 100, 110);
}

function slide47(){
	slide46();
	text("○ Method:", 100, 145);
}

function slide48(){
	slide47();
	textSize(24);
	fill(0,0,150);
	text("1.", 120, 180);
	fill(0);
	textSize(22);
	text("Inscribe a quadrant (quarter of a circle) of radius r inside a square with side length r", 150, 180);
}

var circlespeed = 50 //Controls how fast the circle draws. Lower is faster

function slide49(){
	slide48()
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


function slide50(){
	circlespan = 0;
	slide48();
	stroke(0);
	noFill();
	rect(c_x-300,c_y-300 ,250,250);
	arc(c_x-300,c_y-300, 500, 500, 0, HALF_PI);
	noStroke();
	fill(0);
}


function slide51(){
	slide50();
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

function slide52(){
	slide50();
	text("-  The area of the quadrant will be      .", 155, 215);
	katex.render("\\frac{\\pi r^2}{4}", mykatex1);
	maths.style.top = "202px";
	maths.style.left = (textWidth("-  the area of the quadrant will be ")+170).toString() + "px";
	text("-  The area of the square will be    .", 155, 250);
	katex.render("r^2", mykatex2);
	maths1.style.top = "240px";
	maths1.style.left = (textWidth("-  The area of the square will be")+170).toString() + "px";
}

function slide53(){
	slide52();
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

function slide54(){
	slide53();
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
  	textSize(27);
	text("π ≈", 220, 620);
	cpi((4*dots_in/(dots_in+dots_out)).toString(), 220 + textWidth("π ≈  "), 620)
	textSize(22);
}

function slide55(){
	slide53()
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
	  textSize(27);
	text("π ≈", 220, 620);
	cpi((4*dots_in/(dots_in+dots_out)).toString(), 220 + textWidth("π ≈  "), 620)
	textSize(22);
}

function slide56(){
	slide55();
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

function slide57(){
	slide56();
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

function slide58(){
	slide57();

}

function slide59(){
	background(255);
	text("Did you know we can measure π just by dropping sticks on a table and counting them?", 100, 300, c_x-300, c_y-350);
	dots_in = 0;
	dots_out = 0;
	dists = [];
	x_coords = [];
	y_coords = [];
}

function slide60(){
	background(255);
	textSize(30);
	fill(0,0,150);
	text("Buffon's Needle", 20, 30);
	fill(0);
	textSize(22);
	text("○ Method:", 100, 110);
}

function slide61(){
	slide60();
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

function slide62(){
	slide61();
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
	bpi = (2*nlen*(needles.length-1))/(25*crossed);
	textSize(27);
	text("π ≈", 220, 630);
	cpi(bpi.toString() ,220 + textWidth("π ≈  "), 630);
	textSize(22);
}

function slide63(){
	slide62();
	text("-  An individual stick will cross the line with probability", 155, 264, 2/3*c_x - 125, 70);
	katex.render("\\frac{2l}{\\pi d}", mykatex1);
	maths.style.top = "300px";
	maths.style.left = "180px";
	iscross = 255; //set crossing needles to red
	niscross = 0;
}

function slide64(){
	slide63();
	iscross = 0;
	niscross = 255; //set not crossing needles to blue
	text("-  An individual stick will lie between the lines with probability", 155, 335, 2/3*c_x - 123, 70);
	katex.render("1 - \\frac{2l}{\\pi d}", mykatex2);
	maths1.style.top = "373px";
	maths1.style.left = "270px";
}

function slide65(){
	slide64();
	textSize(24);
	fill(0,0,150);
	text("3.", 120, 427);
	fill(0);
	textSize(22);
	text("Count the number of sticks dropped, say N, and the number of sticks that crossed a line, say M.", 150, 408, 2/3*c_x - 123, 70);
	fill(255);
	rect(c_x-100, c_y-75, 150, 75);
	fill(0);
	text("N: " + needles.length.toString(),c_x - 95, c_y - 50);
	text("M: " + crossed.toString(),c_x-95, c_y - 20);
	iscross = 255;

}

function slide66(){
	slide65();
	textSize(24);
	fill(0,0,150);
	text("4.", 120, 510);
	fill(0);
	textSize(22);
	text("Approximate π using:", 150, 510);
	katex.render("\\frac{2l}{\\pi d} = \\frac{M}{N}", mykatex5);
	maths4.style.top = "560px";


}

function slide67(){
	slide66();
	nspeed = 1;
	textSize(22);
}

function slide68(){
	background(255);
	textSize(30);
	fill(0,0,150);
	text("Buffon's Needle", 20, 30);
	stroke(0);
	makelines(25);
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
	bpi = (2*nlen*(needles.length-1))/(25*crossed);
	textSize(27);
	text("π ≈", 220, 630);
	cpi(bpi.toString() ,220 + textWidth("π ≈  "), 630);
	textSize(22);
	noStroke();
	fill(255);
	rect(c_x-100, c_y-75, 150, 75);
	fill(0);
	text("N: " + needles.length.toString(),c_x - 95, c_y - 50);
	text("M: " + crossed.toString(),c_x-95, c_y - 20);
	fill(0);
	textSize(22);
	text("○ ", 100, 110);
	text("The problem was proposed in 1777 by the French philosopher Georges-Louis Leclerc, Comte du Buffon", 120, 90,
		2/3*c_x - 123, 75);
}

function slide69(){
	slide68();
	text("○ ", 100, 180);
	text("In 1901 the Italian mathematician Mario Lazzerini was the first to try out Buffon's discovery.", 120, 160, 2/3*c_x - 123, 75);
}

function slide70(){
	slide69();
	text("- ", 120, 250);
	text("He dropped over 3,400 sticks onto the floor and counted up the number that crossed over lines",150, 230, 2/3*c_x - 150, 75);
}

function slide71(){
	slide70();
	text("- ", 120, 320);
	text("He estimated π to be 3.1415929", 150, 320);
}

function slide72(){
	slide71();
	text("- ", 120, 355);
	text("He was correct in the first 6 digits, an error of just 0.000006%",150, 335, 2/3*c_x - 150, 75);
}

function slide73(){
	slide72();
	text("○ ", 100, 430);
	text("With computers, simulations using randomness to give a sample of results have become much easier and of increasing importance", 120, 410, 2/3*c_x - 123, 110);
}

function slide74(){
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

function slide75(){
	slide74();
	fill(0,0,150);
	text("eg.", 120, 145);
	fill(0);
	text("40 digits of π are more than enough to calculate the circumference of the Milky Way to an error less than the size of a proton.", 155, 125, c_x - 170, 75);
}

function slide76(){
	slide75();
	text("○ ", 100, 215);
	text("Calculations of digits of π are excellent for testing the integrity of computer hardware and software.", 120, 195,
		c_x - 170, 75);
}

function slide77(){
	slide76();
	text("○ ", 100, 285);
	text("Stimulates research into advanced computational techniques.", 120, 285);
}

function slide78(){
	slide77();
	fill(0,0,150);
	text("eg.", 120, 320);
	fill(0);
	text("New techniques for efficiently computing linear convolutions and Fast Fourier Transforms (FFTs).", 155, 300, c_x - 170, 75);
}

function slide79(){
	slide78();
	text("○ ", 100, 390);
	text("Mathematicians want to finally solve the unresolved question of the normality of π.", 120, 390);
}

function slide80(){
	slide79();
	text("○ ", 100, 425);
	text("It is one of the most famous constants in mathematics, and we will always be eager to find more impressive computations of π", 120, 405, c_x - 170, 75);
}

function slide81(){
	background(255);
	textSize(30);
	fill(0,0,150);
	text("References", 20, 30);
	fill(0);
	textSize(22);
	text("- The Quest for Pi - Bailey, Borwein, Borwein & Plouffe", 100, 100);
	text("- Fun with Math in Python - Craig Wood", 100, 170,);
	text("- The Discovery of the Series Formula for π by Leibniz, Gregory and Nilakantha - Ranjan Roy", 100, 240);
	text("- Ramanujan's Series for 1/π: A Survey - Baruah, Berndt & Chan", 100, 310);
	fill(0,0,200);
	textSize(18);
	text("http://crd-legacy.lbl.gov/~dhbailey/dhbpapers/pi-quest.pdf", 120, 135);
	text("https://www.craig-wood.com/nick/articles/pi-archimedes/", 120, 205);
	text("https://pdfs.semanticscholar.org/5cb2/4ef31a09a66625a26a74de59273dff5bb232.pdf", 120, 275);
	text("https://www.maa.org/sites/default/files/pdf/pubs/amm_supplements/Monthly_Reference_5.pdf", 120, 345);
}



/*
References:
http://crd-legacy.lbl.gov/~dhbailey/dhbpapers/pi-quest.pdf - The Quest for pi
https://www.craig-wood.com/nick/articles/pi-archimedes/ - Craig Wood - Fun with Math in Python
https://pdfs.semanticscholar.org/5cb2/4ef31a09a66625a26a74de59273dff5bb232.pdf - The Discovery of the series formula for π by Leibniz, Gregory and Nilakantha.
https://www.maa.org/sites/default/files/pdf/pubs/amm_supplements/Monthly_Reference_5.pdf - Ramanujan's series for 1/π a survey
*/

var maths = document.getElementById('mykatex1');
var maths1 = document.getElementById('mykatex2');
var maths2 = document.getElementById('mykatex3');
var maths3 = document.getElementById('mykatex4');
var maths4 = document.getElementById('mykatex5');
var maths5 = document.getElementById('mykatex6')

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
		maths5.innerHTML = "";
		}

	}
	if (keyCode == LEFT_ARROW){
		if (slidenum > 0){
			if (slidenum == 40){ 
				slidenum = 39;
			}
			if (slidenum == 50){
				slidenum == 49;
			}
			framecount = 1;
			slidenum -= 1;
			maths.innerHTML = "";
			maths1.innerHTML = "";
			maths2.innerHTML = "";
			maths3.innerHTML = "";
			maths4.innerHTML = "";
			maths5.innerHTML = "";

		}

	}
	return false
}