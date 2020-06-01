
      window.addEventListener("DOMContentLoaded", function () {

        var priorities = [
          {key:"single", label:"Do not repeat"},
          {key:"daily", label:"Each day"},
          {key:"weekly", label:"Each week"},
          {key:"monthly", label:"Each month"}
          ];


        scheduler.config.lightbox.sections=[
        {name:"Title", height:30, map_to:"text", type:"textarea",focus:true},
        {name:"Description", height:90, map_to:"description", type:"textarea",focus:true},
       
        {name:"Location", height:30, map_to:"location", type:"textarea"},
        {name:"Link", height:30, map_to:"link", type:"textarea"},
        {name:"Time", height:72, type:"time", map_to:"auto"}
        ];

        var default_box = [
          {name:"Title", height:30, map_to:"text", type:"textarea",focus:true},
          {name:"Description", height:90, map_to:"description", type:"textarea",focus:true},
         
          {name:"Location", height:30, map_to:"location", type:"textarea"},
          {name:"Link", height:30, map_to:"link", type:"textarea"},
          {name:"Time", height:72, type:"time", map_to:"auto"}
          ];

          var meeting_box = [
            {name:"Title", height:30, map_to:"text", type:"textarea",focus:true},
            {name:"Description", height:90, map_to:"description", type:"textarea",focus:true},
            {name:"Host", height:30, map_to:"host", type:"textarea",focus:true},
            {name:"Medium", height:30, map_to:"medium", type:"textarea",focus:true},
            {name:"Recurrence", height:30, map_to:"recurrence", type:"textarea",focus:true},
            {name:"Participants", height:30, map_to:"mails", type:"textarea",focus:true},

            {name:"Location", height:30, map_to:"location", type:"textarea"},
            {name:"Link", height:30, map_to:"link", type:"textarea"},
            {name:"Time", height:72, type:"time", map_to:"auto"}
            ];

            var calender = document.getElementById("calen").getAttribute("data-name2");
            var myMeeting = JSON.parse(document.getElementById("calen").getAttribute("data-name"));
        
        var stuff;
        scheduler.attachEvent("onBeforeLightbox", function(event_id) {
          scheduler.resetLightbox();
          var ev = scheduler.getEvent(event_id);
          var a = myMeeting.meeting.includes(event_id);
          
          

          scheduler.config.lightbox.sections = (a) ?
              meeting_box : default_box;
          return true;
      });

        scheduler.init("scheduler_here",new Date(),"week");

       
        //myUser = JSON.parse(myUser);
        
        console.log(myMeeting.meeting)
        console.log(typeof myMeeting.meeting)
          console.log(calender);
          stuff = JSON.parse(calender);
          console.log(stuff);
          console.log(stuff[1]);

          for(var i = 0; i< stuff.length;i++)
          {
            var title = "";
            var decs = "";
            var medium = "";
            var location = "";
            var link = "";
            var host = "";
            var mails = "";
            var recurrence = "";
            var vote = "";



            if(stuff[i].text)
            {
              title = stuff[i].text;
            }
            else if(stuff[i].title){
              title = stuff[i].title;
            }

            if(stuff[i].description)
            {
              decs = stuff[i].description  ;
            }

            if(stuff[i].medium)
            {
              medium =  stuff[i].medium  ;
            }
            
            if(stuff[i].host)
            {
              host = stuff[i].host ;
            }

            if(stuff[i].mails)
            {
              mails =  stuff[i].mails ;
            }

            if(stuff[i].recurrence)
            {
              recurrence =  stuff[i].recurrence;
            }
            if(stuff[i].location)
            {
              location = stuff[i].location;
            }

            if(stuff[i].link)
            {
              link = stuff[i].link;
            }
            if(stuff[i].vote){
              vote=stuff[i].vote;
            }


            scheduler.addEvent({
              start_date: stuff[i].start_date ,
              end_date:   stuff[i].end_date,
              text:  title,
              id: stuff[i]._id,
              description: decs, // userdata
              host: host,
              mails: mails,
              recurrence: recurrence,
              medium: medium,
              location:   location,    // userdata
              link:   link, 
              vote: vote

             });
          }

          for(let i=0; i< myMeeting.meeting.length; i++){
            scheduler.getEvent(myMeeting.meeting[i]).readonly = true;
            console.log(scheduler.getEvent(myMeeting.meeting[i]));
            console.log(i);
          }

          
        // var data= [
        //   { start_date: '2020-04-20T15:40:00+03:00',
        //   end_date: '2020-04-20T17:30:00+03:00',
        //   text: 'CS 308 Lectures (UPDATED)'} 
        //  ];

        //scheduler.parse(data);
        
        var reply= function()
        {
          var json_string = scheduler.toJSON();
          let Json_st = JSON.parse(json_string);
          
          //console.log(Json_st);
          console.log(stuff);
          var afterLoop = [];
          for (var i = 0; i < Json_st.length; i++) {
            var mails = "";
            if(i<stuff.length){
              if(stuff[i].mails ){
                mails=stuff[i].mails;
              }
            }
           
            var a = { start_date: Json_st[i].start_date, 
             end_date: Json_st[i].end_date, 
             title: Json_st[i].text,
             description: Json_st[i].description,
             _id : Json_st[i].id,
             link : Json_st[i].link,
             location : Json_st[i].location,
             medium: Json_st[i].medium,
             recurrence : Json_st[i].recurrence,
             host: Json_st[i].host,
             mails: mails,
             vote: Json_st[i].vote
            }
            afterLoop.push(a);
            
          }
          console.log(afterLoop);

          let form = document.createElement('form');
          form.method= 'POST'
          var stuff2 = document.createElement("input"); 
          stuff2.value = JSON.stringify(afterLoop);
          stuff2.name = "calender";



          form.appendChild(stuff2);
          var formplace=document.getElementById("tempform");

          
          formplace.appendChild(form);
          form.submit();
        }


        document.getElementById('crpol').onclick = reply
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
    