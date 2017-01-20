/**
 * Created by i327364 on 18/01/2017.
 */
$(document).ready(function() {

	// On submit ajax to server
	$('#form-reg').on('submit', function(e) {
		e.preventDefault();
		$('#reg_but').prop('disabled', true);
		$('.reg-loader').css('display', 'inline-block');
		if ($('#form-gender').val() === "choose") {
			var registerFailModal = $('#registerFailModal');
			registerFailModal.find('#modalFailContent').text('You forgot to choose gender');
			$('#registerFailModal').modal('show');
			$('#reg_but').prop('disabled', false);
			//password check
		} else if ($('#form-pass-ver').val() !== $('#form-pass').val()) {
			var registerFailModal = $('#registerFailModal');
			registerFailModal.find('#modalFailContent').text('The passwords you inserted does not match, Please fix and try again');
			$('#registerFailModal').modal('show');
			$('#reg_but').prop('disabled', false);
		} else {
			var tagArr = $('#form-skills').tagsinput('items');
			var JTags = {};
			tagArr.forEach(function(tag, ind){
				JTags[ind] = tag;
			});
			var STags = {
				"tags": JTags
			};
			var formData = $(this).serializeObject();
			formData.tags = JTags;
			formData.regDate = Date();
			$.ajax({
				type: "POST",
				cache: false,
				contentType: "application/json",
				url: $(this).attr('action'),
				data: JSON.stringify(formData),
				success: function(data) {
					var registerSuccessModal = $('#registerSuccessModal');
					registerSuccessModal.on('hidden.bs.modal', function(e) {
						window.location.replace("/login");
					});
					registerSuccessModal.modal('show');
				},
				error: function(data) {
					var registerFailModal = $('#registerFailModal');
					if (data.status == 409) {
						registerFailModal.find('#modalFailContent').text('A user with this email already exists.');
					}
					else {
						registerFailModal.find('#modalFailContent').text('We have a problem. Please try again or contact administrator');
					}
					registerFailModal.modal('show');
					$('#reg_but').prop('disabled', false);
				}
			});
		}
	});
	$("#form-reg").bind("keypress", function(e) {
		if (e.keyCode == 13) {
			return false;
		}
	});


});