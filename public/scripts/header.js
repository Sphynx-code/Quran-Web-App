document.addEventListener("DOMContentLoaded",()=>{
    // define variables
let changeThemeBtn = document.querySelector(".switch-div input[type='checkbox']");
let navBar = document.querySelector(".navbar");
let mainTextDiv = document.querySelector(".mainText");
// to persist the color chnage when the page reloads
 window.onload = function(){
    //if color theme exists
     if(localStorage.getItem("colorTheme")){
        // if color theme is yellow
         if(localStorage.getItem("colorTheme")=="#ffd803"){
             navBar.classList.remove("navbar-color-changed");
             // then add the yellow class
             navBar.classList.add("navbar-color-default");
             mainTextDiv.classList.remove("mainText-changed");
             mainTextDiv.classList.add("mainText-default");
             changeThemeBtn.checked = false;
         } 
         // if color theme is orange 
         else if(localStorage.getItem("colorTheme") == "#ff8906"){
             navBar.classList.remove("navbar-color-default");
             // add orange class
             navBar.classList.add("navbar-color-changed");
             document.body.classList.add("body-color-changed");
             mainTextDiv.classList.remove("mainText-default");
             mainTextDiv.classList.add("mainText-changed");
             changeThemeBtn.checked = true;
         }
    }
 }
changeThemeBtn.addEventListener("change", () => {
  if (changeThemeBtn.checked){
    navBar.classList.remove("navbar-color-default");
    navBar.classList.add("navbar-color-changed");
    document.body.classList.add("body-color-changed");
    mainTextDiv.classList.remove("mainText-default");
    mainTextDiv.classList.add("mainText-changed");
    localStorage.setItem("colorTheme", "#ff8906");
  }
  else{
    navBar.classList.remove("navbar-color-changed");
    navBar.classList.add("navbar-color-default");
    localStorage.setItem("colorTheme", "#ffd803");
    document.body.classList.remove("body-color-changed");
    mainTextDiv.classList.remove("mainText-changed");
    mainTextDiv.classList.add("mainText-default");
  }
});


})
