function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    /*console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());*/
    $(".g-signin2").html();
    $(".g-signin2").css("display", "none");
    $(".data").css("display","block");
    $("#pic").attr('src',profile.getImageUrl());
    $("#email").text(profile.getEmail());
    window.location.replace("logged.html");
    // The ID token you need to pass to your backend:
    //var id_token = googleUser.getAuthResponse().id_token;
    //console.log("ID Token: " + id_token);
  }
  function signOut(){
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function(){
          alert("You have been succesfully signed out");

          $(".g-signin2").css("display","block");
          $(".data").css("display","none");
      });
  }


/*


$(document).ready(function(){
	$("#signout-container").hide();
});
function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  $("#signout-container").show();
  $("#signin-container").hide();
  $("#loggedUserImage").attr("src", profile.getImageUrl());
  $("#loggedUsername").html(profile.getName());
  $("#loggedUserEmail").html(profile.getEmail());
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}
function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
	  console.log('User signed out.');
	  $("#signout-container").hide();
	  $("#signin-container").show();
	});
}




*/