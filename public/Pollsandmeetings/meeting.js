



class meet{

          constructor(pol,Poll)
          {
            this.createpoll(pol,Poll);
          }

          createpoll(poll,Poll)
          {
            
          let dat = document.createElement("li");
          let Title = document.createElement("div");
          Title.classList.add("collapsible-header");
          dat.id = poll.pollid; // Burasi Pollun idsi
          

          
          Title.innerHTML = "<i class="+"material-icons"+" style=" + "color:#e020ee;" + " >poll</i>" + poll.title;

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

          Body.appendChild(Dd);
          Body.appendChild(Desc);

          
            let Recurrance = document.createElement("p");
          Recurrance.innerHTML = "Recurrance: ";
          Recurrance.style.fontFamily= "Raleway-Bold";
          Recurrance.style.color = "#e020ee";


          let Redat = document.createElement("p");
          Redat.innerHTML = poll.recurance;
          Redat.style.paddingTop = "5px";

          Body.appendChild(Recurrance);
          Body.appendChild(Redat);

          

          let med = document.createElement("p");
          med.innerHTML = "Medium: ";
          med.style.fontFamily= "Raleway-Bold";
          med.style.color = "#e020ee";

          let meddat = document.createElement("p");
          meddat.innerHTML = poll.medium;
          meddat.style.paddingTop = "5px";

          Body.appendChild(med);
          Body.appendChild(meddat);

         
            let meda = document.createElement("p");
          meda.innerHTML = "Location: ";
          meda.style.fontFamily= "Raleway-Bold";
          meda.style.color = "#e020ee";


          let meddata = document.createElement("p");
          if(poll.location)
          {
             meddata.innerHTML = poll.location;
          }
          else{
            meddata.innerHTML = "not specified";

          }
          meddata.style.paddingTop = "5px";

          Body.appendChild(meda);
          Body.appendChild(meddata);

          
         
           
         
            let link = document.createElement("p");
          link.innerHTML = "link: ";
          link.style.fontFamily= "Raleway-Bold";
          link.style.color = "#e020ee";


          let linka = document.createElement("p");
          if(poll.link)
          {
             linka.innerHTML = poll.link;
          }
          else{
            linka.innerHTML = "not specified";
            
          }
          linka.style.paddingTop = "5px";

          Body.appendChild(link);
          Body.appendChild(linka);

          


          
          let att = document.createElement("h5");
          att.style.color = "#e020ee";

          att.innerHTML = "Attendees: ";
          att.style.fontFamily= "Raleway-Bold";

          att.style.color = "#e020ee";

          
          
          
          Body.appendChild(att);
          console.log(poll);
          for(var i=0;i<poll.mails.length;i++)
          {
            let attendee = document.createElement("p");
            attendee.innerHTML = poll.mails[i];
            attendee.style.paddingTop = "5px";

            Body.appendChild(attendee);
          }
          
          let Ti = document.createElement("h5");
          Ti.style.color = "#e020ee";
          Ti.style.paddingTop = "10px";
          Ti.style.paddingBottom = "10px";
          Ti.innerHTML = "Scheduled at";
          Ti.style.fontFamily= "Raleway-Bold";


          let attend = document.createElement("p");
          attend.innerHTML = poll.start_date + " -- " + poll.end_date ;
          attend.style.paddingTop = "5px";
          
          Body.appendChild(Ti);
          Body.appendChild(attend);
          
          


          

         

       


        
        
          
          dat.appendChild(Title);
          dat.appendChild(Body);
          Poll.appendChild(dat);
          
          
          

          
          

        }       

}

function myFunction() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("mettmejim");
  li = ul.getElementsByTagName('li');
  console.log(li);

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("div")[0];
    b = a.innerText.substring(3,99)
    txtValue = a.textContent || b;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function timeCheck(date){
  
  var cr = Date.parse(date);
  var now = Date.now();
  
  var sth = now - cr;

  console.log(sth);
  
  //Tek GÜne indirmek için 3e böleceğiz demoda
  // 3 gün 259200000
  if(sth <= 0)
  {
    return true;
  }
  return false;
}


window.addEventListener("DOMContentLoaded",function() {


var data = document.getElementById("meeto").getAttribute("meetingsArr");
data = JSON.parse(data);





  var Poll = document.createElement("ul");
  Poll.id = "mettmejim";
  Poll.classList.add("collapsible");
  Poll.classList.add("expandable");
  
  if(data && data[0] != "")
  {

    for(var i=0;i<data.length;i++){
      if(timeCheck(data[i].end_date)){
        new meet(data[i], Poll);
      }
      
   }
  }
  else{
    var noMEs = document.createElement("h2");
    noMEs.innerHTML = "You Dont have any Polls";
    noMes.style.fontFamily= "Raleway-Bold";
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