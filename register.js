let btn = document.getElementById("btn");
btn.addEventListener("click", function (event) {
  if (!event.target.form.checkValidity()) {
    return;
  }
  event.preventDefault();
  addUser();
});
function addUser() {
  var xhttp = new XMLHttpRequest();
  let spinner = document.getElementById("spinner");
  let d = document.getElementById("details");
  spinner.style.display = "block";
  d.style.opacity = "0.5";

  xhttp.onreadystatechange = function () {
 
    if (this.readyState == 4) {
      if (this.status == 200) {
        console.log(this.responseText);
        spinner.style.display = "none";
        d.style.opacity = "1";
        alert("User added sucessfully");
        window.location.href = "login.html";
      }  else {
          // Other errors: Display a generic error message
          alert("Email already present ");
          spinner.style.display = "none";
          d.style.opacity = "1"
      
         
      }
  }
  };
  xhttp.open(
    "POST",
    "http://localhost:8080/register",
    true
  );
  xhttp.setRequestHeader("Content-type", "application/json");
  var user = [
    document.getElementById("name").value,
    document.getElementById("age").value,
    document.getElementById("email").value,
    document.getElementById("password").value,
   ];
   console.log(user)
  xhttp.send(JSON.stringify(user));
}
