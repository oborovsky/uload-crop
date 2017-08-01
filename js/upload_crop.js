/**
*class Crop_Form инициализируется options, содержащий JQuery объект elem,
*преставляющий сам widget
*/
function Crop_Form(options)
{
	var elem = options.elem;
	var open_btn = options.open_btn;

	var TARGET_W = options.target_w || 200;
	var TARGET_H = options.target_h || 200;
	var source_w = options.source_w || 200;
	var source_h = options.source_h || 200;	
	var sizeImage = options.sizeImage || 400;

	this.jcrop_api = null;
	var self = this;

	elem.on('change','#upload_btn',onLoadFile);
	elem.on('change','[name=size]', onSetSize);
	elem.on('click','#reset_btn', onReset);
	elem.on('click','#save_btn', onSave);
	elem.on('click','#close_btn',onClose);
	elem.on('input','#newName',onChangeName)

	open_btn.on('click', onOpen);

	function onLoadFile(event)
	{
		loadFile(event.target.files);
	}

	function onSetSize(event)
	{
		setSize(+event.target.value);
	}

	function onReset(event)
	{
		clear();
	}
	function onSave(event)
	{
		close();
	}
	function onClose(event)
	{
		close();
	}

	function onOpen()
	{
		open();
	}

	function onChangeName(event)
	{
		setNewName(event.target.value);
	}

	//==========================================
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
		img1.width = img2.width = sizeImage;
		
		var base_name = name.split('.');
		var newName = elem.find('#newName').val();
		if (newName.length > 0 ) 
		{
			base_name[0] = newName;
		}

		elem.find('#name_img1').html(base_name[0] + '_thumb.' + base_name[1]);
		elem.find('#name_img2').html(base_name[0] + '.' + base_name[1]);
		elem.find('#img1').append($(img1));
		elem.find('#img2').append($(img2));

		var reader = new FileReader();

		reader.onload = onLoadReader([img1,img2]);
		reader.readAsDataURL(file);

		function onLoadReader(imgs)
		{
			return function(e) {
				imgs.forEach(function(img,i) {
					img.src=e.target.result;
				});

				img = new Image();
				img.src = e.target.result;
				
				img.onload = onLoadImage;

				function onLoadImage()
				{
					source_w = this.width;
					source_h = this.height;
					elem.find('#source_h').val(source_h);
					elem.find('#source_w').val(source_w);
					elem.find('#sizeFile').val('исходный размер: ' + source_w + 'x' + source_h);
					elem.find('#sizeSelectRect').html( TARGET_W + 'x' + TARGET_W);

					try 
					{
						self.jcrop_api.destroy();
					} 
					catch (e) 
					{
							// object not defined
					}
					$('#img1 > img').Jcrop({
				      trueSize:[source_w,source_h],
				      aspectRatio:1,
				      setSelect: [ 100, 100, TARGET_W, TARGET_H ],
				      onSelect: updateCoords,
				      onChange: updateCoords
				    },function(){
				        self.jcrop_api = this;
				    });
				};
			};
		}
	}
	//end loadFile
	function setNewName(newName)
	{
		elem.find('#name_img1').html(newName + '_thumb.jpg');
		elem.find('#name_img2').html(newName + '.jpg');
	}
	// updateCoords : updates hidden input values after every crop selection
	function updateCoords(c)
	{
		elem.find('#x').val(c.x);
		elem.find('#y').val(c.y);
		elem.find('#w').val(c.w);
		elem.find('#h').val(c.h);
		elem.find('#sizeSelectRect').html(Math.floor(c.w) + 'x' + Math.floor(c.w));
	}

	function clear()
	{
		elem.find('#img1').empty();
		elem.find('#img2').empty();

		elem.find('#name_img1').empty();
		elem.find('#name_img2').empty();
		elem.find('#sizeSelectRect').empty();

	}

	function setSize(value)
	{
		TARGET_H = TARGET_W = value;
		elem.find('#target_w').val(value);
		elem.find('#target_h').val(value);	
	}

	function close()
	{
		elem.hide();	
	}

	function open()
	{
		elem.find('#reset_btn').click();
		elem.show();	
	}
}
//end class Crop_Form

var crop_form = new Crop_Form({ elem:$('#popup_upload'),open_btn:$('#open_btn')});