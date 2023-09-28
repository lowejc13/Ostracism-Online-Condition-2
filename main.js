// **Instructions** **main.js**
// ------------
// In this document you will find instructions on how to adjust different parameters of the paradigm. You can apply the desired changes to the document main.js on your computer or server, using a source code editor.
// The following parameters are necessary to adjust: number of avatar images, and the redirect link at the end of the study. All other parameters have a default option and adjustments are optional.

$(function() {
  // **Parameters**
  // ------------
  function set_settings() {
    window.settings = [];

	  // **Number** **of** **Avatar** **Images**
	  // Number of avatars the user can choose from. Can be changed to any number, depending on how many avatars you would like to display. Default: 82
	  // The avatar images used in the online preview of the paradigm were created using by pickaface.net and due to their terms not available for redistribution. You should therefore create your own images. All images should be 250x250 pixels in size and carry the names "avatar_NUMBER.png" (e.g. avatar_1.png; "png" should be lower case; the numbers in the names should be consequtive, starting from 1). The number of avatars dependeds on the corresponding parameter. The images should be placed in folder "avatars," located in the main study folder extracted on your computer or server.
    settings.numberofavatars = 82;

    // **Redirection**
	  // After the introduction task is over participants should be redirected to a survey with manipulation checks and dependent measures, to subsequent tasks, or to further instructions.
	  // If the study is called with a parameter for redirection, as explained in the documentation, this value is overwritten.
	  // To the redirect link, the following information will be appended: (1) participant number, (2) condition, (3) username, (4) description submitted by participant. These variables can be extracted from the link, saved as data, and used for linking the Social Media Ostracism paradigm to subsequent tasks and measures. See documentation for more details.
    settings.defaultredirect = 'https://msu.co1.qualtrics.com/jfe/form/SV_6yWfqs7ndfVR0mq';

	  // **Tasklength**
    // Length of the group introduction task in milliseconds. Can be changed to any number (in ms). Default: 180000 (3min)
    settings.tasklength = 180000;    // Original time

    // **Number** **of** **"likes"**
    // Each received "like" is indicated by the timepoint (in ms) at which the "like" will appear. To change the number of "likes" in each condition, add or remove timepoints. Make sure that every timepoint (except the first) is preceded by a single comma.
    // User will receive 6 likes at the following timepoints (in ms).
    window.settings.condition_likes = [10000,11111];

	  // **Others' likes**
	  // To keep the total distribution of "likes" constant across conditions, The "likes" received by one group member can be adjusted according to the participant's. By default, the other group member receives 9 "likes" in the participant-ostracism condition, 5 in the participant-inclusion condtion, and 1 in the participant-overinclusion condtion.
    window.others.posts[1].likes = [12000,14000,15000,35000,80000]; // 5
    window.others.posts[1].Dislikes = [12000,14000,15000,35000,80000]; // 5

    // Usernames by which the participant will receive "likes"
	  // If group member names are changed, these should be changed accordingly.
    settings.likes_by = ['Hannah','Georgeee','Sarah','Arjen','Jenny','AncaD','Laura','John','Ky'];
    settings.Dislikes_by = ['John','AncaD','Sarah','Arjen','Jenny','Georgeee','Laura','Hannah','Ky'];
  }

  // -------------------
  // Above were the basic parameters you can adjust using the instructions. The remaining code is also annotated, but we do not recommend changing it, unless you are comfortable with web programming.
  // -------------------


  // **Slide:** **Intro**
  // With instructions regarding the task. The intro container is shown, the continue calls the next slide when clicked.
  function init_intro() {
  	$('#intro').show();
  	$('#submit_intro').on('click',function() {
			$('#intro').hide();
  		init_name();
  	});
  }

  // **Slide:** **Username**
  // Note: Only alphanumeric usernames without spaces are accepted

  function init_name() {

  	$('#name').show();
  	$('#submit_username').on('click',function() {
  		var error = 0;
  		var uname = $('#username').val();

  		if(uname == "") {
  		  error = 1;
  		  errormsg = 'Please enter text';
  		  uname = "undefined";
  		}
  		if(not_alphanumeric(uname)) {
  			error = 1;
  		  errormsg = 'Please only letters (and no spaces)';
  		}
  		if(error == 0) {
        $('#name').hide();
        window.username = $('#username').val();
        init_avatar();
      } else {
        alertify.log(errormsg,"error");
  		}
  	});
  }


  // **Slide:** **Avatar**
  // Avatar slide in which the participant is asked to select an avatar

  function init_avatar() {
  	$('#avatar').show();

    var avatars = window.settings.numberofavatars;
  	for(var i=0; i<avatars; i++)
  	{
  		$('.avatars').append('<img id="avatar_' + i+ '" src="avatars/avatar_' + i + '.png" class="avatar" />');
  	}

  	$('.avatar').on('click', function() {
  		$('.avatar').removeClass('selected');
  		$(this).addClass('selected');
  	});

    	$('#submit_avatar').on('click',function() {
    		if($('.selected').length == 1) {
          $('#avatar').hide();
          window.avatar = $('.selected').attr('id');
          window.avatarexport = /avatar_([^\s]+)/.exec(window.avatar)[1];
    			init_text();
    		} else {
    			alertify.log("Please select an avatar","error");
    		}
    	});
  }


  // **Slide:** **Description**
  function init_text() {
  	$('#text').show();

  	$("#description").keyup(function(){
  	  $("#count").text("Characters left: " + (400 - $(this).val().length));
  	});

  	$('#submit_text').on('click',function() {
  		var error = 0;
  		if($('#description').val() == "") {
  			error = 1;
  			errormsg = 'Please enter text';
  		}
  		if($('#description').val() !== "" && $('#description').val().length < 140) {
  			error = 1;
  			errormsg = 'Please write a bit more';
			}
  		if($('#description').val().length > 401) {
  			error = 1;
  			errormsg = 'Please enter less text';
  		}
  		if(error == 0) {
  			$('#text').hide();
  			window.description = $('#description').val();
    		init_fb_intro();
    		} else {
    			alertify.log(errormsg,"error");
    		}
  	});
  }


  // **Slide:** **Instructions**
  function init_fb_intro() {
  	$('#fb_intro').show();
  	$('#submit_fb_intro').on('click',function() {
			$('#fb_intro').hide();
 			init_fb_login();
  	});
  }


  // **Slide:** **Login** **Screen**
  // Participant can continue after 8000ms = 8s
  function init_fb_login() {
  	$('#fb_login').show();

  	setTimeout(function() {
  		$('#msg_all_done').show();
  		$("#loader").hide();
  	}, 8000);

  	$('#submit_fb_login').on('click',function() {
			$('#fb_login').hide();
  		init_task();
  	});
  }

  // Disables the like/dislike buttons and notifies the user that the time is up.
  function DeactivateLike() {
	  setTimeout(function() { 
      $('.btn-like').attr("disabled", true);
	    alert("This part of the study has now ended. Please return to the survey tab in your browser.");
    }, 2000);
  }
  function DeactivateDisLike(){
    setTimeout(function() {   
      $('.btn-Dislike').attr("disabled", true);
    }, 3000);
  }

  // **Slide:** **Task**
  function init_task() {
    $('#task').show();
    shortcut.add("Backspace",function() {});

    // Disables the like/dislike buttons once the time is up and notifies the usr.
    jQuery("#countdown").countDown({
      startNumber: window.settings.tasklength/1000, // in seconds
      callBack: function(me) {
        console.log('over');
        $('#timer').text('00:00');
        DeactivateLike();
        DeactivateDisLike();	
      }
    });

    users = {
      "posts" : [
      {
        "avatar": 'avatars/' + window.avatar + '.png',
        "username": window.username,
        "text": window.description,
        "likes": window.settings.condition_likes,
        "Dislikes":  window.settings.condition_Dislikes,
        "usernames": window.settings.likes_by
      }
      ]
    };

    // Add user box to slide
    var tpl = $('#usertmp').html(),html = Mustache.to_html(tpl, users);
    $("#task").append(html);

    // Add other boxes to slide
    var tpl = $('#otherstmp').html(),html = Mustache.to_html(tpl, others);
    $("#task").append(html);

    // Randomize order of other players boxes
    function reorder() {
      var grp = $("#others").children();
      var cnt = grp.length;
      var temp, x;
      for (var i = 0; i < cnt; i++) {
        temp = grp[i];
        x = Math.floor(Math.random() * cnt);
        grp[i] = grp[x];
        grp[x] = temp;
      }
      $(grp).remove();
      $("#others").append($(grp));
    }
    reorder();

	function LikeDisLike() {
    $('.userslikes').each(function() {
    var that = $(this);
    var usernames = $(this).data('usernames').split(",");
    var times = $(this).data('likes').split(",");

    for(var i=0; i<times.length; i++) {
      times[i] = +times[i];
      if(times[i]==10000) {
        themsg = usernames[i] + " liked your post";
        setTimeout(function(themsg) {
          that.text(parseInt(that.text()) + 1);
          alertify.success(themsg)
        }, times[i], themsg);
      }
      else {
        DislikeFunction(times[i],usernames[i]);
      }
    }
    });
  }

  function DislikeFunction(times,usernames) {
    $('.usersDislikes').each(function(){
      if(times==11111){
        var that = $(this);
        themsg = usernames + " disliked your post";
        setTimeout(function(themsg) {
          that.text(parseInt(that.text()) + 1);
          alertify.error(themsg)
        }, times, themsg);
      }
    });
  }

  LikeDisLike();  // Initializes the like and dislike

    // When others receive likes
    $('.otherslikes').each(function() {
      var that = $(this);
      var times = $(this).data('likes').split(",");
      for(var i=0; i<times.length; i++) {
        if(times[i] ==  9999999) {
          setTimeout(function () {
            that.text(parseInt(that.text()) + 0);
          }, times[i]);
        }
        else {
          times[i] = +times[i];
          setTimeout(function () {
            that.text(parseInt(that.text()) + 1);
          }, times[i]);
        }
      }
    });

      // When others receive Dislikes
    $('.othersDislikes').each(function() {
      var that = $(this);
      var times = $(this).data('likes').split(",");

      for(var i=0; i<times.length; i++) {
        if(times[i]== 12000 || times[i] == 35000 ||  times[i] ==  13333 || times[i] == 20000 || times[i] == 25000 || times[i] == 40000 || times[i] ==  9999999 || times[i] ==  9000 || times[i] ==  40000 || times[i] ==  38000 || times[i] ==  1000 || times[i] == 55248 || times[i] == 68791 || times[i] == 76542 || times[i] == 87654) {
          setTimeout(function () {
            that.text(parseInt(that.text()) + 0);
          }, times[i]);
        }
        else {
          times[i] = +times[i] +2000;
          setTimeout(function () {
            that.text(parseInt(that.text()) + 1);
          }, times[i]);
        }
      }
    });

    // Initialize like buttons
    $('.btn-like').on('click', function() {
      $(this).prev().text(parseInt($(this).prev().text()) + 1);
      
      // Like buttons can only be clicked once
      $(this).attr("disabled", true);
      $(this).parent().parent().find('.btn-like').attr("disabled", true);
    });


    // Initialize Dislike buttons
    $('.btn-Dislike').on('click', function() {
      $(this).prev().text(parseInt($(this).prev().text()) + 1);
      
      // Like buttons can only be clicked once
      $(this).attr("disabled", true);
      $(this).parent().parent().find('.btn-Dislike').attr("disabled", true);
    });

    // Initalize Masonry plugin
    // For display of user and other players boxes in columns without gaps
    $('#task').masonry({
      itemSelector : '.entry',
      columnWidth : 10
    });

    // Redirect, default after 180000ms = 180s = 3min
    setTimeout(function() {

      $(window).unbind('beforeunload');
      //$('#final-continue').show();
      $('#timer').text('00:00');
      //$('#final-continue').on('click', function() {
        // Redirect link
        //location.href = window.redirect+'&a='+window.participant+'&b='+window.condition+'&c='+encodeURI(window.username)+'&d='+window.avatarexport+'&e='+encodeURI(window.description);  // change p->a, c->b, u ->c, av->d, d->e
      //});
    },window.settings.tasklength); // timing for task
  }

  // Sets redirect link for string query, MUST ENCODE REDIRECT LINK
  function get_params() {
    if(window.QueryString.redirect !== undefined && window.QueryString.redirect !== "") {
      window.redirect = decode(window.QueryString.redirect);
    } else {
      window.redirect = window.settings.defaultredirect;
    }

    var urlHasQuestionMark = (window.redirect.indexOf("?") > -1);

    if(!urlHasQuestionMark) {
      window.redirect = window.redirect+"?redir=1";
    }
  }

  // The variable QueryString contains the url parameters, i.e. condition no. and participant no.
  // via http://stackoverflow.com/a/979995
  window.QueryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
        // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
        // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]], pair[1] ];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(pair[1]);
      }
    }
      return query_string;
  } ();


  // Function to check letters and numbers
  // via http://www.w3resource.com/javascript/form/letters-numbers-field.php
  function not_alphanumeric(inputtxt) {
    var letterNumber = /^[0-9a-zA-Z]+$/;
    if(inputtxt.match(letterNumber)) {
        return false;
      } else {
        return true;
      }
  }

  // Function to add extra zeros infront of numbers (used for the countdown)
  // via http://stackoverflow.com/a/6466243
  function pad (str, max) {
      return str.length < max ? pad("0" + str, max) : str;
  }

  // Function for encoding and decoding URLs
  // via http://meyerweb.com/eric/tools/dencoder/
  function encode(unencoded) {
    return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
  }
  function decode(encoded) {
    return decodeURIComponent(encoded.replace(/\+/g,  " "));
  }


  // Simple Countdown
  // via http://davidwalsh.name/jquery-countdown-plugin
  jQuery.fn.countDown = function(settings,to) {
    settings = jQuery.extend({
      startFontSize: "12px",
      endFontSize: "12px",
      duration: 1000,
      startNumber: 10,
      endNumber: 0,
      callBack: function() { }
    }, settings);
    return this.each(function() {
      if(!to && to != settings.endNumber) { to = settings.startNumber; }
      jQuery(this).children('.secs').text(to);
      jQuery(this).animate({
        fontSize: settings.endFontSize
      }, settings.duration, "", function() {
        if(to > settings.endNumber + 1) {
          jQuery(this).children('.secs').text(to - 1);
          jQuery(this).countDown(settings, to - 1);
          var minutes = Math.floor(to / 60);
          var seconds = to - minutes * 60;
          jQuery(this).children('.cntr').text(pad(minutes.toString(),2) + ':' + pad(seconds.toString(),2));
        }
        else {
          settings.callBack(this);
        }
      });
    });
  };

  // Prevent that participants accidentally exit the experiment by disabling F5 and backspace keys
  shortcut.add("f5",function() {});
  $(window).bind('beforeunload', function() {
    return 'Are you sure you want to quit the experiment completely?';
  });

  // Set Settings
  set_settings();
  get_params();

  // Start with the intro slide
  init_intro();
});
