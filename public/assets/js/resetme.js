/**
 * Created by i327364 on 19/01/2017.
 */
$(document).ready(function () {
	var registerFailModal = $('#registerFailModal');
	$('#resetPass').on('click', function () {
		$('#resetPass').prop('disabled', true)
		if ($('#username').val() === "") {
			registerFailModal.find('#modalFailContent').text("Please insert an email address");
			registerFailModal.modal('show');
			$('#resetPass').prop('disabled', false)
		}
		else if ($('#password').val() === "") {
			registerFailModal.find('#modalFailContent').text("Please insert a new password");
			registerFailModal.modal('show');
			$('#resetPass').prop('disabled', false)
		} else if ($('#password').val() !== $('#password_ver').val()) {
			registerFailModal.find('#modalFailContent').text("Passwords do not match");
			registerFailModal.modal('show');
			$('#resetPass').prop('disabled', false)
		} else {
			$.ajax({
				data: {
					"password": $('#password').val(),
					"email": $('#username').val(),
					"resetPass": $('#reserPass').val()
				},
				type: "PUT",
				url: "/resetme",
				success: function (data) {
					if (data === "ok") {
						var successModal = $('#registerSuccessModal');
						successModal.modal('show');
						successModal.on('hidden.bs.modal', function(){
							window.location.replace("/login");
						});
						$('#resetPass').prop('disabled', false);
						$('#lastResetText').html("password was reset for " + $('#username').val() + ". new password is:" + $('#password').val());
						$('#lastReset').css('display', 'block');
					} else {
						var eText = "";
						if (data === undefined || data !== "error") {
							eText = "Something is wrong here. Are you sure it's your email? Please try again or contact administrator for resetting your password";
						} else {
							eText = "We have an internal error. Please try again or contact administrator for resetting your password";
						}
						var registerFailModal = $('#registerFailModal');
						registerFailModal.find('#modalFailContent').text(eText);
						registerFailModal.modal('show');
						$('#resetPass').prop('disabled', false)
					}
				},
				error: function (err) {
					var registerFailModal = $('#registerFailModal');
					registerFailModal.find('#modalFailContent').text("Please contact administrator for resetting your password");
					registerFailModal.modal('show');
					$('#resetPass').prop('disabled', false)
				}
			})
		}
	})
})