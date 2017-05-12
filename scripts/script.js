// const buttons = document.getElementsByClassName('buttons');

// for (let i = 0; i < buttons.length; i++) {
//   buttons[i].addEventListener("mouseover", function() {
//     buttons[i].style.backgroundColor = "black";
//   })
// }

// for (let i = 0; i < buttons.length; i++) {
//   buttons[i].addEventListener("mouseout", function() {
//     buttons[i].style.backgroundColor = "white";
//   })
// }



$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').focus()
})