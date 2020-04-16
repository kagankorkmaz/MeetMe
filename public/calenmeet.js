
var inputt = document.getElementById("emails");
      

var mails =[];
var index;

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
    
    let editButton = document.createElement('button');
    editButton.classList.add('editButton');
    editButton.classList.add('contact100');
    // editButton.style.add('width: 20%; float: right;');
    editButton.style.width = '10%';
    editButton.style.float = 'right';
    editButton.innerHTML = "edit";

  

    let removeButton = document.createElement('button');
    removeButton.classList.add('removeButton');
    removeButton.classList.add('contact100');
    //removeButton.style.add('width: 20%; float: right;');
    removeButton.style.width = '10%';
    removeButton.style.float = 'right';
    removeButton.innerHTML = "remove";

    
    document.getElementById("cont").appendChild(itembox);
    itembox.appendChild(input);
    itembox.appendChild(editButton);
    itembox.appendChild(removeButton);

    editButton.addEventListener('click',() => this.edit(input,editButton));
    removeButton.addEventListener('click', () => this.remove(itembox,input));

  }


  edit(input,editButton){
    input.disabled = !input.disabled;
    

    if(editButton.innerHTML == "edit"){
    index = mails.indexOf(input.value);
    editButton.innerHTML = "confirm";
    }
    else{
    editButton.innerHTML = "edit";
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

function moveon(){  // Bu fonksiyon da dataları toplaman lazım !!
  var mailler = mails; // tüm mailler
  var Title = document.getElementById("title").value; // Meeting Title
  var desc = document.getElementById("description").value; // Meeting Description

  if(!Title){alert("Cannot Submit without title"); return;}
  if(!desc){alert("Description is mandatory"); return;}
  if(mails.length < 1){alert("You need AT LEAST one attendee"); return;}

  var stuff = {title: Title, decription: desc, mails:mailler}
  console.log(stuff);
  console.log(JSON.stringify(stuff));

  var stuff2 = {title : "alex", description: "de souza"};
  options = {
    method : 'POST',
    redirect: 'follow',
    body: JSON.stringify(stuff),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  fetch('/profile/addcalender', options);
  
}

addbutt.addEventListener('click', check);

var cot = document.getElementById("nextstp");

cot.addEventListener('click' , moveon);





