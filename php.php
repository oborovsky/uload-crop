<?php
// $dir="/0";
// if(isset($_GET['id'])) $dir='/'.$_GET['id'];
// if(isset($_POST['id'])) $dir='/'.$_POST['id'];

class qqUploadedFileXhr {
    function save($path) {    
    	$src = $_FILES['phote']['tmp_name'];
        $input = fopen($src, "r");
        $temp = tmpfile();
        $realSize = stream_copy_to_stream($input, $temp);
        fclose($input);
        
        if ($realSize != $this->getSize()) return false;
        $target = fopen($path.".jpg", "w");
        fseek($temp, 0, SEEK_SET);
        stream_copy_to_stream($temp, $target);
        fclose($target);

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
		$src = fopen($path.'_thumb.jpg');
		imagejpeg($dst_r,$src,$jpeg_quality);
        
        return true;
    }
    function getName() {
    	$name = $_FILES['phote']['name'];
    	if ( isset($_POST['newName']) )
		{
			$name = $_POST['newName'].pathinfo($_FILES['phote']['name'])['extension'];
		}
        return $name;
    }
    function getSize() {
        if (isset($_SERVER["CONTENT_LENGTH"])){
            return (int)$_SERVER["CONTENT_LENGTH"];            
        } else {
            throw new Exception('Getting content length is not supported.');
        }      
    }   
}

class qqFileUploader {
    private $allowedExtensions = array();
    private $sizeLimit = 10485760;
    private $file;

    function __construct(array $allowedExtensions = array(), $sizeLimit = 10485760){        
//        $allowedExtensions = array_map("strtolower", $allowedExtensions);
            
        $this->allowedExtensions = $allowedExtensions;        
        $this->sizeLimit = $sizeLimit;
        
        $this->checkServerSettings();       

        if (isset($_FILES['phote']['tmp_name'])) $this->file = new qqUploadedFileXhr();
        else
        {
            $this->file = false;
        }
    }
    
    private function checkServerSettings(){        
        $postSize = $this->toBytes(ini_get('post_max_size'));
        $uploadSize = $this->toBytes(ini_get('upload_max_filesize'));        
        //echo $this->sizeLimit."\n".$postSize."\n".$uploadSize;
        if ($postSize < $this->sizeLimit || $uploadSize < $this->sizeLimit){
            $size = max(1, $this->sizeLimit / 1024 / 1024) . 'M';             
            die("{'error':'increase post_max_size and upload_max_filesize to $size'}");    
        }        
    }
    
    private function toBytes($str){
        $val = trim($str);
        $last = strtolower($str[strlen($str)-1]);
        switch($last) {
            case 'g': $val *= 1024;
            case 'm': $val *= 1024;
            case 'k': $val *= 1024;        
        }
        return $val;
    }
    
    /**
     * Returns array('success'=>true) or array('error'=>'error message')
     */
    function handleUpload($uploadDirectory){
        if (!is_writable($uploadDirectory)) return array('error' => "Server error. Upload directory isn't writable.");
 
        if (!$this->file) return array('error' => 'No files were uploaded.');
        
        $size = $this->file->getSize();

        if ($size == 0) return array('error' => 'File is empty');
        if ($size > $this->sizeLimit) return array('error' => 'File is too large');
        
        $pathinfo = pathinfo($this->file->getName());
        $filename = $pathinfo['filename'];
        $ext = $pathinfo['extension'];

        if(!in_array($ext,$this->allowedExtensions)) return array('error' => 'File has an invalid extension.');

        if($this->file->save($uploadDirectory.$filename)) return array('success'=>true);
        else return array('error'=> 'Could not save uploaded file.');
    }    
}

$allowedExtensions = array("jpeg","jpg","JPEG","JPG");
// max file size in bytes
$sizeLimit = 10485760;

$uploader = new qqFileUploader($allowedExtensions, $sizeLimit);
$result = $uploader->handleUpload('../../../gallery'.$dir.'/');
 //to pass data through iframe you will need to encode all html tags
echo htmlspecialchars(json_encode($result), ENT_NOQUOTES);