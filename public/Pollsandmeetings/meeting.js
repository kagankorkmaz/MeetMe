



class meet{

          constructor(pol,Poll)
          {
            this.createpoll(pol,Poll);
          }

          createpoll(poll,Poll){       

          let dat = document.createElement("li");
          let Title = document.createElement("div");
          Title.classList.add("collapsible-header");
          

          
          Title.innerHTML = "<i class="+"material-icons"+" style=" + "color:#e020ee;" + " >meeting_room</i>" + poll.title;

          console.log(Title);;

          let Body = document.createElement("div");
          Body.classList.add("collapsible-body");

          let Desc = document.createElement("h6");
          let Dd = document.createElement("h5");
          Dd.innerHTML = "Description: ";
          Dd.style.fontFamily= "Raleway-Bold";

          Dd.style.color = "#e020ee";
          Desc.innerHTML = poll.description;
          Desc.style.paddingTop = "10px";
          Desc.style.paddingBottom = "10px";
          
          let att = document.createElement("h5");
          att.innerHTML = "Attendees: ";
          att.style.fontFamily= "Raleway-Bold";

          att.style.color = "#e020ee";

          
          Body.appendChild(Dd);
          Body.appendChild(Desc);
          Body.appendChild(att);
          console.log(poll.title);
          for(var i=0;i<poll.attendees.length;i++)
          {
            let attendee = document.createElement("p");
            attendee.innerHTML = poll.attendees[i];
            attendee.style.paddingTop = "5px";

            Body.appendChild(attendee);
          }
          
          let Ti = document.createElement("h5");
          Ti.style.color = "#e020ee";
          Ti.style.paddingTop = "10px";
          Ti.style.paddingBottom = "10px";
          Ti.innerHTML = "Scheduled Time";
          Ti.style.fontFamily= "Raleway-Bold";
          
          Body.appendChild(Ti);
          
         
            let lab = document.createElement("label");
            let span = document.createElement("h6");
            span.innerHTML =  poll.start_date + " -- " + poll.end_date;
            span.style.fontFamily = "Roboto";
            span.style.fontWeight = "bold";
            



            let spann = document.createElement("p");
            spann.innerHTML = "Selected with: " + poll.vote + "/" + poll.attendees.length;
            spann.style.fontFamily = "Roboto";
            spann.style.fontWeight = "bold";
            spann.style.paddingTop = "10px";
            spann.style.opacity = "0.3";

            Body.appendChild(span);

            lab.appendChild(spann);
            Body.appendChild(lab);

          
          
          dat.appendChild(Title);
          dat.appendChild(Body);
          Poll.appendChild(dat);
          
          

         
          
          

        }       

}

window.addEventListener("DOMContentLoaded",function() {

//  var data =[{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-22 02:55","end_date":"2020-04-22 03:00","vote":5},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-24 06:15","end_date":"2020-04-24 06:20","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-23 08:00","end_date":"2020-04-23 08:05","vote":0}];

var data = document.getElementById("meeto").getAttribute("meetingsArr");
data = JSON.parse(data);

console.log(data);
console.log(typeof(data));


var Poll = document.createElement("ul");
Poll.classList.add("collapsible");
Poll.classList.add("expandable");

for(var i=0;i<data.length;i++){
   new meet(data[i], Poll);
}
  

var mother = document.getElementById("meetings");

mother.appendChild(Poll);
mother.style.paddingBottom = "20px";

var elem = document.querySelector('.collapsible.expandable');
var instance = M.Collapsible.init(elem, {
  accordion: false
});
});

// function deneme(){
//   var acc = document.getElementById("meeting");
//   var i;

//   for (i = 0; i < acc.length; i++) {
//     acc[i].addEventListener("click", function() {
//       this.classList.toggle("active");
//       var panel = this.nextElementSibling;
//       if (panel.style.maxHeight) {
//         panel.style.maxHeight = null;
//       } else {
//         panel.style.maxHeight = panel.scrollHeight + "px";
//       } 
//     });
//   }
// }