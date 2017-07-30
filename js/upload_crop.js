// the target size
var TARGET_W = 200;
var TARGET_H = 200;
var source_w = 200;
var source_h = 200;

// var dropbox = document.getElementById("Response");
// 	dropbox.addEventListener('dragenter', dragenter, false);
// 	dropbox.addEventListener('dragover', dragover, false);
// 	dropbox.addEventListener('drop', drop, false);

	// function dragenter(e)
	// {
	// 	e.stopPropagation();
	// 	e.preventDefault();
	// }

	// function dragover(e)
	// {
	// 	e.stopPropagation();
	// 	e.preventDefault();
	// }

	// function drop(e)
	// {
	// 	e.stopPropagation();
	// 	e.preventDefault();

	// 	var dt = e.dataTransfer;	
	// 	var files = dt.files
	// 	loadFile(files);
	// }
	
	function loadFile(files)
	{
			var file = files[0];
			var name = file.name;
			var img1 = document.createElement('img');
			var img2 = document.createElement('img');
			img1.classList.add('obj');
			img1.file = file;
			img2.classList.add('obj');
			img2.file = file;
			img1.width = img2.width = 400;
			// img1.heigth = img2.heigth = 400;

			var preview1 = document.getElementById('img1');
			var preview2 = document.getElementById('img2');
			var name_img1 = document.getElementById('name_img1');
			var name_img2 = document.getElementById('name_img2');
			var base_name = name.split('.');

			name_img1.innerHTML = base_name[0] + '_i.' + base_name[1];
			name_img2.innerHTML = base_name[0] + '_pic.' + base_name[1];
			preview1.appendChild(img1);
			preview2.appendChild(img2);

			var reader = new FileReader();

			reader.onload = ( function(imgs){
				return function(e){

					imgs.forEach(function(img,i){
						img.src=e.target.result;

						if ( i == 0 )
						{
							
							// Initialize the Jcrop using the TARGET_W and TARGET_H that initialized before
							
						}
					});
					img = new Image();
					img.src = e.target.result;
					
					img.onload = function()
					{
						source_w = this.width;
						source_h = this.height;
						$('#source_h').val(source_h);
						$('#source_w').val(source_w);

						try 
						{
								jcrop_api.destroy();
						} 
						catch (e) 
						{
								// object not defined
						}
						$('#img1>img').Jcrop({
					      trueSize:[source_w,source_h],
					      aspectRatio:1,
					      setSelect: [ 100, 100, TARGET_W, TARGET_H ],
					      onSelect: updateCoords,
					      onChange: updateCoords
					    },function(){
					        jcrop_api = this;
					    });
					};
				};
			})([img1,img2]);
			reader.readAsDataURL(file);
	}
	// updateCoords : updates hidden input values after every crop selection
function updateCoords(c) {
	$('#x').val(c.x);
	$('#y').val(c.y);
	$('#w').val(c.w);
	$('#h').val(c.h);
}

function clearFile()
{
	var preview1 = document.getElementById('img1');
	var preview2 = document.getElementById('img2');
	preview1.innerHTML = preview2.innerHTML = '';
	var name1 = document.getElementById('name_img1');
	var name2 = document.getElementById('name_img2');
	name1.innerHTML = name2.innerHTML = '';

}
function setSize(item)
{
	TARGET_H = TARGET_W = +item.value;
	$('#target_w').val(item.value);
	$('#target_h').val(item.value);
}
function closeUpload()
{
	var id = '#popup_upload';
	$(id).hide();
}
function openUpload()
{
	var id = '#popup_upload';
	$(id).show();
}