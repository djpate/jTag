<?php

/* this is ugly it's just a poc ! Do not use this on production (sql injection...)*/

mysql_connect("localhost","root","changeme");
mysql_select_db("jTag");

	switch($_REQUEST['action']){
		
		case 'list':
			$tags = array();
			$query = mysql_query("select * from tag");
			while($row = mysql_fetch_array($query)){
				$tags[] = array("id"=>$row['id'],
								"label"=>$row['label'],
								"width"=>$row['width'],
								"height"=>$row['height'],
								"top"=>$row['top'],
								"left"=>$row['left']);
			}
			echo json_encode($tags);
		break;
	
		case 'delete':
			mysql_query("delete from tag where id = ".$_REQUEST['id']);
		break;
		
		case 'save':
			mysql_query("insert into tag (`width`,`height`,`top`,`left`,`label`) values (
				".$_REQUEST['width'].",
				".$_REQUEST['height'].",
				".$_REQUEST['top'].",
				".$_REQUEST['left'].",
				'".$_REQUEST['label']."'
			)") or die(mysql_error());
			
			echo mysql_insert_id();			
		break;
	
	}

?>
