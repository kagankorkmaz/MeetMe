
var inputt = document.getElementById("emails");
      

var mails =[];
var index;
var jim = false;


class item{

  constructor(itemname){
    this.createDiv(itemname);
  }

  createDiv(itemname) {

    
    let input = document.createElement('input');
    input.value = itemname;
    input.disabled = true;
    input.classList.add('item_input');
    input.type = "text";

    let itembox = document.createElement('div');
    itembox.classList.add('item');
    itembox.style.paddingTop = '20px';
    
    let editButton = document.createElement('a');
    let ed = document.createElement("i");
    ed.classList.add('material-icons');
    ed.classList.add('right');
    ed.innerHTML = "edit";
    editButton.classList.add('editButton');
    editButton.classList.add('waves-effect');
    editButton.classList.add('waves-light');
    editButton.classList.add('btn-small');
    // editButton.style.add('width: 20%; float: right;');
    editButton.style.float = 'right';
    editButton.style.color = 'white';
    editButton.innerHTML = "edit";
    editButton.appendChild(ed); 

    

  

    let removeButton = document.createElement('a');
    let rem = document.createElement("i");
    rem.classList.add('material-icons');
    rem.classList.add('right');
    rem.innerHTML = "delete";
    removeButton.classList.add('removeButton');
    removeButton.classList.add('waves-effect');
    removeButton.classList.add('waves-light');
    removeButton.classList.add('btn-small');
    //removeButton.style.add('width: 20%; float: right;');
    removeButton.style.float = 'right';
    removeButton.style.color = 'white';
    removeButton.innerHTML = "remove"
    removeButton.appendChild(rem); 
    removeButton.style.marginRight = "10px"

    
    document.getElementById("cont").appendChild(itembox);
    itembox.appendChild(input);
    itembox.appendChild(editButton);
    itembox.appendChild(removeButton);

    editButton.addEventListener('click',() => this.edit(input,ed,editButton));
    removeButton.addEventListener('click', () => this.remove(itembox,input));

  }


  edit(input,editButton,ed){
    input.disabled = !input.disabled;
    

    if(editButton.innerHTML == "edit"){
    index = mails.indexOf(input.value);
    editButton.innerHTML = "confirm";
    ed.innerHTML = "confirm";
    }
    else{
    editButton.innerHTML = "edit";
    ed.innerHTML = "edit";
    mails[index]= input.value;
    
    }
  }

  remove(item,input){
    document.getElementById("cont").removeChild(item);
    let pos = mails.indexOf(input.value);
    mails.splice(pos,1);

   
  }

}

const addbutt = document.getElementById("add");
if(addbutt.disabled)
{addbutt.disabled = !addbutt.disabled;}

function check(){
  if(inputt.value != ""){
    new item(inputt.value);    
    mails.push(inputt.value);
    inputt.value = "";

  }

}


function initialize() {
  var input = document.getElementById('searchTextField');
  new google.maps.places.Autocomplete(input);
}



function moveon(){  // Bu fonksiyon da dataları toplaman lazım !!
  
  var mailler = mails; // tüm mailler
  var Title = document.getElementById("title").value; // Meeting Title
  var desc = document.getElementById("description").value; // Meeting Description
  var recur = document.getElementById("recurring"); // Meeting Description
  var location; // location of event
  var link;  // link if online
  var email = document.getElementById("calenmeet").getAttribute("data-name"); 
  console.log(email);
  var medium;

  if(!Title){alert("Cannot Submit without title"); return;}
  if(!desc){alert("Description is mandatory"); return;}
  if($('#select1').val() == "1"){ location = document.getElementById("searchTextField").value; link = ""; medium="Offline"}
  else if($('#select1').val() == "2"){ location = document.getElementById("autocomplete-input").value; link = document.getElementById("link").value; medium="Online";}
  else{alert("Please Choose a meeting Medium");  return;}

  if(recur.checked){
    if(document.getElementById("DailyDaily").checked){recur = "daily";}
    else if(document.getElementById("WeeklyWeekly").checked){recur = "weekly";}
    else if(document.getElementById("MonthlyMonthly").checked){recur = "monthly";}
    else{recur = "yearly";}
  }
  else{
    recur = "single";
  }
  if(mails.length < 1){alert("You need AT LEAST one attendee"); return;}


    let form = document.createElement('form');
    form.method= 'POST'
    var stuff2 = document.createElement("input"); 
    stuff2.name = 'myData';

    stuff = { 
              MTitle: Title , 
              MDesc: desc, 
              Mails: mails,
              medium:medium,
              location: location, 
              link: link,
              recurance: recur,
              host: email,
              dummyBool:"1"
             }

    stuff2.value=JSON.stringify(stuff);
    
    console.log(stuff);
    form.appendChild(stuff2);
    
    cot.appendChild(form);

    form.submit();
    

  

  
}

function createradio(span,parent)
{
  

  var enc = document.createElement("p");
  enc.id = span;
  var label1 = document.createElement("label");
  var inp = document.createElement("input");
  inp.id = span+span;
  inp.name = "group1";
  inp.type ="radio";
  inp.setAttribute("checked","");
  var spann = document.createElement("span");
  spann.innerHTML = span;

  label1.appendChild(inp);
  label1.appendChild(spann);
  enc.appendChild(label1);
  parent.appendChild(enc);
}

function recurring(checkbox){
  //If it is checked.
  if(checkbox.checked){
    var parent = document.getElementById("recurrplace");
    createradio("Daily",parent);
    createradio("Weekly",parent);
    createradio("Monthly",parent);
    createradio("Yearly",parent);
    
  }
  //If it has been unchecked.
  else{

    var offline = document.getElementById("Daily");
    var offline2 = document.getElementById("Weekly");
    var offline3 = document.getElementById("Monthly");
    var offline4 = document.getElementById("Yearly");


    if(offline)
    {
      offline.parentNode.removeChild(offline);
      offline2.parentNode.removeChild(offline2);
      offline3.parentNode.removeChild(offline3);
      offline4.parentNode.removeChild(offline4);

    }

  }
}

function loadScript() {
  var script = document.createElement("script");
  console.log("success");
  script.id = "googleapi";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBrfskxC-brmWFedSnCdrbLuiuurP8Vvsk&libraries=places";
  document.body.appendChild(script);
  //google.maps.event.addDomListener(window, 'load', initialize);

}

addbutt.addEventListener('click', check);
var cot = document.getElementById("nextstp");

cot.addEventListener('click' , moveon);

document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('select');
  var options = document.querySelectorAll('option');
  var instances = M.FormSelect.init(elems, options);
  $("#select1").on('change', function() {
    
    console.log($(this).val());
    var choice = $(this).val();
    
    var placeit = document.getElementById("choicestuff");
    
    if(choice == "1")
    {
      var offline = document.getElementById("online");
      var ggl = document.getElementById("online2");

      if(offline)
      {
        offline.parentNode.removeChild(offline);
        ggl.parentNode.removeChild(ggl);

      }

      var loc = document.createElement("div");
      loc.classList.add("input-field");
      loc.classList.add("col");
      loc.classList.add("s12");
      loc.id = "irl";

      var ii = document.createElement("i");
      ii.classList.add("material-icons");
      ii.classList.add("prefix");
      ii.innerHTML = "location_on";

      loc.appendChild(ii);

      var innput = document.createElement("input");
      innput.id = "searchTextField";
      innput.type = "text";
      innput.size = "50";

      loc.appendChild(innput);
      placeit.appendChild(loc);
      loadScript();

    }
    else if(choice == "2")
    {
      var offline = document.getElementById("irl");
      var ggl = document.getElementById("googleapi");

      if(offline)
      {
        offline.parentNode.removeChild(offline);
        ggl.parentNode.removeChild(ggl);

      }

      var loc = document.createElement("div");
      loc.classList.add("input-field");
      loc.classList.add("col");
      loc.classList.add("s12");
      loc.id = "online";

      var ii = document.createElement("i");
      ii.classList.add("material-icons");
      ii.classList.add("prefix");
      ii.innerHTML = "computer";

      loc.appendChild(ii);

      var innput = document.createElement("input");
      innput.id = "autocomplete-input";
      innput.type = "text";
      innput.classList.add("autocomplete");

      var laber = document.createElement("label");
      laber.setAttribute("for","autocomplete-input");
      laber.innerHTML = "Enter the App name";
      console.log(laber);
      loc.appendChild(innput);
      loc.appendChild(laber);
      placeit.appendChild(loc);


      $('input.autocomplete').autocomplete({
        data: {
          "Zoom": null,
          "Hangouts": null,
          "Discord": null,
          "Google Meet": null,        
          "Skype": null,        
        },
      });
      
      var loc2 = document.createElement("div");
      loc2.classList.add("input-field");
      loc2.classList.add("col");
      loc2.classList.add("s12");
      loc2.id = "online2";

      var ii2 = document.createElement("i");
      ii2.classList.add("material-icons");
      ii2.classList.add("prefix");
      ii2.innerHTML = "insert_link";

      loc2.appendChild(ii2);

      var innput2 = document.createElement("input");
      innput2.id = "link";
      innput2.type = "text";

      var laber2 = document.createElement("label");
      laber2.setAttribute("for","link");
      laber2.innerHTML = "Enter the link of the meeting";
      console.log(laber2);
      loc2.appendChild(innput2);
      loc2.appendChild(laber2);
      placeit.appendChild(loc2);

    }
     


});



 
});



