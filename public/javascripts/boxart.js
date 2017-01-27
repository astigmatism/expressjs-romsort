

var BoxArt = function() {

	var self = this;

	$(document).ready(function() {

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
			$.each(details.files, function(file, rank) {
				rank = parseInt(rank, 10);
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
			li.append('<input type="button" style="width:50px" value="T" onclick="opengoogle(\'' + titleforbutton + '\', 1)"></input>');
			li.append('<input type="button" style="width:50px" value="T&B" onclick="opengoogle(\'' + titleforbutton + '\', 4)"></input>');


			li.append('<input type="button" style="width:50px" value="1" onclick="opengoogle(\'' + titleforbutton + '\', 2)"></input>');
			li.append('<input type="button" style="width:50px" value="1&B" onclick="opengoogle(\'' + titleforbutton + '\', 5)"></input>');

			
			li.append('<input type="button" style="width:50px" value="2" onclick="opengoogle(\'' + titleforbutton + '\', 3)"></input>');
			li.append('<input type="button" style="width:50px" value="2&B" onclick="opengoogle(\'' + titleforbutton + '\', 6)"></input>');
			li.append('</div>');

			var imagewrapper = $('<div></div>');
			li.append(imagewrapper);

			var size = $('<div style="padding-top: 3px"></div>');
			li.append(size);

			loadImage(imagewrapper, size, system, title);

			li.append('<div>Score: ' + topranking + '</div>');
			li.append('<div>Top File: ' + details.best + '</div>');

			

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

var opengoogle = function(term, type) {

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

	console.log(term);

	term = escape(term);
	window.open('https://www.google.com/search?q=' + term + '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwi89tOMoezKAhVT22MKHWQDBxYQ_AUIBygB&biw=2156&bih=1322&tbm=isch&tbs=isz:lt,islt:qsvga', '_blank');
};
