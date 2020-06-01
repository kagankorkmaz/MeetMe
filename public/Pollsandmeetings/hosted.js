



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
          var ed = document.createElement("i");
          ed.classList.add('material-icons');
          ed.classList.add('left');
          ed.innerText = "edit";

          var edd = document.createElement("i");
          edd.classList.add('material-icons');
          edd.classList.add('right');
          edd.innerText = "edit";
          let editButton = document.createElement('a');
          editButton.classList.add('editButton');
          editButton.classList.add('waves-effect');
          editButton.classList.add('waves-light');
          editButton.classList.add('btn-large');
          editButton.style.color = 'white';
          editButton.style.marginTop = '20px';
          editButton.style.width = '100%';
          editButton.innerHTML =  "edit meeting";         
          editButton.addEventListener('click',() => this.edit(poll));
          editButton.appendChild(ed);
          editButton.appendChild(edd);

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
          Redat.innerHTML = poll.recurrence;
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
          Body.appendChild(editButton);
          
          


          

         

       


        
        
          
          dat.appendChild(Title);
          dat.appendChild(Body);
          Poll.appendChild(dat);
          
          
          

          
          

        }     
        
        
        edit(poll)
        {
          // let form = document.createElement('form');
          // form.method= 'POST'
          // var stuff2 = document.createElement("input"); 
          // stuff2.value = poll;
          // stuff2.name = "myData";

          // form.appendChild(stuff2);
          // var formplace=document.getElementById("tempform");

          // console.log(poll);
          // formplace.appendChild(form);
          // //form.submit();
          
          var output = {data:poll, type:"meeting"};
          console.log(output);
          window.localStorage.setItem("edit",JSON.stringify(output));
          document.location.href = "/profile/hostedSingle";
        }

}

class pend{

  constructor(pol,Poll,calen)
  {
    this.createpoll(pol,Poll,calen);
  }

  createpoll(poll,Poll,calen){       

  let dat = document.createElement("li");
  let Title = document.createElement("div");
  Title.classList.add("collapsible-header");
  dat.id = poll.pollid; // Burasi Pollun idsi
  

  
  Title.innerHTML = "<i class="+"material-icons"+" style=" + "color:#e020ee;" + " >poll</i>" + poll.polls[0].title;

  console.log(Title);;

  let Body = document.createElement("div");
  Body.classList.add("collapsible-body");

  let Desc = document.createElement("h6");
  let Dd = document.createElement("h5");
  Dd.innerHTML = "Description: ";
  Dd.style.fontFamily= "Raleway-Bold";

  Dd.style.color = "#e020ee";
  Desc.innerHTML = poll.polls[0].description;
  Desc.style.paddingTop = "10px";
  Desc.style.paddingBottom = "10px";

  Body.appendChild(Dd);
  Body.appendChild(Desc);

  
    let Recurrance = document.createElement("p");
  Recurrance.innerHTML = "Recurrance: ";
  Recurrance.style.fontFamily= "Raleway-Bold";
  Recurrance.style.color = "#e020ee";


  let Redat = document.createElement("p");
  Redat.innerHTML = poll.polls[0].recurrence;
  Redat.style.paddingTop = "5px";

  Body.appendChild(Recurrance);
  Body.appendChild(Redat);

  

  let med = document.createElement("p");
  med.innerHTML = "Medium: ";
  med.style.fontFamily= "Raleway-Bold";
  med.style.color = "#e020ee";

  let meddat = document.createElement("p");
  meddat.innerHTML = poll.polls[0].medium;
  meddat.style.paddingTop = "5px";

  Body.appendChild(med);
  Body.appendChild(meddat);

  
    let meda = document.createElement("p");
  meda.innerHTML = "Location: ";
  meda.style.fontFamily= "Raleway-Bold";
  meda.style.color = "#e020ee";


  let meddata = document.createElement("p");
  if(poll.polls[0].location)
  {
  meddata.innerHTML = poll.polls[0].location;
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
  if(poll.polls[0].link)
  {
     linka.innerHTML = poll.polls[0].link;
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
  console.log(poll.polls[0].mails);
  for(var i=0;i<poll.polls[0].mails.length;i++)
  {
    let attendee = document.createElement("p");
    attendee.innerHTML = poll.polls[0].mails[i];
    attendee.style.paddingTop = "5px";

    Body.appendChild(attendee);
  }
  
  let Ti = document.createElement("h5");
  Ti.style.color = "#e020ee";
  Ti.style.paddingTop = "10px";
  Ti.style.paddingBottom = "10px";
  Ti.innerHTML = "Possible Times";
  Ti.style.fontFamily= "Raleway-Bold";
  
  Body.appendChild(Ti);
  
  for(var i=0;i<poll.polls.length;i++)
  {
    let lab = document.createElement("label");
    let stt = document.createElement("input");
    stt.id =  JSON.stringify(poll._id) + i;

    stt.type = "radio";
    stt.name = "group1"
    let span = document.createElement("span");
    span.innerHTML =  poll.polls[i].start_date + " -- " + poll.polls[i].end_date + "  current vote: (" + poll.polls[i].vote  + ")";
    span.style.fontFamily = "Roboto";
    span.style.fontWeight = "bold";
    
    lab.appendChild(stt);
    lab.appendChild(span);

    Body.appendChild(lab);
  }


  

  let li = document.createElement("div");
  
  let but = document.createElement("button");
  but.classList.add('waves-effect');
  but.classList.add('waves-light');
  but.classList.add('btn-large');
  but.style.width = "49%";
  but.style.float = 'right';
   but.style.height = "50px";

   but.addEventListener('click',() => this.evaluate(JSON.stringify(poll._id),poll));

   var done = document.createElement("i");
   done.classList.add('material-icons');
   done.classList.add('left');
   done.innerText = "done";

   var donee = document.createElement("i");
   donee.classList.add('material-icons');
   donee.classList.add('right');
   donee.innerText = "done";
   but.appendChild(done);
   but.appendChild(donee);

  

  li.style.paddingTop = "20px";
  li.style.marginBottom = "40px";

let sp = document.createElement("span");
sp.innerHTML = "Finalize Schedule";

let editButton = document.createElement('a');
          editButton.classList.add('editButton');
          editButton.classList.add('waves-effect');
          editButton.classList.add('waves-light');
          editButton.classList.add('btn-large');
          editButton.style.color = 'white';
          editButton.style.width = '49%';
          editButton.style.height = "50px";

          editButton.style.float = 'left';
          editButton.innerHTML =  "edit poll";         
          editButton.addEventListener('click',() => this.edit(poll));
          var ed = document.createElement("i");
          ed.classList.add('material-icons');
          ed.classList.add('left');
          ed.innerText = "edit";

          var edd = document.createElement("i");
          edd.classList.add('material-icons');
          edd.classList.add('right');
          edd.innerText = "edit";
          editButton.appendChild(ed);
          editButton.appendChild(edd);

but.appendChild(sp);

li.appendChild(but);
li.appendChild(editButton);

Body.appendChild(li);

  
  dat.appendChild(Title);
  dat.appendChild(Body);
  Poll.appendChild(dat);
  
  
  

  if(!this.is72hrs(poll.created)){
    but.classList.add('disabled');

  }

  
  

}

is72hrs(date){

  var cr = Date.parse(date);
  var now = Date.now();

  var sth = now - cr;
  
  //Tek GÜne indirmek için 3e böleceğiz demoda
  if(sth >= 259200000)
  {
    return true;
  }
  return false;
}




evaluate(id,poll){
  var b = -1;

  for(var i=0;i<poll.polls.length;i++)
  {
    let tid = id+i;
    var a = document.getElementById(tid);
    if(a.checked)
     {
       b = i;
     }

  }

  if(b == -1)
  {
    alert("Please Choose at least one opiton!");
  }
  else{
    var the_meeting ={data: poll.polls[b], pollId: id}

    let form = document.createElement('form');
    form.method= 'POST'
    var stuff2 = document.createElement("input"); 
    stuff2.value = JSON.stringify(the_meeting);
    stuff2.name = "myData";
  
    form.appendChild(stuff2);
    var formplace=document.getElementById("tempform");
  
    console.log("labadaba");
    console.log(the_meeting);
    formplace.appendChild(form);
    form.submit();

    
  }

  // if(poll.votercount == poll.voters)
  // {
  //   let Title = poll.polls[0].Title;
  //   let Desc = poll.polls[0].description;
  //   let att = poll.polls[0].attendees;

  //   var highest = 0;
  //   var high;
  //   for(var i=0;i<poll.polls.length;i++)
  //   {
  //     if(poll.polls[i].vote > highest)
  //     {
  //       high = i;
  //       highest = poll.polls[i].vote;
  //     }
  //   }

  //   let start_date = poll.polls[high].start_date;
  //   let end_date = poll.polls[high].end_date;

  //   Meeting = {Title:Title,Decsription:Desc,Attendees:att,start_date:start_date,end_date:end_date};
  //   console.log(Meeting);
  // }
  
 
}

edit(poll)
{
  // let form = document.createElement('form');
  // form.method= 'POST'
  // var stuff2 = document.createElement("input"); 
  // stuff2.value = poll;
  // stuff2.name = "myData";

  // form.appendChild(stuff2);
  // var formplace=document.getElementById("tempform");

  // console.log(poll);
  // formplace.appendChild(form);
  //form.submit();

  var output = {data:poll, type:"poll"};
  window.localStorage.setItem("edit",JSON.stringify(output));
  document.location.href = "/profile/hostedSingle";
  
}

}

function myFunction() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("mettmejim");
  ul = document.getElementById("mettmejim2");
  li = ul.getElementsByTagName('li');
  li2 = ul.getElementsByTagName('li');
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

  for (i = 0; i < li2.length; i++) {
    a = li2[i].getElementsByTagName("div")[0];
    b = a.innerText.substring(3,99)
    txtValue = a.textContent || b;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li2[i].style.display = "";
    } else {
      li2[i].style.display = "none";
    }
  }
}


window.addEventListener("DOMContentLoaded",function() {

  var pollsArr = document.getElementById("hosted").getAttribute("pollsArr");
  var idArr = document.getElementById("hosted").getAttribute("idArr");
  var meetingsArr = document.getElementById("hosted").getAttribute("meetingsArr");
  var myUser = document.getElementById("hosted").getAttribute("user");

  console.log(JSON.parse(meetingsArr)[0]);
  console.log(JSON.parse(pollsArr));
  console.log(JSON.parse(idArr));

  console.log(typeof JSON.parse(pollsArr)[0])

//  var data =[  // cheduled meetings go here
//    {"title":"This is a meeting",
//  "description":"its desc",
//  "mails":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],
//  "medium":"Offline",
//  "location":"Antalya",
//  "link": "",
//  "recurrence":"single",
//  "start_date":"2020-04-22 02:55",
//  "end_date":"2020-04-22 03:00",
//  "vote":5},

//  {"title":"is a meeting",
//  "description":"its desc",
//  "mails":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],
//  "medium":"Online",
//  "location":"Discord",
//  "link": "url",
//  "recurrence":"weekly",
//  "start_date":"2020-04-22 02:55",
//  "end_date":"2020-04-22 03:00",
//  "vote":5},
//  {"title":"is a meeting",
//  "description":"its desc",
//  "mails":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],
//  "medium":"Online",
//  "location":"",
//  "link": "",
//  "recurrence":"single",
//  "start_date":"2020-04-22 02:55",
//  "end_date":"2020-04-22 03:00",
//  "vote":5}

// ]


// var pollstufs = [
//   {"_id":{"$oid":"5ecad9ad3f83b534b3be3639"},"voterCount":{"$numberInt":"2"},"voters":{"$numberInt":"0"},"polls":"[{\"title\":\"huhu\",\"description\":\"juju\",\"mails\":[\"kagankorkmazz1998@gmail.com\",\"kagankorkmaz@sabanciuniv.edu\"],\"medium\":\"Offline\",\"location\":\"\",\"link\":\"\",\"recurrence\":\"single\",\"host\":\"kagankorkmaz@sabanciuniv.edu\",\"created\":\"2020-05-24T20:28:29.930Z\",\"start_date\":\"2020-05-22 02:05\",\"end_date\":\"2020-05-22 05:55\"},{\"title\":\"huhu\",\"description\":\"juju\",\"mails\":[\"kagankorkmazz1998@gmail.com\",\"kagankorkmaz@sabanciuniv.edu\"],\"medium\":\"Offline\",\"location\":\"\",\"link\":\"\",\"recurrence\":\"single\",\"host\":\"kagankorkmaz@sabanciuniv.edu\",\"created\":\"2020-05-24T20:28:29.930Z\",\"start_date\":\"2020-05-23 08:50\",\"end_date\":\"2020-05-23 11:45\"}]","__v":{"$numberInt":"0"}},
//   {"_id":{"$oid":"5ecad9df3f83b534b3be363a"},"voterCount":{"$numberInt":"2"},"voters":{"$numberInt":"0"},"polls":"[{\"title\":\"şıkşık\",\"description\":\"lplpl\",\"mails\":[\"kagankorkmazz1998@gmail.com\",\"kagankorkmaz@sabanciuniv.edu\"],\"medium\":\"Offline\",\"location\":\"\",\"link\":\"\",\"recurrence\":\"single\",\"host\":\"kagankorkmaz@sabanciuniv.edu\",\"created\":\"2020-05-24T20:32:31.116Z\",\"start_date\":\"2020-05-22 02:35\",\"end_date\":\"2020-05-22 07:25\"},{\"title\":\"şıkşık\",\"description\":\"lplpl\",\"mails\":[\"kagankorkmazz1998@gmail.com\",\"kagankorkmaz@sabanciuniv.edu\"],\"medium\":\"Offline\",\"location\":\"\",\"link\":\"\",\"recurrence\":\"single\",\"host\":\"kagankorkmaz@sabanciuniv.edu\",\"created\":\"2020-05-24T20:32:31.116Z\",\"start_date\":\"2020-05-22 08:45\",\"end_date\":\"2020-05-22 10:25\"}]","__v":{"$numberInt":"0"}},
//   {"_id":{"$oid":"5ecada13bfb6943505f547af"},"voterCount":{"$numberInt":"2"},"voters":{"$numberInt":"0"},"polls":"[{\"title\":\"uyyu\",\"description\":\"yutt\",\"mails\":[\"kagankorkmazz1998@gmail.com\",\"kagankorkmaz@sabanciuniv.edu\"],\"medium\":\"Offline\",\"location\":\"\",\"link\":\"\",\"recurrence\":\"single\",\"host\":\"kagankorkmaz@sabanciuniv.edu\",\"created\":\"2020-05-24T20:33:22.915Z\",\"start_date\":\"2020-05-22 01:40\",\"end_date\":\"2020-05-22 05:35\"},{\"title\":\"uyyu\",\"description\":\"yutt\",\"mails\":[\"kagankorkmazz1998@gmail.com\",\"kagankorkmaz@sabanciuniv.edu\"],\"medium\":\"Offline\",\"location\":\"\",\"link\":\"\",\"recurrence\":\"single\",\"host\":\"kagankorkmaz@sabanciuniv.edu\",\"created\":\"2020-05-24T20:33:22.915Z\",\"start_date\":\"2020-05-23 08:55\",\"end_date\":\"2020-05-23 10:25\"}]","__v":{"$numberInt":"0"}}
// ] //pending polls go here

var data= JSON.parse(meetingsArr);
var pollstufs = JSON.parse(pollsArr);



var Poll = document.createElement("ul");
Poll.id = "mettmejim";
Poll.classList.add("collapsible");
Poll.classList.add("expandable");

for(var i=0;i<data.length;i++){
   new meet(data[i], Poll);
}

var Poll2 = document.createElement("ul");
Poll2.id = "mettmejim2";
Poll2.classList.add("collapsible");
Poll2.classList.add("expandable");

for (var i=0;i<pollstufs.length;i++){
  
   
  //pollstufs[i].polls = JSON.parse(pollstufs[i].polls);
  console.log(pollstufs[i].polls);
  new pend(pollstufs[i],Poll2)

}
  

var mother = document.getElementById("final");

mother.appendChild(Poll);
mother.style.paddingBottom = "20px";

var father = document.getElementById("pending");

father.appendChild(Poll2);
father.style.paddingBottom = "20px";

$(document).ready(function(){
  $('.collapsible').collapsible();
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