// By: h01000110 (hi)
// github.com/h01000110

var max = document.getElementsByClassName("btn")[1];
var min = document.getElementsByClassName("btn")[2];

var zoom_status = "normal" // "normal", "maxmize"
var explorer = document.getElementsByClassName("wrapper")[0]

function maximize () {
	// hide file explorer
	var expl = document.getElementsByClassName("wrapper")[0]
	expl.parentNode.removeChild(expl)

	// change width
	var post = document.getElementsByClassName("content")[0];
	var cont = document.getElementsByClassName("post_content")[0];
	var wid = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName("body")[0].clientWidth;

	if (wid > 900) {
		widf = wid * 0.9;
		post.style.width = widf + "px";

		if (wid < 1400) {
			cont.style.width = "99%";
		} else {
			cont.style.width = "99.4%";
		}
	}

	// change height
	cont.style.maxHeight = ""
}

function max_btn_click () {
	if ( zoom_status == "normal" ) {
		maximize()
		zoom_status = "maxmize"
	}
}

function minimize () {
	// insert explorer
	document.body.insertBefore(explorer, document.body.childNodes[0])

	// change width
	var post = document.getElementsByClassName("content")[0];
	var cont = document.getElementsByClassName("post_content")[0];
	var wid = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName("body")[0].clientWidth;

	if ( wid > 900 ) {
		post.style.width = "800px";
		cont.style.width = "98.5%";
	}

	// change height
	cont.style.maxHeight = "600px"
}

function min_btn_click () {
	if ( zoom_status == "maxmize" ) {
		minimize()
		zoom_status = "normal"
	}
}


function init_content() {
	max.addEventListener('click', max_btn_click, false);
	min.addEventListener('click', min_btn_click, false);
	var cont = document.getElementsByClassName("post_content")[0];
	//cont.style.maxHeight = "600px"
}


function init() {
	if (document.getElementsByClassName("content")[0]) {
		init_content()
	}
}

window.onload = init
if (window.location.hash.includes("large-window")) {
	max_btn_click()
}
