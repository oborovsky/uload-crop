<html>
<body>

<?php
$dir = 'images/';
$src = $_FILES['phote']['tmp_name'];
$name = $_FILES['phote']['name'];
$name = explode('.', $name);
$name = $name[0];

$photo_dest = 'images/'.$name.'_pic.jpg';
	// copy the photo from the tmp path to our path
copy($src, $photo_dest);

$targ_w = $_POST['target_w'];
$targ_h = $_POST['target_h'];
$source_w = $_POST['source_w'];
$source_h = $_POST['source_h'];
$aspectRation  = $source_w / $source_h;
// quality
$jpeg_quality = 90;
// photo path

// create new jpeg image based on the target sizes
$img_r = imagecreatefromjpeg($src);
$dst_r = ImageCreateTrueColor( $targ_w, $targ_h );
// crop photo
imagecopyresampled($dst_r,$img_r,0,0,$_POST['x'],$_POST['y'], $targ_w,$targ_h,$_POST['w'],$_POST['h']*$aspectRation);
// create the physical photo
imagejpeg($dst_r,$src,$jpeg_quality);
$photo_dest = 'images/'.$name.'_i.jpg';
copy($src, $photo_dest);
echo "Ok";
?>
</body>
</html>