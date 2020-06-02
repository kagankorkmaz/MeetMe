function timeCheck(date){
  if(Date.parse(date) < Date.now()){
    return false;
  }
  return true;
}


window.addEventListener("DOMContentLoaded", function () {
  scheduler.config.lightbox.sections=[
  {name:"time", height:72, type:"time", map_to:"auto"}
];
  scheduler.init('scheduler_here', new Date(), "week");
  var Json_array;
  


  // var title = document.getElementById("calenmeet2").getAttribute("title");
  // var desc = document.getElementById("calenmeet2").getAttribute("desc");
  var busyTimes = document.getElementById("calenmeet2").getAttribute("busyTimes");
  // var mails = document.getElementById("calenmeet2").getAttribute("mails");

  let Title = document.getElementById("calenmeet2").getAttribute("title");
  let desc =  document.getElementById("calenmeet2").getAttribute("desc");
  let mails = document.getElementById("calenmeet2").getAttribute("mails");
  mails = JSON.parse(mails);
  let size = mails.length;
  let medium = document.getElementById("calenmeet2").getAttribute("medium");
  let location = document.getElementById("calenmeet2").getAttribute("location");
  let recur = document.getElementById("calenmeet2").getAttribute("recurance");
  let email = document.getElementById("calenmeet2").getAttribute("host");
  let link = document.getElementById("calenmeet2").getAttribute("link")

  

  Json_array = JSON.parse(busyTimes);  // Take as input from backend as the total busy times for the attendees 
  for (i = 0; i < Json_array.length; i++) {


    var stt = Json_array[i].start_date; // the start time for an event should be named startTime, with format 2020-04-09 00:00:00 --:> Date Time
    var endd = Json_array[i].end_date; // the start time for an event should be named endTime, with format 2020-04-09 00:00:00 --:> Date Time

    scheduler.addMarkedTimespan({ //blocks section on scheduler

      start_date: new Date(stt),
      end_date: new Date(endd),

      css: "gray_section",
      type: "dhx_time_block"
    });
  }

  scheduler.updateView();

;

  var reply_click = function()
  {
    var json_string = scheduler.toJSON();
    let Json_st = JSON.parse(json_string);
    POll = [];
    var meeting;
    var myBool = true;
    for(i=0;i<Json_st.length;i++)   //create a meeting for eact input
    {

      if(timeCheck(Json_st[i].start_date)){
        meeting ={
          title: Title , 
          description: desc, 
          mails: mails,
          medium: medium,
          location: location, 
          link: link,
          recurance: recur,
          host: email, // users email
          start_date: Json_st[i].start_date,
          end_date: Json_st[i].end_date,
          vote: 0
         }
  
        POll.push(meeting);
      }

      else{
        alert("You are not a time traveller, you can not create meetings in the past");
        myBool = false;
      }
     


    }

      if(myBool){
        var finalpoll = {votercount: size, voters: 0, polls: POll, created: new Date().toString(), dummyBool: "2"}; //final poll information

        let form = document.createElement('form');
        form.method= 'POST'
        var stuff2 = document.createElement("input"); 
        
        
        if (finalpoll.polls.length <= 1) {
          alert("You have to choose at least 2 time slots.");
        }

        else {
          stuff2.value = JSON.stringify(finalpoll);
          //stuff2.value = finalpoll;
          stuff2.name = "myData";
          form.appendChild(stuff2);

          var formplace = document.getElementById("tempform");

          
          console.log(finalpoll);
          
          formplace.appendChild(form);
          form.submit();
        }
      }

      else{
        console.log("TIME TRAVEL ERROR");
      }
    

    
    
  }

  document.getElementById('crpol').onclick = reply_click;



});