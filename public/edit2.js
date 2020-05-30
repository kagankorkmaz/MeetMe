




window.addEventListener("DOMContentLoaded", function () {
  scheduler.config.lightbox.sections=[
  {name:"time", height:72, type:"time", map_to:"auto"}
];
  var Json_array;
  let input = { data: {"title":"This is a meeting",
                        "description":"its desc",
                        "mails":["mails","mm","jjj","kjhkh","ll","lkjoıj","klkj"],
                        "medium":"Offline",
                        "location":"Antalya",
                        "link": "",
                        "recurrence":"single",
                        "start_date":"2020-04-22 02:55",
                        "end_date":"2020-04-22 03:00",
                        "vote":5},  
                  type: "meeting" } //take as input from backend as meeting title etc


  // Json_array= data.slots;  // Take as input from backend as the total busy times for the attendees 
  //         for(i=0;i<Json_array.length;i++)
  //         {
        
      
  //           var stt= Json_array[i].startTime; // the start time for an event should be named startTime, with format 2020-04-09 00:00:00 --:> Date Time
  //           var endd = Json_array[i].endTime; // the start time for an event should be named endTime, with format 2020-04-09 00:00:00 --:> Date Time

  //           scheduler.addMarkedTimespan({ //blocks section on scheduler
            
  //             start_date: new Date(stt),
  //             end_date:new Date(endd),
              
  //             css:   "gray_section",
  //             type:  "dhx_time_block"
  //           });

  //     }



  let Title = "";
  let desc = "";
  let mails ="";
  let size = "";
  let medium = "";
  let location = "";
  let link = "";
  let recur = "";
  let email = ""; 
  
  if(input.type=="meeting"){

  scheduler.init('scheduler_here', new Date(input.data.start_date), "week");

  Title = input.data.title;
   desc = input.data.description;
   mails = input.data.mails;
   size = input.data.mails.length;
   medium = input.data.medium;
   location = input.data.location;
   link = input.data.link;
   recur = input.data.recurrence;
   email = input.data.host;


   scheduler.addEvent({
    start_date:  input.data.start_date,
    end_date:   input.data.end_date
   });
    

   
  }
  else{

     scheduler.init('scheduler_here', new Date(input.data.polls[0].start_date), "week");

     Title = input.data.polls[0].title;
     desc = input.data.polls[0].description;
     mails = input.data.polls[0].mails;
     size = input.data.polls[0].mails.length;
     medium = input.data.polls[0].medium;
     location = input.data.polls[0].location;
     link = input.data.polls[0].link;
     recur = input.data.polls[0].recurrence;
     email = input.data.polls[0].host;


     for (var i =0;i<input.data.polls.length;i++)
     {
      scheduler.addEvent({
        start_date:  input.data.polls[i].start_date,
        end_date:   input.data.polls[i].end_date
       });
     }
  }

  

  var reply_click = function()
  {
    var json_string = scheduler.toJSON();
    let Json_st = JSON.parse(json_string);
    POll = [];
    var meeting;
    if(input.type == "meeting")
    {
      if( Json_st.length > 1){
      alert("A meeting can only have one scheduled time, to create a poll, please create a new meeting!");
      }
      else{
        meeting ={
          title: Title , 
          description: desc, 
          mails: mails,
          medium: medium,
          location: location, 
          link: link,
          recurrence: recur,
          host: email, // users email
          start_date: Json_st[0].start_date,
          end_date: Json_st[0].end_date,
          vote:0
         } 
      }

      var finalpoll = {data: meeting, type: "meeting"}
    }
    else{
      
      for(i=0;i<Json_st.length;i++)   //create a meeting for eact input
      {
        meeting ={
          title: Title , 
          description: desc, 
          mails: input.mails,
          medium: medium,
          location: location, 
          link: link,
          recurrence: recur,
          host: email, // users email

          start_date: Json_st[i].start_date,
          end_date: Json_st[i].end_date,
          vote:0
         } 
        POll.push(meeting);
  
  
        
      }
      var finalpoll = { data:{ created: new Date() , votercount: size, voters: 0, polls: POll}, type: "poll"}; //final poll information
  
      
    }
    
    let form = document.createElement('form');
    form.method= 'POST'
    var stuff2 = document.createElement("input"); 
    stuff2.value = finalpoll;
    stuff2.name = "myData";
    form.appendChild(stuff2);
    
    var formplace=document.getElementById("tempform");

    console.log(finalpoll);
    formplace.appendChild(form);
    //form.submit();

    
    
  }

  document.getElementById('crpol').onclick = reply_click;



});