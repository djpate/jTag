<html>
	<head>
		<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js'></script>
		<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.7/jquery-ui.min.js'></script>
		<script type='text/javascript' src='../source/jquery.tag.js'></script>
		<link media="screen" rel="stylesheet" href="../css/jquery.tag.css" type="text/css" />
		<link media="screen" rel="stylesheet" href="../css/jquery-ui.custom.css" type="text/css" />
	</head>
	<body>
		<img src="simp.jpg" id="img" />
	</body>
	<script>
		$(document).ready(function(){
			
			$("#img").tag({
				save: function(width,height,top_pos,left,label,the_tag){
					$.post("ajax.php",{'action':'save','width':width,'height':height,'top':top_pos,'left':left,'label':label},function(id){
						the_tag.setId(id);
					});
				},
				remove: function(id){
					$.post("ajax.php",{'action':'delete','id':id});
				}
			});
			
			$.getJSON("ajax.php",{'action':'list'},function(tags){
				$.each(tags, function(key,tag){
					$("#img").addTag(tag.width,tag.height,tag.top,tag.left,tag.label,tag.id);
				});
			});
			
		});
	</script>
</html>
