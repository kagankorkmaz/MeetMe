window.addEventListener("DOMContentLoaded", function () {
  scheduler.config.lightbox.sections = [
    { name: "description", height: 72, map_to: "text", type: "textarea", focus: true },
    { name: "time", height: 72, type: "time", map_to: "auto" }
  ];
  scheduler.init('scheduler_here', new Date(), "week");

  var calender = document.getElementById("calen").getAttribute("data-name2");

  var calenderID = document.getElementById("calenderID");

  //var data = [{ "id": "2", "start_date": "2020-04-14 00:00:00", "end_date": "2020-04-014 08:00:00", "text": "French Open", "details": "Philippe-Chatrier Court\n Paris, FRA" }, { "id": "3", "start_date": "2019-04-02 10:00:00", "end_date": "2019-04-02 08:00:00", "text": "French Open", "details": "Philippe-Chatrier Court\n Paris, FRA" }]
  //var data2 = <%-JSON.stringify(user.calender)%>;

  scheduler.parse(calender);

  var reply = function () {
    var json_string = scheduler.toJSON();
    //console.log(json_string);
    let Json_st = JSON.parse(json_string);
    var afterLoop = [];

    for (var i = 0; i < Json_st.length; i++) {
      var a = { "start_date": Json_st[i].start_date, "end_date": Json_st[i].end_date, "text": Json_st[i].text }
      afterLoop.push(a);
    }


    //alert(afterLoop);
    //console.log("heyoo");
    //console.log(Json_st);
    //calenderID.value = json_string;
    calenderID.value = JSON.stringify(afterLoop);
  }

  document.getElementById('crpol').onclick = reply

});