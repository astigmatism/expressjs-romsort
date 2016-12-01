

var BoxArt = function() {

	var self = this;

	$(document).ready(function() {
		
		$('#lowrankingtoggle').click(function() {
			if ($(this).is(':checked')) {
				$('li.nobox').hide();
			} else {
				$('li.nobox').show();
			}
		});

		$('#inwebfolder').click(function() {
			if ($(this).is(':checked')) {
				$('li.noweb').hide();
			} else {
				$('li.noweb').show();
			}
		});

		$.each(data, function(title, details) {

			var topranking = 0;
			$.each(details.files, function(file, rank) {
				rank = parseInt(rank, 10);
				topranking = rank > topranking ? rank : topranking;
			});

			if (topranking <= 250) {
				return;
			}

			var inwebfolder = ($.inArray(title, webtitles) > -1 ? true : false);

			var li = $('<li class="' + (topranking > 250 ? 'box' : 'nobox' ) + ' ' + (inwebfolder ? 'web' : 'noweb') + '"><a href="javascript:opengoogle(\'' + encodeURIComponent(title).replace('\'','\\\'').replace('&','\&') + '\')" target="_blank">' + title + '</a><br/></li>');

			var image = new Image();
			image.src = '/boxart/' + system + '/' + title + '/original.jpg'; //always show original since we can be certain it is jpg
			image.width = 120;
			li.append(image);

			li.append($('<br/>'));
			li.append($('<div>in web folder: ' + inwebfolder + '</div>'));
			li.append($('<div>Top Ranking File</div>'));
			li.append($('<div>' + details.best + '</div>'));
			li.append($('<div>score: ' + topranking + '</div>'));
			li.append($('<br/>'));

			var del = $('<a href="javascript:void(0);">delete</a>');
			del.click(function(e) {
				
				$.ajax({
					url: '/boxart',
					type: 'DELETE',
					data: {
						system: system,
						title: title
					}
				}).done(function(response) {
					li.remove();
				});
			});

			li.append(del);


			$(li).dropzone({ 
				url: '/boxart',
				sending: function(file, xhr, formData) {
	    			formData.append('title', title);
	    			formData.append('system', system);
				}
			})

			$('ul').append(li);

		});	

	});
};

var boxart = new BoxArt();

var opengoogle = function(term) {
	var text = $('#search').val();
	window.open('https://www.google.com/search?q=' + escape(term) + ' ' + escape(text) + '&source=lnms&tbm=isch&sa=X&ved=0ahUKEwi89tOMoezKAhVT22MKHWQDBxYQ_AUIBygB&biw=2156&bih=1322', '_blank');
}