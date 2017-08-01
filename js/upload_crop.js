/**
*class Crop_Form инициализируется JQuery объектом,
*преставляющем widget
*/
function Crop_Form(form)
{
	var TARGET_W = 200;
	var TARGET_H = 200;
	var source_w = 200;
	var source_h = 200;	
	this.jcrop_api = null;
	var self = this;
	var sizeImage = 400;

	this.loadFile = function (files)
	{
		var file = files[0];
		var name = file.name;
		var img1 = document.createElement('img');
		var img2 = document.createElement('img');
		img1.classList.add('obj');
		img1.file = file;
		img2.classList.add('obj');
		img2.file = file;
		img1.width = img2.width = sizeImage;
		
		var preview1 = document.getElementById('img1');
		var preview2 = document.getElementById('img2');
		var name_img1 = document.getElementById('name_img1');
		var name_img2 = document.getElementById('name_img2');
		var base_name = name.split('.');

		name_img1.innerHTML = base_name[0] + '_thumb.' + base_name[1];
		name_img2.innerHTML = base_name[0] + '.' + base_name[1];
		preview1.appendChild(img1);
		preview2.appendChild(img2);

		var reader = new FileReader();

		reader.onload = ( function(imgs){
			return function(e){

				imgs.forEach(function(img,i){
					img.src=e.target.result;
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
							self.jcrop_api.destroy();
					} 
					catch (e) 
					{
							// object not defined
					}
					$('#img1>img').Jcrop({
				      trueSize:[source_w,source_h],
				      aspectRatio:1,
				      setSelect: [ 100, 100, TARGET_W, TARGET_H ],
				      onSelect: self.updateCoords,
				      onChange: self.updateCoords
				    },function(){
				        self.jcrop_api = this;
				    });
				};
			};
		})([img1,img2]);
		reader.readAsDataURL(file);
	}
	//end loadFile

	// updateCoords : updates hidden input values after every crop selection
	this.updateCoords = function(c)
	{
		$('#x').val(c.x);
		$('#y').val(c.y);
		$('#w').val(c.w);
		$('#h').val(c.h);
	}

	this.clear = function()
	{
		var preview1 = document.getElementById('img1');
		var preview2 = document.getElementById('img2');
		preview1.innerHTML = preview2.innerHTML = '';
		var name1 = document.getElementById('name_img1');
		var name2 = document.getElementById('name_img2');
		name1.innerHTML = name2.innerHTML = '';	
	}

	this.setSize = function()
	{
		TARGET_H = TARGET_W = +item.value;
		$('#target_w').val(item.value);
		$('#target_h').val(item.value);	
	}

	this.close = function()
	{
		var id = '#popup_upload';
		$(id).hide();	
	}

	this.open = function()
	{
		$('#reset').click();
		this.clear();
		var id = '#popup_upload';
		$(id).show();	
	}
}
//end class Crop_Form

var crop_form = new Crop_Form($('#popup_upload'));