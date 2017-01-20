/**
 * Created by i327364 on 19/01/2017.
 */
$('#form-team-create').on('submit', function(e) {
	e.preventDefault();
	var teamMembers = $('#memberListCreateForm').find('li').toArray();
	var Jmems = [];
	teamMembers.forEach(function(item) {
		Jmems.push($(item).text());
	});
	var formData = $(this).serializeObject();
	Jmems.push(formData.admin_email);
	formData.tags = {};
	formData.members = Jmems;
	formData.openDate = Date();
	if (formData.idea === "") {
		formData.idea = "Not decided yet"
	}
	$.ajax({
		type: "POST",
		cache: false,
		contentType: "application/json",
		url: $(this).attr('action'),
		data: JSON.stringify(formData),
		success: function(data) {
			var registerSuccessModal = $('#registerSuccessModal');
			registerSuccessModal.on('hidden.bs.modal', function(e) {
				window.location.replace("/team-up");
			});
			registerSuccessModal.modal('show');
		},
		error: function(data) {
			var registerFailModal = $('#registerFailModal'),
				errVal = registerFailModal.find('#modalFailContent');
			registerFailModal.modal('show');
			if (data.responseJSON.status !== undefined) {
				errVal.text(data.responseJSON.status)
			} else {
				errVal.text("We have a problem. Please try again or contact administrator ASAP");
			}
		}
	});
});

$('#addMemberCollapse').on('shown.bs.collapse', function() {
	$(this).siblings('#toggleAddMemberCollapse').text("Cancel and remove members");
	var membersList = $('#memberListCreateForm'),
		inputValue = $('#searchForTeamMembersCreateFormInput');
	membersList.empty();
	$(this).attr('disabled', false);
	inputValue.attr('placeholder', 'Search for registered user by email');
	inputValue.removeClass('form-control-warning');
	inputValue.attr('readonly', false);
});

$('#addMemberCollapse').on('hidden.bs.collapse', function() {
	$(this).siblings('#toggleAddMemberCollapse').text("Add Team Members");
});

$("#searchForTeamMembersCreateFormInput").autocomplete({
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
	minLength: 2,
	focus: function(event, ui) {
		this.value = ui.item.value;
		event.preventDefault();
	},
	select: function(event, ui) {
		this.value = ui.item.value;
		$(this).next("input").val(ui.item.value);
		$(this).data('user', ui.item);
		event.preventDefault();
	},
	change: function(event, ui) {
		if (ui.item == null) {
			$("#searchForTeamMembersCreateFormInput").val('');
			$("#searchForTeamMembersCreateFormInput").focus();
		}
	}
});
var isUserAlreadyOnList = function isUserAlreadyOnList(userID) {
	var membersList = $('#memberListCreateForm').find('li').toArray();
	for (var i = 0; i < membersList.length; i++) {
		if ($(membersList[i]).data('user').id === userID) {
			return true;
		}
	}
	return false;
};

$('#addMemberToListBtnCreateForm').click(function(e) {
	e.preventDefault();
	var inputValue = $('#searchForTeamMembersCreateFormInput'),
		userData = inputValue.data('user'),
		maxUsers = inputValue.data('maxusers'),
		membersList = $('#memberListCreateForm'),
		membersListItems;

	if (!isUserAlreadyOnList(userData.id)) {
		var listItem = $('<li />').data('user', userData).text(inputValue.data('user').label).addClass('list-group-item');
		membersList.append(listItem);
		membersListItems = membersList.find('li').length;
		if (membersListItems === maxUsers - 1) {
			$(this).attr('disabled', true);
			inputValue.attr('placeholder', 'Max users in a group is ' + maxUsers + ' (including you)');
			inputValue.addClass('form-control-warning');
			inputValue.attr('readonly', true);
		}

	}
	inputValue.removeData('user');
	inputValue.val('');
	inputValue.focus();
});