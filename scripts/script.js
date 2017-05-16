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

let toolbox = {
  "html5_bar": "90%",
  "css3_bar": "90%",
  "javascript_bar": "90%",
  jquery_bar: "90%",
  sass_bar: "75%",
  bootstrap_bar: "90%",
  foundation_bar: "80%",
  reactjs_bar: "75%",
  redux_bar: "70%",
  router_bar: "70%",
  nodejs_bar: "40%",
  webpack_bar: "70%",
  git_bar: "70%",
  yarn_bar: "90%",
  npm_bar: "90%"
};

let progBarFill = () => {
  for (let barVal in toolbox) {
    $(`#${barVal}`).animate(
      {width: toolbox[barVal]},
      1000
    );
  }
};

progBarFill();