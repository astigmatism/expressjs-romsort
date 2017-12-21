

var BoxArt = function() {

	var self = this;

	$(document).ready(function() {

		if (boxartdata) {

			$('#hideus').click(function() {
				if ($(this).is(':checked')) {
					$('li.en').hide();
				} else {
					$('li.en').show();
				}
			});

			$('#hideforeign').click(function() {
				if ($(this).is(':checked')) {
					$('li.foreign').hide();
				} else {
					$('li.foreign').show();
				}
			});

			$.each(data, function(title, details) {

				var topranking = 0;
				$.each(details.f, function(file, obj) {
					rank = parseInt(obj.rank, 10);
					topranking = rank > topranking ? rank : topranking;
				});

				//250 and below is the score at which we are not concerned about getting box art (see findbestrom.js for details) 
				if (topranking <= 250) {
					return;
				}

				var titleforbutton = title.replace('\'','\\\'');

				//red = foreign, green = english title
				var li = $('<li class="' + ((topranking >= 400) ? 'en' : 'foreign') + '" style="background-color: ' + ((topranking >= 400) ? '#EAFAF1' : '#FDEDEC') + '"><div class="title" style="padding-top: 5px">' + title + '</div></li>')
				
				li.append('<div class="buttons">');
				li.append('<input type="button" style="width:50px" value="T" onclick="opengoogle(\'' + titleforbutton + '\', 1, 1)"></input>');
				li.append('<input type="button" style="width:50px" value="T&B" onclick="opengoogle(\'' + titleforbutton + '\', 1, 4)"></input>');
				li.append('<input type="button" style="width:50px" value="1" onclick="opengoogle(\'' + titleforbutton + '\', 1, 2)"></input>');
				li.append('<input type="button" style="width:50px" value="1&B" onclick="opengoogle(\'' + titleforbutton + '\', 1, 5)"></input>');
				li.append('<input type="button" style="width:50px" value="2" onclick="opengoogle(\'' + titleforbutton + '\', 1, 3)"></input>');
				li.append('<input type="button" style="width:50px" value="2&B" onclick="opengoogle(\'' + titleforbutton + '\', 1, 6)"></input>');
				li.append('<br/>');
				li.append('<input type="button" style="width:50px" value="T" onclick="opengoogle(\'' + titleforbutton + '\', 0, 1)"></input>');
				li.append('<input type="button" style="width:50px" value="T&B" onclick="opengoogle(\'' + titleforbutton + '\', 0, 4)"></input>');
				li.append('<input type="button" style="width:50px" value="1" onclick="opengoogle(\'' + titleforbutton + '\', 0, 2)"></input>');
				li.append('<input type="button" style="width:50px" value="1&B" onclick="opengoogle(\'' + titleforbutton + '\', 0, 5)"></input>');
				li.append('<input type="button" style="width:50px" value="2" onclick="opengoogle(\'' + titleforbutton + '\', 0, 3)"></input>');
				li.append('<input type="button" style="width:50px" value="2&B" onclick="opengoogle(\'' + titleforbutton + '\', 0, 6)"></input>');
				li.append('</div>');

				var imagewrapper = $('<div></div>');
				li.append(imagewrapper);

				var size = $('<div style="padding-top: 3px"></div>');
				li.append(size);

				var makeButton = function(label, b, s, h) {

					return $('<input type="button" style="width:50px" value="' + label + '"></input>').click(function() {
						modulate(imagewrapper, size, system, title, b, s, h);
					});
				}

				li.append('<div class="buttons">');
				li.append(makeButton('-10%', 90, 100, 100));
				li.append(makeButton('-5%', 95, 100, 100));
				li.append(makeButton('-1%', 99, 100, 100));
				li.append(' Brightness ');
				li.append(makeButton('1%', 101, 100, 100));
				li.append(makeButton('5%', 105, 100, 100));
				li.append(makeButton('10%', 110, 100, 100));
				li.append('<br/>');
				li.append(makeButton('-10%', 100, 90, 100));
				li.append(makeButton('-5%', 100, 95, 100));
				li.append(makeButton('-1%', 100, 99, 100));
				li.append(' Saturation ');
				li.append(makeButton('1%', 100, 101, 100));
				li.append(makeButton('5%', 100, 105, 100));
				li.append(makeButton('10%', 100, 110, 100));
				li.append('<br/>');
				li.append(makeButton('-10%', 100, 100, 90));
				li.append(makeButton('-5%', 100, 100, 95));
				li.append(makeButton('-1%', 100, 100, 99));
				li.append(' Hue ');
				li.append(makeButton('1%', 100, 100, 101));
				li.append(makeButton('5%', 100, 100, 105));
				li.append(makeButton('10%', 100, 100, 110));
				li.append('</div>');

				loadImage(imagewrapper, size, system, title);

				li.append('<div>Score: ' + topranking + '</div>');
				li.append('<div>Top File: ' + details.b + '</div>');

				var $checkbox = $('<input type="checkbox" />');
				$checkbox.click(function(e) {
					
					var self = this;
					$.ajax({
						url: '/boxart/meta',
						type: 'POST',
						data: {
							system: system,
							title: title,
							topsuggestion: self.checked
						},
						complete: function(xhr, textStatus) {
							if (xhr.status != 200) {
								alert('There was an error updating the box data file. Have you generated it yet?')
							}
						}
					});
				});	
				var $checkwrapper = $('<div>Top Suggestion: </div>');
				$checkwrapper.append($checkbox);

				if (title in boxartdata) {
					if (boxartdata[title].hasOwnProperty('t')) {
						$checkbox.prop('checked', true);
					}
				}

				li.append($checkwrapper);
				

				var del = $('<input type="button" value="Delete"></input>');
				del.click(function(e) {
					
					imagewrapper.empty();
					$.ajax({
						url: '/boxart',
						type: 'DELETE',
						data: {
							system: system,
							title: title
						},
						complete: function(xhr, textStatus) {
							if (xhr.status != 200) {
								alert('There was an error deleting the art. Check the server.')
							}
						}
					});
				});
				li.append(del);


				$(li).dropzone({ 
					url: '/boxart',
					sending: function(file, xhr, formData) {
						
						$('.dz-preview').hide();

						formData.append('title', title);
						formData.append('system', system);
					},
					init: function () {
						this.on('error', function (file) {
							alert('There was an error saving the image. Please check the server!');
						});
						this.on('success', function() {
							
							$('.dz-preview').hide();
							
							loadImage(imagewrapper, size, system, title);

						});
					}
				});

				$('ul').append(li);
			});	
		} else {
			console.error('generate boxart data before and after please');
		}
	});
};

var modulate = function(wrapper, size, system, title, b, s, h) {

	$.ajax({
		url: '/boxart',
		type: 'PATCH',
		data: {
			system: system,
			title: title,
			b: b,
			s: s,
			h: h
		},
		complete: function(xhr, textStatus) {
	        if (xhr.status != 200) {
	        	alert('There was an error deleting the art. Check the server.')
	        }

	        loadImage(wrapper, size, system, title);
	    }
	});

};

var loadImage = function(wrapper, size, system, title) {

	$(wrapper).empty();
	var image = new Image();
	image.src = '/boxart/' + system + '/' + title + '/original.jpg?' + new Date(); //always show original since we can be certain it is jpg
	image.onerror = function() { $(this).remove(); };
	//image.width = 400;
	image.onload = function() {
		size.text(image.width + ' x ' + image.height);
		image.width = 400;
		wrapper.append(image);
	};
};

var boxart = new BoxArt();

var opengoogle = function(term, size, type) {

	switch (type) {
		case 2:
			term += ' ' + $('#search1').val();
			break;
		case 3:
			term += ' ' + $('#search2').val();
			break;
		case 4:
			term += ' box';
			break;
		case 5:
			term += ' ' + $('#search1').val() + ' box';
			break;
		case 6:
			term += ' ' + $('#search2').val() + ' box';
			break;
	}

	switch (size)
	{
		case 1:
			size = "vga";
			break;
		default:
			size = "qsvga"
	}

	console.log(term);

	term = escape(term);
	window.open('https://www.google.com/search?q=' + term + '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwi89tOMoezKAhVT22MKHWQDBxYQ_AUIBygB&biw=2156&bih=1322&tbm=isch&tbs=isz:lt,islt:' + size, '_blank');
};
