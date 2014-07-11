<!DOCTYPE HTML>
<html>
<head>
	<title>Photobooth</title>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<link rel="stylesheet" href="main.css" type="text/css">
	<script type="text/javascript" src="photobooth.js"></script>
</head>

<body onload="PhotoBooth.setup()">

<!-- Main Photobooth Interface -->
<video autoplay id="preview"></video>
<div id="controls">
	<div id="snapping">SMILE!
		<div>4</div>
	</div>
	<!-- directions -->
	<ol>
		<li>Pose for the camera</li>
		<li>Use arrow keys to select filter</li>
		<li>Press [SPACE BAR] to start</li>
	</ol>
	<!-- filter previews and selector -->
	<div id="filters"></div>
</div>

<!-- Flash (Full White Screen) -->
<div id="flash" class="full"></div>

<!-- Home Menu Screen -->
<div id="home" class="full">
	<div><h1>Photo Booth</h1>
		<div><img src="camera.png"/>Take New Photos</div>
		<div><img src="strip.png"/>Reprint Strips</div>
	</div>
	<div style="text-align: center; font-size: 30px; margin-top: 20px; clear: left;"><br/>Select option with arrow keys and press [SPACE BAR] to begin.</div>
</div>

<!-- Loading Screen -->
<div id="loading" class="full"><h1>Loading. Please wait!</h1></div>

<!-- Reprint Strips Screen -->
<div id="filmstrip" class="full"><h1>Reprint Strips: Select a strip with the arrow keys and press [SPACE BAR] to print</h1><div><div></div></div></div>

<!-- hidden iframe to print photostrip file -->
<iframe id="printWin" onload="if(PhotoBooth.isPrinting) { this.contentWindow.print(); PhotoBooth.isPrinting = false; PhotoBooth.goHome(); $('#loading').fadeOut(400); }" name="printWin"></iframe>

<!-- form to send image and filter data for serverside processing -->
<form action="saveimg.php" method="post" id="picData" target="printWin">
	<input type="hidden" name="data0" id="data0"/>
	<input type="hidden" name="data1" id="data1"/>
	<input type="hidden" name="data2" id="data2"/>
	<input type="hidden" name="data3" id="data3"/>
	<input type="hidden" name="filter" id="filSel"/>
</form>

</body>
</html>