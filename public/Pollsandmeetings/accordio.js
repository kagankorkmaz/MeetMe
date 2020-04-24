



class meet {

  constructor(pol, Poll, id) {
    this.createpoll(pol, Poll, id);
  }

  createpoll(poll, Poll, id) {

    let dat = document.createElement("li");
    let Title = document.createElement("div");
    Title.classList.add("collapsible-header");
    dat.id = id; // Burasi Pollun idsi



    Title.innerHTML = "<i class=" + "material-icons" + " style=" + "color:#e020ee;" + " >poll</i>" + poll.polls[0].title;

    console.log(Title);;

    let Body = document.createElement("div");
    Body.classList.add("collapsible-body");

    let Desc = document.createElement("h6");
    let Dd = document.createElement("h5");
    Dd.innerHTML = "Description: ";
    Dd.style.fontFamily = "Raleway-Bold";

    Dd.style.color = "#e020ee";
    Desc.innerHTML = poll.polls[0].description;
    Desc.style.paddingTop = "10px";
    Desc.style.paddingBottom = "10px";

    let att = document.createElement("h5");
    att.innerHTML = "Attendees: ";
    att.style.fontFamily = "Raleway-Bold";

    att.style.color = "#e020ee";


    Body.appendChild(Dd);
    Body.appendChild(Desc);
    Body.appendChild(att);

    for (var i = 0; i < poll.polls[0].attendees.length; i++) {
      let attendee = document.createElement("p");
      attendee.innerHTML = poll.polls[0].attendees[i];
      attendee.style.paddingTop = "5px";

      Body.appendChild(attendee);
    }

    let Ti = document.createElement("h5");
    Ti.style.color = "#e020ee";
    Ti.style.paddingTop = "10px";
    Ti.style.paddingBottom = "10px";
    Ti.innerHTML = "Possible Times";
    Ti.style.fontFamily = "Raleway-Bold";

    Body.appendChild(Ti);

    for (var i = 0; i < poll.polls.length; i++) {
      let lab = document.createElement("label");
      let stt = document.createElement("input");
      stt.id = id + i;
      stt.type = "checkbox";
      let span = document.createElement("span");
      span.innerHTML = poll.polls[i].start_date + " -- " + poll.polls[i].end_date;
      span.style.fontFamily = "Roboto";
      span.style.fontWeight = "bold";

      lab.appendChild(stt);
      lab.appendChild(span);

      Body.appendChild(lab);
    }

    let li = document.createElement("li");
    let but = document.createElement("button");
    but.classList.add("contact100");
    but.style.width = "100%";
    but.style.height = "50px";

    li.style.paddingTop = "20px";

    let sp = document.createElement("span");
    sp.innerHTML = "SUBMIT POLL";

    but.appendChild(sp);

    li.appendChild(but);

    Body.appendChild(li);


    dat.appendChild(Title);
    dat.appendChild(Body);
    Poll.appendChild(dat);



    but.addEventListener('click', () => this.evaluate(id, poll));



  }





  evaluate(id, poll) {
    var x = 0;
    for (var i = 0; i < poll.polls.length; i++) {
      let tid = id + i;
      var a = document.getElementById(tid);
      if (a.checked) {
        x = 1;
        poll.polls[i].vote = poll.polls[i].vote + 1;
      }
    }

    if (x == 0) {
      alert("You have to set at least 1 vote.")
    }

    else {
      poll.voters++;

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
      form.method = 'POST'
      var stuff2 = document.createElement("input");
      //stuff2.value = poll;
      stuff2.value = JSON.stringify(poll);
      stuff2.name = "myData";

      form.appendChild(stuff2);
      var formplace = document.getElementById("tempform");

    
      formplace.appendChild(form);
      form.submit();
    }

  }

}

window.addEventListener("DOMContentLoaded", function () {

  // var data = {"pollid":"ljh","votercount":7,"voters":0,"polls":[{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-22 02:55","end_date":"2020-04-22 03:00","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-24 06:15","end_date":"2020-04-24 06:20","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-23 08:00","end_date":"2020-04-23 08:05","vote":0}]};
  // var data2 = {"pollid":"lljh","votercount":7,"voters":0,"polls":[{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-22 02:55","end_date":"2020-04-22 03:00","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-24 06:15","end_date":"2020-04-24 06:20","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-23 08:00","end_date":"2020-04-23 08:05","vote":0}]};
  // tmp.push(data);
  // tmp.push(data2);


  var pollsArr = document.getElementById("accordio").getAttribute("pollsArr");
  var idArr = document.getElementById("accordio").getAttribute("idArr");

  pollsArr = JSON.parse(pollsArr);

  console.log(pollsArr);
  console.log(pollsArr[0].polls);
  console.log(typeof (pollsArr[0]));
  console.log("heyo");

  var tmp = pollsArr; // Backend poll data eşitle

  var Poll = document.createElement("ul");
  Poll.classList.add("collapsible");
  Poll.classList.add("expandable");

  for (var i = 0; i < tmp.length; i++) {
    new meet(tmp[i], Poll, idArr[i]);
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