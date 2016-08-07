(function ($) {
	'use strict';
	$('.color-picker').colorpicker();
	$('.color-picker2').colorpicker({
		horizontal: true
	});
	$('.time-picker').timepicker();
	$('.clockpicker').clockpicker({
		donetext: 'Done'
	});
	$('#tags').tagsInput({
		width: 'auto'
	});
	$('.chosen').chosen({
		width: '100%'
	});
	$('.chosen-select').chosen({
		disable_search_threshold: 10,
		width: '100%'
	});
	$('.checkbo').checkBo();
	$('.telephone-input').intlTelInput();
	$('.spinner1').TouchSpin({
		initval: 0,
		buttondown_class: 'btn btn-primary',
		buttonup_class: 'btn btn-primary'
	});
	$('.spinner2').TouchSpin({
		initval: 0,
		buttondown_class: 'btn btn-default',
		buttonup_class: 'btn btn-default'
	});
	$('.drp').daterangepicker({
		format: 'YYYY-MM-DD',
		startDate: '2015-01-01',
		endDate: '2015-12-31'
	});
	$('#pre-selected-options').multiSelect();
	$('#optgroup').multiSelect({
		selectableOptgroup: true
	});
	$('#maxlength').maxlength({
		threshold: 300
	});
	$('#maxlengthConf').maxlength({
		alwaysShow: true,
		threshold: 10,
		warningClass: 'label label-info',
		limitReachedClass: 'label label-warning',
		placement: 'top',
		preText: 'used ',
		separator: ' of ',
		postText: ' chars.'
	});
	$('.to-labelauty').labelauty({
		minimum_width: '155px',
		class: 'labelauty btn-block'
	});
	$('.to-labelauty-icon').labelauty({
		label: false
	});
	var statesList = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
	var states = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.whitespace,
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		local: statesList
	});
	var bestPictures = new Bloodhound({
		datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
		queryTokenizer: Bloodhound.tokenizers.whitespace,
		prefetch: '../data/post_1960.json',
		remote: {
			url: '../data/films/queries/%QUERY.json',
			wildcard: '%QUERY'
		}
	});
	$('.typeahead-states').typeahead({
		hint: true,
		highlight: true,
		minLength: 1
	}, {
		name: 'states',
		source: states
	});
	$('.typeahead-oscars').typeahead(null, {
		name: 'best-pictures',
		display: 'value',
		source: bestPictures
	});
	$('.select2').select2();
	$('#input-tags').selectize({
		delimiter: ',',
		persist: false,
		create: function (input) {
			return {
				value: input,
				text: input
			};
		}
	});
	$('#select-beast').selectize({
		create: true,
		sortField: 'text'
	});
})(jQuery);