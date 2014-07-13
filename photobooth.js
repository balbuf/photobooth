var PhotoBooth = (function($) {
	var pub = {},
		canv = [], //holder for the 4 canvases (for the 4 snapshots)
		filters = [], //holder for the filter preview videos
		video, //holder for the live video element
		localMediaStream, //data from video element
		num = 0, //snapshot number
		timeRef, //reference point for number
		snapInt, //snapping setinterval id
		isSnapping = false, //whether photo capture is in progress
		menuState, //current home menu state 0 or 1
		menuOptions = ["camera.png","strip.png"], //images for menu choices
		countDown, //default number of seconds for photo count down
		numSnaps; //default number of of snaps per session
	
	//prepare all video related assets
	function setUpVideo() {
		//make the canvases for the 4 snapshots
		for (var i=0; i<4; i++) {
			canv.push($("<canvas>").attr({width:640, height: 480, id:"pic"+i}).appendTo($("body"))[0].getContext("2d"));
		}
		//the videos for the filters preview
		for (var i=0; i<3; i++) {
			filters.push($("<div>").append($("<video>").attr({height:200,autoplay:true, id:"filter"+i, "class":"filter"+i})).appendTo($("#filters"))[0]);
		}
		//set first filter as default
		$("#filters div:first-child").addClass("selFilter");
		
		//video element on the page
		video = document.getElementById("preview");
		video.addEventListener('click', snapshot, false);
		localMediaStream = null;

		navigator.webkitGetUserMedia({video: true}, function(stream) {
		  video.src = window.webkitURL.createObjectURL(stream);
			$.each(filters, function(xxx,element) {
				element.firstChild.src = video.src;
			});
		  localMediaStream = stream;
		}, function () { alert("Video loading failed.") });
	}
	
	//capture current image data from live video stream
	function snapshot() {
	  if (localMediaStream) {
		$("#flash").show().delay(200).fadeOut(300);
		canv[num].drawImage(video, 0, 0,640,480);
		// "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
		//document.querySelector('img').src = canv[num].canvas.toDataURL('image/png');
		$("#data"+num).val(canv[num].canvas.toDataURL('image/jpeg'));
		//$("#picData")[0].submit();
		//cq(canv[num].canvas).sepia();
	  }
	}
	
	//start countdown to snaps
	function sayCheese() {
		$("#snapping").show();
		num = -1;
		timeRef = new Date();
		snapInt = setInterval(snapping, 100);
	}

	//snap at appropriate times
	function snapping() {
		isSnapping = true;
		var timeDiff = (new Date())-timeRef;
		//update countdown
		$("#snapping div").text(Math.round((4000-timeDiff)/1000));
		//4 seconds have passed, next snapshot happens
		if (timeDiff>=4000) {
			num++;
			snapshot();
			timeRef = new Date();
		}
		//4th snapshot done
		if (num==3) {
			window.clearInterval(snapInt);
			$("#snapping").hide();
			isSnapping = false;
			sendPics();
			//$("#picData")[0].submit();
			//do the printing stuff
		}
	}
	
	pub.isPrinting = false; //
	
	function sendPics() {
		$("#loading").show();
		$("#picData")[0].submit();
		pub.isPrinting = true;
		/*
		$.post("saveimg.php", $("#picData").serialize(), function (data) {
			if (data.indexOf(".png")>-1) {
				isPrinting = true;
				$("#printWin")[0].src = "showstrip.php?img=strips/"+data;
				$("#loading").fadeOut(400);
				homeMenu();
			} else {
				//allow for retry
			}
		});
		*/
	}
	
	//show home menu
	pub.goHome = function() {
		$("#home").show();
		$("#filmstrip").hide();
		$("#filmstrip > div div").empty();
		menuState=1;
		pub.toggleMenu();
	}
	
	//show camera, ready to take pictures
	pub.camera = function() {
		$("#home").hide();
		pub.resetFilter();
	}
	
	//show film roll to reprint strips
	pub.filmRoll = function() {
		$("#home").hide();
		$("#filmstrip").show();
		$("#filmstrip > div div").text("Loading");
		$("#filmstrip > div").scrollLeft(0);
		
		$.getJSON("strips.php", function(data) {
			$("#filmstrip > div div").empty();
			$.each(data,function(index,element) {
				$("#filmstrip > div div").append("<img src='"+element+"'/>");
			});
			$("#filmstrip > div div img:first").addClass("selStrip");
		});
	}
	
	//scroll through the strips left or right
	pub.scrollStrip = function(direction) {
		var selected = $(".selStrip")[0];
		if (direction==1) {
			if (selected.nextSibling) { 
				$(selected).removeClass("selStrip");
				$(selected.nextSibling).addClass("selStrip");
			}
		} else {
			if (selected.previousSibling) { 
				$(selected).removeClass("selStrip");
				$(selected.previousSibling).addClass("selStrip");
			}
		}
		$("#filmstrip > div").scrollLeft(($(".selStrip").position()).left-400);
	}

	//initial setup of the photobooth
	pub.setup = function() {
		setUpVideo();
		pub.goHome();
		$(document).keyup(function(event) {
		
		/*
		q 81
		0-8 48-56 (reg)
		0-8 96-104 (numpad)
		space 32
		left ctrl 17
		left shift 16
		enter 13
		w 87
		< 37
		> 39
		dn 40
		up 38
		del 46
		p 80
		s 83
		t 84
		
		*/

			//alert(event.which);
			

			if (event.which==37) { // < (left arrow key)
				if (!isSnapping) pub.changeFilter();
				if ($("#filmstrip").is(":visible")) pub.scrollStrip();
				pub.toggleMenu();
			} else if (event.which==39) { // > (right arrow key)
				if (!isSnapping) pub.changeFilter(1);
				if ($("#filmstrip").is(":visible")) pub.scrollStrip(1);
				pub.toggleMenu();
			} else if (event.which==32) { //space bar
				if ($("#home").is(":visible")) {
					if (menuState==0) {
						pub.camera();
					} else {
						pub.filmRoll();
					}
				} else if ($("#filmstrip").is(":visible")) {
					pub.isPrinting = true;
					$("#printWin")[0].src = "showstrip.php?img="+$(".selStrip")[0].src;
					//homeMenu();
				} else {
					sayCheese();
				}
			} else if (event.which==81 || event.which==27) { //q or ESC
				pub.goHome();
			}
		});
	}

	//move the selected filter left or right
	pub.changeFilter = function(direction) {
		var selected = $(".selFilter")[0];
		if (direction==1) {
			$(selected).removeClass("selFilter");
			if (selected.nextSibling) { 
				$(selected.nextSibling).addClass("selFilter");
			} else {
				$("#filters div:first-child").addClass("selFilter");
			}
		} else {
			$(selected).removeClass("selFilter");
			if (selected.previousSibling) { 
				$(selected.previousSibling).addClass("selFilter");
			} else {
				$("#filters div:last-child").addClass("selFilter");
			}
		}
		$("#preview").removeClass().addClass($(".selFilter video").attr("id"));
		$("#filSel").val($(".selFilter video").attr("id"));
	}
	
	//toggle home menu between new photo or reprint
	pub.toggleMenu = function() {
		menuState = Math.abs(menuState - 1); //flip flops between 0 and 1
		$("#home div div").removeClass("selMenu").each(function (index) {
			$(this).children("img")[0].src = menuOptions[index];
		});
		$("#home div div:eq("+menuState+")").addClass("selMenu");
		$("#home div div:eq("+menuState+") img").attr("src",function(i,val) {
			return "glow-"+val;
		});
	}

	//select default filter
	pub.resetFilter = function() {
		$("#filters div").removeClass("selFilter");
		$("#filters div:last-child").addClass("selFilter");
		pub.changeFilter(-1);
	}
	
	return pub;
}(jQuery));
