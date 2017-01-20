/**
 * Created by i327364 on 19/01/2017.
 */
var initResetPasswordModal = function initResetPasswordModal() {
	$('#forgotPasswordModal').modal('show');
};

$('#forgotPasswordResetBtn').click(function(e) {
	e.preventDefault();
	var userEmail = $('#forgotEmailInput').val();
	if (!validateEmail(userEmail)) {
		$('#resetErrorMessageText').text('Please enter valid email address');
		$('#resetErrorMessage').show();
		$('#resetSucessMessage').hide();
	} else {
		$(this).attr('disabled', true);
		$.ajax({
			url: '/forgot',
			method: 'POST',
			data: {email: userEmail},
			success: function(data) {
				switch (data) {
					case "ok":
						$('#resetSucessMessage').show();
						$('#resetErrorMessage').hide();
						break;
					case 'NOUSER':
						$('#resetErrorMessageText').text('A user with this email does not exists.');
						$('#resetErrorMessage').show();
						$('#resetSucessMessage').hide();
						break;
					default:
						$('#resetErrorMessageText').text('We have a problem. Please try again or contact administrator ASAP');
						$('#resetErrorMessage').show();
						$('#resetSucessMessage').hide();
						break;
				}
				$('#forgotPasswordResetBtn').prop('disabled', false);
			},
			error: function(data) {
				if (data.status == 409) {
					$('#resetErrorMessageText').text('A user with this email already exists.\nThere is no need to register twice.\nFor help, contact Administrator');
				}
				else {
					$('#resetErrorMessageText').text('We have a problem. Please try again or contact administrator ASAP');
				}
				$('#resetErrorMessage').show();
				$('#resetSucessMessage').hide();
				$('#forgotPasswordResetBtn').prop('disabled', false);
			}
		});
	}

});
var validateEmail = function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

$('#forgotPasswordModal').on('hidden.bs.modal', function() {
	$('#resetErrorMessageText').text('');
	$('#resetErrorMessageText').hide();
	$('#resetSucessMessage').hide();
	$('#forgotEmailInput').val('');
});