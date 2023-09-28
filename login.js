let btn = document.getElementById("btn");
btn.addEventListener("click", function (event) {
  if (!event.target.form.checkValidity()) {
    return;
  }
  event.preventDefault();
  authUser();
});
function authUser() {
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
          var data = JSON.parse(this.responseText)
          console.log(data.user)
          const url = "http://localhost:8080/UI/index_widgets_chat.html?id=" + data.user.id;
          console.log(url)
          alert("User Login successfully");
          
         
          window.location.href = url;
      } else if (this.status == 401) {
          // Unauthorized: Display an error message
          console.log("Login failed. Unauthorized");
          alert("Login failed. Please check your email and password.");
          spinner.style.display = "none";
          d.style.opacity = "1";
      } else {
          // Other errors: Display a generic error message
          console.log("Login failed. An error occurred.");
          alert("Login failed. An error occurred. Please try again later.");
          spinner.style.display = "none";
          d.style.opacity = "1";
      }
  }
  };
  xhttp.open(
    "POST",
    "http://localhost:8080/login",
    true
  );
  xhttp.setRequestHeader("Content-type", "application/json");
  var user = [
    document.getElementById("email").value,
    document.getElementById("password").value,
   ];
  console.log(user)
  xhttp.send(JSON.stringify(user));
}
