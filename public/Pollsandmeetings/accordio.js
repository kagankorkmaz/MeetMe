



class meet{

          constructor(pol,Poll,calen,myId)
          {
            this.createpoll(pol,Poll,calen,myId);
          }

          createpoll(poll,Poll,calen, myId){       

          let dat = document.createElement("li");
          let Title = document.createElement("div");
          Title.classList.add("collapsible-header");
          dat.id = myId; // Burasi Pollun idsi
          

          
          Title.innerHTML = "<i class="+"material-icons"+" style=" + "color:#e020ee;" + " >poll</i>" + poll.polls[0].title;

          console.log(Title);;

          let Body = document.createElement("div");
          Body.classList.add("collapsible-body");

          let Desc = document.createElement("h6");
          let Dd = document.createElement("h5");
          Dd.innerHTML = "Description: ";
          Dd.style.fontFamily= "Raleway-Bold";

          console.log(poll);
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
          Redat.innerHTML = poll.polls[0].recurance;
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
          console.log(poll.polls[0]);
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
            stt.id = myId + i;
            stt.type = "checkbox";
            let span = document.createElement("span");
            span.innerHTML =  poll.polls[i].start_date + " -- " + poll.polls[i].end_date + "(Current Vote: " + poll.polls[i].vote + ")";
            span.style.fontFamily = "Roboto";
            span.style.fontWeight = "bold";
            
            lab.appendChild(stt);
            lab.appendChild(span);

            Body.appendChild(lab);
          }


          let li2 = document.createElement("div");
          var polpage = document.createElement("button");
          polpage.classList.add("input1001");
          let spp = document.createElement("span");
          spp.innerHTML = "Referance your calender";
          polpage.appendChild(spp);

          li2.style.paddingTop = "10px";

          polpage.style.fontFamily = "Raleway-Bold";
          li2.appendChild(polpage);
          
          polpage.addEventListener('click',() => this.gopoll(poll,calen));

          let li = document.createElement("div");
          let but = document.createElement("button");
          but.classList.add("contact100");
          but.style.width = "100%";
          but.style.height = "50px";

          li.style.paddingTop = "20px";

        let sp = document.createElement("span");
        sp.innerHTML = "SUBMIT POLL";

        but.appendChild(sp);

        li.appendChild(but);

        Body.appendChild(li2);
        Body.appendChild(li);
        
          
          dat.appendChild(Title);
          dat.appendChild(Body);
          Poll.appendChild(dat);
          
          
          

          but.addEventListener('click',() => this.evaluate(myId,poll));
          
          

        }

        gopoll(poll,calen){
         
          // var data = {
          //   poll:poll,
          //   calen:calen
          // }

          // let form = document.createElement('form');
          // form.method= 'POST'
          // var stuff2 = document.createElement("input"); 
          // stuff2.value = data;
          // stuff2.name = "myData";

          // form.appendChild(stuff2);
          // var formplace=document.getElementById("tempform");

          // console.log(data);
          // formplace.appendChild(form);
          // //form.submit();

          var data = {
            polls:poll,
            calen:calen
          }

          console.log(data);
          window.localStorage.setItem("frompoll", JSON.stringify(data));
          document.location.href = "/profile/mypoll";

        }




        evaluate(id,poll){

          for(var i=0;i<poll.polls.length;i++)
          {
            let tid = id+i;
            var a = document.getElementById(tid);
             if(a.checked)
             {
               poll.polls[i].vote = poll.polls[i].vote +1;
             }
          }
          poll.voters ++;

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
          
          console.log(poll);
          
          let form = document.createElement('form');
          form.method= 'POST'
          var stuff2 = document.createElement("input"); 
          stuff2.value = JSON.stringify(poll);
          stuff2.name = "myData";

          form.appendChild(stuff2);
          var formplace=document.getElementById("tempform");

          //console.log(finalpoll);
          formplace.appendChild(form);
          form.submit();
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


window.addEventListener("DOMContentLoaded",function() {
// var pollsArr = []; // Backend poll data eşitle

//  var data = {"pollid":"ljh","votercount":7,"voters":0,"polls":[{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-22 02:55","end_date":"2020-04-22 03:00","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-24 06:15","end_date":"2020-04-24 06:20","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-23 08:00","end_date":"2020-04-23 08:05","vote":0}]};
//  var data2 = {"pollid":"lljh","votercount":7,"voters":0,"polls":[{"title":"This is a ","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-22 02:55","end_date":"2020-04-22 03:00","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-24 06:15","end_date":"2020-04-24 06:20","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-23 08:00","end_date":"2020-04-23 08:05","vote":0}]};
 
//  var calen =  [
//   {"start_date": "2020-04-09 00:00:00", "end_date": "2020-04-010 08:00:00", "text": "French Open"} , 
//   { "id": "4", "start_date": "2020-05-11 10:40:00", "end_date": "2020-04-010 08:00:00", "text": " CS305 Online - Monday Lectures", "details": ""} , 
//   { "id": "5", "start_date": "2020-05-11 15:40:00+03:00", "end_date": "2020-05-11 16:40:00+03:00", "text": " CS 308 Lectures (UPDATED)", "details": ""} , 
//   { "id": "6", "start_date": "2020-05-12 16:40:00+03:00", "end_date": "2020-05-12 17:40:00+03:00", "text": " CS 308 Lectures (UPDATED)", "details": ""} , 
//   { "id": "3", "start_date": "2019-04-02 10:00:00", "end_date": "2019-04-02 08:00:00", "text": "French Open", "details": "Philippe-Chatrier Court\n Paris, FRA"}  ];


//  pollsArr.push(data);
//  pollsArr.push(data2);

  var pollsArr = document.getElementById("accordio").getAttribute("pollsArr");
  var idArr = document.getElementById("accordio").getAttribute("idArr");
  var calen = document.getElementById("accordio").getAttribute("calender");
  console.log(calen);
  console.log(typeof(calen));
  console.log(pollsArr);
  console.log(pollsArr[0]);
  pollsArr = JSON.parse(pollsArr);
  console.log(pollsArr);
  console.log(pollsArr[0]);


  


  var Poll = document.createElement("ul");
  Poll.id = "mettmejim";
  Poll.classList.add("collapsible");
  Poll.classList.add("expandable"); 
  
  if(pollsArr && pollsArr[0] != ""){
  for(var i=0; i<pollsArr.length;i++){
     new meet(pollsArr[i], Poll, calen, idArr[i]);
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