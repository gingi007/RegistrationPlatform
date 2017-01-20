/**
 * Created by i327364 on 19/01/2017.
 */
$('#myTeamLeaveBtn').click(function(e){
	e.preventDefault();
	$.ajax({
		url: '/user/leaveTeam',
		method: 'DELETE',
		success: function(data) {
			var registerSuccessModal = $('#registerSuccessModal');
			registerSuccessModal.on('hidden.bs.modal', function(e) {
				window.location.replace("/mingle");
			});
			registerSuccessModal.modal('show');
		},
		error: function(data) {
			var registerFailModal = $('#registerFailModal');
			registerFailModal.on('hidden.bs.modal', function(e) {
				window.location.replace("/team-up");
			});
			registerFailModal.modal('show');
		}

	});
});