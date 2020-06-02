

class mypol{

  constructor(poll){
    this.createpoll(poll);
  }

  createpoll(data)
  {      
        console.log(data);
        var mother = document.getElementById("pollshere");

        let poss = document.createElement("h4");
        poss.style.marginLeft = "90px";
        poss.style.marginTop = "150px";
        poss.innerHTML = "Poll Options";
        mother.appendChild(poss);


        for(var i=0;i<data.polls.length;i++)
        {
          let div = document.createElement("div");
          let lab = document.createElement("label");
          let stt = document.createElement("input");
          stt.id =  data._id + i;
          stt.type = "checkbox";
          let span = document.createElement("span");
          span.innerHTML =  "Option" + i;
          span.style.fontFamily = "Roboto";
          span.style.fontWeight = "bold";
          span.style.fontSize = "20px";
          span.style.marginLeft = "120px";
          span.style.marginTop = "15px";
        
        
          
          lab.appendChild(stt);
          lab.appendChild(span);
          div.append(lab);

          mother.appendChild(div);

        }

        let li = document.createElement("li");
        let but = document.createElement("button");
        but.classList.add("login100-form-btn");
        but.style.width = "100%";
        but.style.height = "50px";

        li.style.paddingTop = "20px";
        li.style.paddingLeft = "20%";

      let sp = document.createElement("span");
      sp.innerHTML = "SUBMIT POLL";
      but.addEventListener('click',() => this.evaluate(data._id,data));
       
      but.appendChild(sp);

      li.appendChild(but);

      mother.appendChild(li);

  }


  evaluate(id,poll){
    var check = 0;
    for(var i=0;i<poll.polls.length;i++)
    {
      let tid = id+i;
      var a = document.getElementById(tid);
      console.log(a.checked);
      
       if(a.checked)
       {
         poll.polls[i].vote = poll.polls[i].vote +1;
         check = check + 1;
         console.log(check);
       }
    }

    if(check == 0)
    { alert("You need to choose at least one option!");}
    else{
    poll.voters ++;
    
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


 }

 window.addEventListener("DOMContentLoaded", function () {
        
        scheduler.config.readonly = true;
        scheduler.config.readonly_form = true;
        //var data = {"pollid":"ljh","votercount":7,"voters":0,"polls":[{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-22 02:55","end_date":"2020-04-22 03:00","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-24 06:15","end_date":"2020-04-24 06:20","vote":0},{"title":"This is a meeting","description":"its desc","attendees":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],"start_date":"2020-04-23 08:00","end_date":"2020-04-23 08:05","vote":0}]};
        var data = window.localStorage.getItem("frompoll"); data = JSON.parse(data); window.localStorage.removeItem("frompoll");
        console.log(data); //OBJE olarak
        var mydate = new Date(data.polls.polls[0].start_date);
        console.log(mydate);
        scheduler.init('scheduler_here', new Date(mydate), "week");
        
        var stuff = [];
        if(data && data.calen){stuff = JSON.parse(data.calen);}
        console.log(stuff);
        data = data.polls
        for(var i=0;i< stuff.length;i++){

          stuff[i]["color"] = "gray";
          scheduler.addEvent(stuff[i]);
        }           
          for(var i=0;i<data.polls.length;i++){
            scheduler.addEvent({text: "Option " + i , start_date :data.polls[i].start_date, end_date: data.polls[i].end_date } );
          }

          new mypol(data);

         


        


       
        
       
        // scheduler.attachEvent("onAfterLightbox", function (){
        //      currcal = scheduler.toJSON();
        //      let Json_st = JSON.parse(currcal);
          
        //   console.log(Json_st);
        //  });
        
       
        
        // $.ajax({
        //   url: 'events.json',
        //   dataType: 'json',
        //   type: 'get',
        //   cache: false,
        //   success: function (data) {

        //     scheduler.parse(data);
        //   }
        // });
      });
    