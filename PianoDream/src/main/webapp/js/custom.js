$(document).ready(function() {
	var html = $('iframe').contents().find("html");
	var body = $(html).find('body');
	$(body).css('color', "#555555");
	$(body).css('font-weight', "300");
	$(body).css('font-size', "14px");
	$(body).css('font-family', "Arial");
	$(body).css('padding', "5px 7px");

	$('#tags').tagsInput({
		'width' : '100%',
		'interactive' : true,
		'defaultText' : 'Tags',
		'placeholderColor' : 'gray'
	});
});

PrimeFaces.locales['vi'] = {
	closeText : 'Táº¯t',
	prevText : 'ThÃ¡ng trÆ°á»›c',
	nextText : 'ThÃ¡ng sau',
	monthNames : [ 'ThÃ¡ng 1', 'ThÃ¡ng 2', 'ThÃ¡ng 3', 'ThÃ¡ng 4',
			'ThÃ¡ng 5', 'ThÃ¡ng 6', 'ThÃ¡ng 7', 'ThÃ¡ng 8',
			'ThÃ¡ng 9', 'ThÃ¡ng 10', 'ThÃ¡ng 11', 'ThÃ¡ng 12' ],
	monthNamesShort : [ 'ThÃ¡ng 1', 'ThÃ¡ng 2', 'ThÃ¡ng 3', 'ThÃ¡ng 4',
			'ThÃ¡ng 5', 'ThÃ¡ng 6', 'ThÃ¡ng 7', 'ThÃ¡ng 8',
			'ThÃ¡ng 9', 'ThÃ¡ng 10', 'ThÃ¡ng 11', 'ThÃ¡ng 12' ],
	dayNames : [ 'ChÃºa Nhá»±t', 'Thá»© Hai', 'Thá»© Ba',
			'Thá»© TÆ°', 'Thá»© NÄƒm', 'Thá»© SÃ¡u',
			'Thá»© Báº£y' ],
	dayNamesShort : [ 'CN', 'Hai', 'Ba', 'TÆ°', 'NÄƒm', 'SÃ¡u',
			'Báº£y' ],
	dayNamesMin : [ 'CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7' ],
	weekHeader : 'Tuáº§n',
	firstDay : 1,
	isRTL : false,
	showMonthAfterYear : false,
	yearSuffix : '',
	timeOnlyTitle : 'Chá»�n giá»�',
	timeText : 'Giá»�',
	hourText : 'Giá»�',
	minuteText : 'PhÃºt',
	secondText : 'GiÃ¢y',
	currentText : 'Giá»� hiá»‡n hÃ nh',
	ampm : false,
	month : 'ThÃ¡ng',
	week : 'Tuáº§n',
	day : 'NgÃ y',
	allDayText : 'Cáº£ ngÃ y'
};

function getVideoId(url) {
	if (url === null) {
		return "";
	}

	var vid;
	var results;

	results = url.match("[\\?&]v=([^&#]*)");

	vid = (results === null) ? url : results[1];
	return vid;
}

function getScreen(url, size) {

	size = (size === null) ? "big" : size;

	var vid = getVideoId(url);

	if (size == "small") {
		return "http://img.youtube.com/vi/" + vid + "/2.jpg";
	} else {
		return "http://img.youtube.com/vi/" + vid + "/0.jpg";
	}
}

function isPhoneKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		// Except space and -+() button
		if (charCode != 32 && charCode != 43 && charCode != 45
				&& charCode != 40 && charCode != 41)
			return false;

	return true;
}

function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 45
			&& charCode != 46)
		return false;

	return true;
}

function auto_currency(id) {
	var component = document.getElementById(id);
	var newValue = component.value.replace(/,/g, "");
	component.value = newValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
