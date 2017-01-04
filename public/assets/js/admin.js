/**
 * Created by i327364 on 04/01/2017.
 */

$(".role").change(function() {
	var userId = $(this).data('uid');
	$.ajax({
		url: '/users/superadmin/' + userId,
		method: 'put',
		data: {role: $(this).find('option:selected').text().trim().toLowerCase()},
		success: function(data) {
			if (data.status === 'ok') {
				alert("user changed");
			} else {
				alert("cant update user");
			}
		},
		error: function(jqXHR) {
			console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
		}
	});
});