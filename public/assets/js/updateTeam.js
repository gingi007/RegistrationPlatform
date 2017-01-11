/**
 * Created by i327364 on 07/01/2017.
 */
$(function() {
	$.fn.serializeObject = function() {

		var self = this,
			json = {},
			push_counters = {},
			patterns = {
				"validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
				"key": /[a-zA-Z0-9_]+|(?=\[\])/g,
				"push": /^$/,
				"fixed": /^\d+$/,
				"named": /^[a-zA-Z0-9_]+$/
			};


		this.build = function(base, key, value) {
			base[key] = value;
			return base;
		};

		this.push_counter = function(key) {
			if (push_counters[key] === undefined) {
				push_counters[key] = 0;
			}
			return push_counters[key]++;
		};

		$.each($(this).serializeArray(), function() {

			// skip invalid keys
			if (!patterns.validate.test(this.name)) {
				return;
			}

			var k,
				keys = this.name.match(patterns.key),
				merge = this.value,
				reverse_key = this.name;

			while ((k = keys.pop()) !== undefined) {

				// adjust reverse_key
				reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

				// push
				if (k.match(patterns.push)) {
					merge = self.build([], self.push_counter(reverse_key), merge);
				}

				// fixed
				else if (k.match(patterns.fixed)) {
					merge = self.build([], k, merge);
				}

				// named
				else if (k.match(patterns.named)) {
					merge = self.build({}, k, merge);
				}
			}

			json = $.extend(true, json, merge);
		});

		return json;
	};
	var addMembers = function addMember() {
		var membersList = $('.memberResults'),
			memberListArr = membersList.find('li').toArray(),
			currentTeamMembersList = $('#currentTeamMembers'),
			currentTeamMembersBtn = currentTeamMembersList.find('#searchTeamMembers');
		currentTeamMembersBtn.remove();
		memberListArr.forEach(function(member) {
			var memberItem = $('<li />').addClass('list-group-item').data('user', $(member).data('user'))
				.append($('<span />').text($(member).data('user').label))
				.append($('<button />').addClass('float-xs-right btn btn-danger btn-sm').click(function(e) {
					e.preventDefault();
					$(this).closest('li').remove();
				})
					.append($('<i />').addClass('fa fa-times')));
			currentTeamMembersList.append(memberItem);
		});
		currentTeamMembersBtn.click(function() {
			dialog.dialog('open');
		});
		currentTeamMembersList.append(currentTeamMembersBtn);
		$('.memberResults').empty();
		dialog.dialog('close');
	};
	var isUserAlreadyOnList = function isUserAlreadyOnList(userID) {
		var membersList = $('.memberResults').find('li').toArray();
		for (var i = 0; i < membersList.length; i++) {
			if ($(membersList[i]).data('user').id === userID) {
				return true;
			}
		}
		return false;
	};
	var createTeamMembersArray = function createTeamMembersArray(adminEmail) {
		var membersObject = $('#teamMembers').find('li').find('span');
		var memArr = [];
		if (membersObject) {
			membersObject.toArray().forEach(function(member) {
				memArr.push($(member).text());
			});
		}
		memArr.push(adminEmail);
		return memArr;
	};
	var updateTeam = function updateTeam(e) {
		e.preventDefault();
		$('#updateGroupBtn').attr('disabled', true);
		var formData = $('#updateTeamForm').serializeObject();
		formData.members = createTeamMembersArray(formData.admin_email);
		formData.isClosed === "Yes" ? formData.isClosed = true : formData.isClosed = false;
		formData.openDate = Date();
		$.ajax({
			method: 'PUT',
			type: 'application/json',
			url: '/teams/' + formData.team_id,
			data: formData,
			success: function(){
				debugger;
			},
			error: function(){
				debugger;
			}
		});


	};
	var dialog = $('#searchDialogForm').dialog({
		autoOpen: false,
		height: 500,
		width: 500,
		modal: true,
		buttons: {
			'Add members': addMembers,
			'Cancel': function() {
				dialog.dialog('close');
			}
		},
		close: function() {
			console.log('closed');
		}
	});
	$("#searchTeamMembers").on('click', function() {
		dialog.dialog('open');
	});
	$("#emailInput").autocomplete({
		source: function(request, response) {
			$.ajax({
				url: "/search_member",
				type: "GET",
				data: request,
				success: function(data) {
					response($.map(data, function(el) {
						return {
							id: el._id,
							value: el.email
						};
					}));
				}
			});
		},
		minLength: 3,
		// set an onFocus event to show the result on input field when result is focused
		focus: function(event, ui) {
			this.value = ui.item.value;
			// Prevent other event from not being execute
			event.preventDefault();
		},
		select: function(event, ui) {
			// Prevent value from being put in the input:
			this.value = ui.item.value;
			// Set the id to the next input hidden field
			$(this).next("input").val(ui.item.value);
			$(this).data('user', ui.item);
			// Prevent other event from not being execute
			event.preventDefault();
			// optionnal: submit the form after field has been filled up
		}
	});
	$('#addMemberToListBtn').on('click', function(oEvent) {
		oEvent.preventDefault();
		var inputValue = $('#searchDialogForm').find('input'),
			userData = inputValue.data('user'),
			membersList = $('.memberResults').find('ul');
		if (!isUserAlreadyOnList(userData.id)) {
			var listItem = $('<li />').data('user', userData).text(inputValue.data('user').label).addClass('list-group-item');
			membersList.append(listItem);
		}
		inputValue.removeData('user');
		inputValue.val('');
	});
	$('#updateGroupBtn').click(updateTeam);


});


