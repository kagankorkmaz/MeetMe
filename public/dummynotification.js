
window.addEventListener("DOMContentLoaded", function () {
    var input = window.localStorage.getItem("notification");
    input = JSON.parse(input); // the input format

    window.localStorage.removeItem("notification");

    console.log(input);

    let form = document.createElement('form');
          form.method= 'POST'
          var stuff2 = document.createElement("input"); 
          stuff2.value = JSON.stringify(input);
          stuff2.name = "myData";

          form.appendChild(stuff2);
          var formplace=document.getElementById("formplace");

            console.log(stuff2.value);
          formplace.appendChild(form);
          form.submit()

});