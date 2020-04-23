window.addEventListener("DOMContentLoaded", function () {
  scheduler.config.lightbox.sections = [
    { name: "time", height: 72, type: "time", map_to: "auto" }
  ];
  scheduler.init('scheduler_here', new Date(), "week");
  var Json_array;
  let input = { id: "ljh", title: "This is a meeting", description: "its desc", attendees: ["mails", "mm", "jjj", "kjhkh", "ll", "lkjoıj", "klkj"] }; //take as input from backend as meeting title etc

  var title = document.getElementById("calenmeet2").getAttribute("title");
  var desc = document.getElementById("calenmeet2").getAttribute("desc");
  var busyTimes = document.getElementById("calenmeet2").getAttribute("busyTimes");
  var mails = document.getElementById("calenmeet2").getAttribute("mails");
  
  console.log(typeof(mails));
  mails = JSON.parse(mails);

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

  
  console.log(title);
  console.log(desc);
  console.log(busyTimes);
  console.log(mails);


  let Title = title;
  let Description = desc;
  let size = mails.length;

  var reply_click = function () {
    var json_string = scheduler.toJSON();
    let Json_st = JSON.parse(json_string);
    POll = [];
    var meeting;
    for (i = 0; i < Json_st.length; i++)   //create a meeting for eact input
    {
      meeting = {
        title: Title,
        description: Description,
        attendees: mails,
        start_date: Json_st[i].start_date,
        end_date: Json_st[i].end_date,
        vote: 0,
      };

      POll.push(meeting);


    }
    //var finalpoll = { pollid: input.id, votercount: size, voters: 0, polls: POll, dummyBool:"2"}; //final poll information
    var finalpoll = {votercount: size, voters: 0, polls: POll, dummyBool:"2"}; //final poll information


    let form = document.createElement('form');
    form.method = 'POST'
    var stuff2 = document.createElement("input");
    stuff2.value = JSON.stringify(finalpoll);
    //stuff2.value = finalpoll;
    stuff2.name = "myData";
    form.appendChild(stuff2);

    var formplace = document.getElementById("tempform");

    console.log(finalpoll);
    formplace.appendChild(form);
    form.submit();



  }

  document.getElementById('crpol').onclick = reply_click;



});