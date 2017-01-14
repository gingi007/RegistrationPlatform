/**
 * Created by i327364 on 11/01/2017.
 */
$(function() {
	var teamUserApplication = function teamUserApplication() {
		var teamID = $(this).closest('div.card').data('id');
		$.ajax({
			method: 'POST',
			url: '/teams/' + teamID + '/apply',
			success: function() {
				location.reload();
			},
			error: function() {
				toastr.error('Error, please contact administrator ASAP', 'Error');
			}
		});
	};
	$('.applyTeamBtn').click(teamUserApplication);
});