/*
orders of business:
1. get generic animated p5.js sketch to function as the background
2. add some html element(s) on top of background, make sure everything's all good in the hood
3. add other elements/plan further
*/

function setup() {

	var clientHeight = document.getElementById('container').clientHeight;
	var clientWidth = document.getElementById('container').clientWidth;

	var cnv = createCanvas(clientWidth, clientHeight);
	cnv.parent("container");
	background(0);
}