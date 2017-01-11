jQuery(document).ready(function () {
    //cancel enter
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });
    /*
     Fullscreen background
     */
    //TODO: return the background
    // $.backstretch("assets/img/backgrounds/1.jpg");

    $('#top-navbar-1').on('shown.bs.collapse', function () {
        $.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function () {
        $.backstretch("resize");
    });

    /*
     Form validation
     */
    $('.registration-form input[type="text"], .registration-form textarea').on('focus', function () {
        $(this).removeClass('input-error');
    });

    $('.registration-form').on('submit', function (e) {

        $(this).find('input[type="text"], textarea').each(function () {
            if ($(this).val() == "") {
                e.preventDefault();
                $(this).addClass('input-error');
            }
            else {
                $(this).removeClass('input-error');
            }
        });

    });


//form JSON object wrapper
    $.fn.serializeObject = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            }
            else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };


    // handle skill tags in form


    $('input[name=isAccepted]').click(function () {
        var email = $('#' + $(this)[0].id).data('email');
        console.log($(this).is(":checked"));
        $.ajax({
            url: '/users/' + $(this).attr('id'),
            method: 'PUT',
            data: {accepted: $(this).is(":checked")},
            success: function (data) {
                if (data.status === 'ok') {
                    alert("user changed");
                    $(this).attr("checked", $(this).is(":checked"));
                } else {
                    alert("cant update user");
                }
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
            }
        });
    });

    $('input[name=isMember]').click(function () {
        $.ajax({
            url: '/users/' + $(this).data('uid'),
            method: 'PUT',
            data: {isMember: $(this).is(":checked")},
            success: function (data) {
                if (data.status === 'ok') {
                    alert("user changed");
                    $(this).attr("checked", $(this).is(":checked"));
                } else {
                    alert("cant update user");
                }
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
            }
        });
    });


	$("#searchInput").keyup(function () {
		//split the current value of searchInput
		var data = this.value.split(" ");
		//create a jquery object of the rows
		var jo = $("#fbody").find("tr");
		if (this.value == "") {
			jo.show();
			return;
		}
		//hide all the rows
		jo.hide();

		//Recusively filter the jquery object to get results.
		jo.filter(function (i, v) {
			var $t = $(this);
			for (var d = 0; d < data.length; ++d) {
				if ($t.is(":contains('" + data[d] + "')")) {
					return true;
				}
			}
			return false;
		})
		//show the rows that match.
			.show();
	}).focus(function () {
		this.value = "";
		$(this).css({
			"color": "black"
		});
		$(this).unbind('focus');
	}).css({
		"color": "#C0C0C0"
	});
    $('#loginClk').on('click', function () {
        $(this).css("display", "none");
        $('#signinRow').css("display", "block");
    });

});
