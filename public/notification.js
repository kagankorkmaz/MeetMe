




  class notification{	

	constructor(place){
		var navbar = document.createElement("div");
		navbar.classList.add("navbar");
		navbar.style.width = "20px";
		navbar.style.paddingRight = "80px";

		var navbar_right = document.createElement("div");
		navbar_right.classList.add("navbar_right");

		var notifications = document.createElement("div");
		notifications.classList.add("notifications");

		var but = document.createElement("a");
		but.classList.add("waves-effect");
		but.classList.add("waves-light");
		but.classList.add("btn-large");
		but.classList.add("btn-floating");
		but.classList.add("icon_wrap");
		but.style.width = "50px";
		but.style.height = "50px";

		var icon = document.createElement("i");
		icon.classList.add("material-icons");
		icon.style.color = "white";
		icon.innerHTML= "notifications";
		icon.style.padding = "0px";

		// var bell = document.createElement("div");
		// bell.classList.add("icon_wrap");
		// var ic = document.createElement("i");
		// ic.classList.add("far");
		// ic.classList.add("fa-bell");

		// bell.appendChild(ic);
        but.appendChild(icon);

		notifications.appendChild(but);

		var notification_dd = document.createElement("div");
		notification_dd.classList.add("notification_dd");

		var ul = document.createElement("ul");
		ul.classList.add("notification_ul");
		ul.style.paddingTop = "10px";

		//this.bar = ul;
		ul.id = "bar_add"



		var popup = document.createElement("div");
		popup.classList.add("popup");

		var shadow = document.createElement("div");
		shadow.classList.add("shadow");
		
		popup.appendChild(shadow);

		var innerpopup = document.createElement("inner_popup");
		innerpopup.classList.add("inner_popup");


		var popup_dd = document.createElement("div");
		popup_dd.classList.add("notification_dd");

		var popup_ul = document.createElement("ul");
		popup_ul.classList.add("notification_ul");
		popup_ul.id ="popup_add";



		notification_dd.appendChild(ul);
		notifications.appendChild(notification_dd);
		navbar_right.appendChild(notifications);
		navbar.appendChild(navbar_right);


		popup_dd.appendChild(popup_ul);
		innerpopup.appendChild(popup_dd);
		popup.appendChild(innerpopup);

		//this.popup = popup_ul;
		navbar.appendChild(popup);

		place.appendChild(navbar);
		

	}

	evaluate(index, href,data){
		if (index !== -1) data.splice(index, 1);
		var output = {data:data, href:href};
          console.log(output);
          window.localStorage.setItem("notification",JSON.stringify(output));
          document.location.href = "/profile/dummyNotification";
	}

	makemeeting(icono,message,href,index,data){

		var div = document.createElement("li");
		var but = document.createElement("a");
		but.classList.add("waves-effect");
		but.classList.add("waves-light");
		but.classList.add("btn-large");
		but.style.width = "100%";
		but.style.fontSize = "x-small";
		but.style.fontWeight= "bold";
		but.style.paddingLeft = "12px";
		but.style.paddingRight = "20px";
		var icon = document.createElement("i");
		icon.classList.add("material-icons");
		icon.classList.add("right");
		console.log(icon);
		icon.innerHTML= icono;
		but.innerHTML = message;
		//but.href = href;

		but.addEventListener('click',() => this.evaluate(index,href,data));
		but.appendChild(icon);
		div.appendChild(but);
		return div;

	}

	meeting(host, index,data)
	{		 
	  var icon = "people";
	  var message = "New meeting " + host + " is created.";
	  var href = "/profile/meetings";
	  return this.makemeeting(icon,message,href,index,data); 	 
   	}

	poll(host,index,data)
	{
	  var icon = "poll";
	  var message = "New poll " +  host  + " is created.";
	  var href = "/profile/polls";
	  return this.makemeeting(icon,message,href,index,data); 	  
  
	}

	resched_poll(host,index,data)
  {
		var icon = "assignment_late";
		var message = "A poll " + host + " is rescheduled" ;
		var href = "/profile/polls";
		return this.makemeeting(icon,message,href,index,data);    			
  }

  resched_meeting(host,index,data)
  {
		var icon = "account_circle";
		var message = "A meeting " + host + " is rescheduled";
		var href = "/profile/meetings";
		return this.makemeeting(icon,message,href,index,data);    		
   }

   allvoted(host,index,data){
	var icon = "done";
	var message = "All participants have voted on your meeting: " + host;
	var href = "/profile/hosted";
	return this.makemeeting(icon,message,href,index,data);
   }

   finalized_poll(host,index,data){
	var icon = "done";
	var message = "The meeeting: " + host + " is finalized";
	var href = "/profile/meetings";
	return this.makemeeting(icon,message,href,index,data);
   }

   lookall(){

	var li = document.createElement("li");
	li.classList.add("show_all");

	var p = document.createElement("p");
	p.classList.add("link");
	p.innerHTML = "Show All Notifications";

	li.appendChild(p);

	return li;
}

initpop(){
	var li = document.createElement("li");
	li.classList.add("title");
	li.style.paddingTop = "20px";

	var p = document.createElement("p");
	p.innerHTML = "All Notifications";


	var p2 = document.createElement("p");
	p2.classList.add("close");


	var i = document.createElement("i");
	i.classList.add("fas");
	i.classList.add("fa-times");
	i.setAttribute("aria-hidden", 'true');
	i.style.paddingTop = "20px";

	
	p2.appendChild(i);

	li.appendChild(p);
	li.appendChild(p2);

	return li;



  }

  }

  
  

  window.addEventListener("DOMContentLoaded", function () { // execution starts here
 
	var parent = document.getElementById("notify");
	var jim = new notification(parent);
	var userNotification = document.getElementById("notification").getAttribute("notification");
	userNotification = JSON.parse(userNotification);
	console.log(userNotification);
	data = userNotification;
	// var data = [
	// 			"meeting",
	// 			  "poll",
	// 			  "resched_poll",
	// 			  "resched_meeting",
	// 			  "resched_poll",
	// 			 "resched_meeting",
	// 			  "poll",
	// 			  "meeting",
	// 			  "resched_poll",				
	// 			]
				
	  var barr = document.getElementById("bar_add");
	  var popp = document.getElementById("popup_add");
	  popp.appendChild(jim.initpop());
	  console.log(barr);

	  count = 0;
	 for(var i=data.length-1; i>=0;i--)
	 {
	   if(count <= 3){barr.appendChild(jim[data[i].type](data[i].title,i, data));}

	   if(count == 4){barr.appendChild(jim.lookall());}

		popp.appendChild(jim[data[i].type](data[i].title,i,data))

		count += 1;		 
	 }



	$(".profile .icon_wrap").click(function () {
		$(this).parent().toggleClass("active");
		$(".notifications").removeClass("active");
	  });
	  
	  $(".notifications .icon_wrap").click(function () {
		$(this).parent().toggleClass("active");
		$(".profile").removeClass("active");
	  });
	  
	  $(".show_all .link").click(function () {
		$(".notifications").removeClass("active");
		$(".popup").show();
	  });
	  
	  $(".close, .shadow").click(function () {
		$(".popup").hide();
	  });

	

});
  