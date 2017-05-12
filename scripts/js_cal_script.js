$(function() {
  var $cB = $(".cal_btn");
  var $D = $("#display_text");
  var $sw = $("#switch");
  
  var total = [];
  var curNum = [];
  var chainOp = "";
  var chainNum = "";
  var chainSwitch = true;
  var constSwitch = false;
  var constant = "";
  var constantOp = "";
  
  $("#toggle_switch").on("click", function() {
    if (chainSwitch) {
      constSwitch = true;
      chainSwitch = false;
    } else if (constSwitch) {
      chainSwitch = true;
      constSwitch = false;
    }
    
    if (chainSwitch) {
      $("#toggle_switch").animate({margin: "0 0 0 0"}, 500);
    } else if (constSwitch) {
      $("#toggle_switch").animate({margin: "30px 0 0 0"}, 500);
    }
  });

  function numBuild(num) {
    if (curNum.length <= 8) {
      curNum.push(num);
    }
  }

  function calBuilder() {
    if (curNum.length > 0) {
      total.push(curNum.join(""));
      chainNum = curNum.join("");
    }
  }

  function setOp(o) {
    total.push(o);
    curNum = [];
  }

  function calculate() {
    total[0] = eval(total.join("").toString().substring(0,8));
    return total[0];
    //total.splice(1,2);
  }

  function chain(op) {
    total.push(chainOp);
    total.push(chainNum);
    total[0] = eval(total.join("").toString().substring(0,8));
  }

  $('body').keyup(function(c) {
    if (c.which === 27) {
      $D.text("0.");
      total = [];
      curNum = [];
      chainOp = "";
      chainNum = "";
      constant = "";
    }  });

  $('body').keypress(function(k) {
    var code = k.keyCode || k.which;
    //console.log(code);
    
    if (code === 42) {
       calBuilder();
        if (total[1] !== "*") {
          setOp("*");
        }
        if (chainSwitch) {
          chainOp = "*";
        }
    }

    else if (code === 43) {
      calBuilder();
        if (total[1] !== "+") {
          setOp("+");
        }
        if (chainSwitch) {
          chainOp = "+";
        }
    }

    else if (code === 47) {
        calBuilder();
        if (total[1] !== "/") {
          setOp("/");
        }
        if (chainSwitch) {
          chainOp = "/";
        } 
    }

    else if (code === 45) {
      if (total.length !== 1 && curNum.length === 0) {
        if (curNum.indexOf("-") !== -1) {
          curNum.push("-");
        }
      } else if (curNum.length > 0) {
        calBuilder();
        if (total[1] !== "-") {
          setOp("-");
        }
        chainOp = "-";
      }
    }

    else if (code > 47 && code <58 ) {
      numBuild(String.fromCharCode(code));
      $D.text(curNum.join(""));
    }

    else if (code === 46) {
      if (curNum.indexOf(".") === -1) {
        curNum.push(".");
        $D.text(curNum.join(""));
      }
    }

    else if (code === 61 || code === 13) {
      calBuilder();
      curNum = [];

      if (total.length === 2 && total[1] === "*") {
        total.push(total[0]);
        $D.text(eval(total.join("").toString().substring(0,8)));
      }

      if (chainSwitch) {
        if (total.length > 1) {
          chainNum = total[2];
          $D.text(calculate());
          total.splice(1,2);
        } else if (total.length === 1) {
          chain();
          $D.text(total[0]);
        }
      }

      else if (constSwitch) {
        if (total.length > 1) {
          if (constant === "") {
            constant = total[2];
          }
          $D.text(eval(total.join("").toString().substring(0,8)));
          //$D.text(calculate());
          total.splice(1,2);
          total[0] = constant;
        } 

        else if (total.length === 1) {
          total[0] = constant;
          total.push(curNum.join(""));
          $D.text(eval(total.join("").toString().substring(0,8)));
        }
      }
    }

  });

  $cB.on("click", function() {
    var t = $(this).text();
    var id = $(this).attr("id");	

    if ($(this).hasClass("input")) {
      numBuild(t);
      $D.text(curNum.join(""));
    } 

    else if ($(this).hasClass("neg")) {
      if (total.length !== 1 && curNum.length === 0) {
        if (curNum.indexOf("-") !== -1) {
          curNum.push(t);
        }
      } else if (curNum.length > 0) {
        calBuilder();
        if (total[1] !== t) {
          setOp(t);
        }
        chainOp = t;
      }
    }

    else if ($(this).hasClass("op")) {
     
      if ($(this).attr("id") === "divide") {
        calBuilder();
        if (total[1] !== "/") {
          setOp("/");
        }
        if (chainSwitch) {
          chainOp = "/";
        } 
      } else if ($(this).attr("id") === "multiple") {
        calBuilder();
        if (total[1] !== "*") {
          setOp("*");
        }
        if (chainSwitch) {
          chainOp = "*";
        }
      } else {
        calBuilder();
        if (total[1] !== t) {
          setOp(t);
        }
        if (chainSwitch) {
          chainOp = t;
        }
      } 
    } 

    else if ($(this).hasClass("equal")) {
      calBuilder();
      curNum = [];

      if (total.length === 2 && total[1] === "*") {
        total.push(total[0]);
        $D.text(eval(total.join("").toString().substring(0,8)));
      }

      if (chainSwitch) {
        if (total.length > 1) {
          chainNum = total[2];
          $D.text(calculate());
          total.splice(1,2);
        } else if (total.length === 1) {
          chain();
          $D.text(total[0]);
        }
      }

      else if (constSwitch) {
        if (total.length > 1) {
          if (constant === "") {
            constant = total[2];
          }
          $D.text(eval(total.join("").toString().substring(0,8)));
          //$D.text(calculate());
          total.splice(1,2);
          total[0] = constant;
        } 

        else if (total.length === 1) {
          total[0] = constant;
          total.push(curNum.join(""));
          $D.text(eval(total.join("").toString().substring(0,8)));
        }
      }
    }

    else if ($(this).hasClass("c")) {
      $D.text("0.");
      total = [];
      curNum = [];
      chainOp = "";
      chainNum = "";
      constant = "";
    } 

    else if ($(this).hasClass("ce")) {
      if (curNum.length > 0) {
        curNum = [];
        $D.text("0.");
      } else if (curNum.length === 0 && total.length > 0) {
        total.pop();
        $D.text("0.");
      }
    }

    else if ($(this).hasClass("decimal")) {
      if (curNum.indexOf(".") === -1) {
        curNum.push(t);
        $D.text(curNum.join(""));
      }
    }
    

    //debugging section
    //console.log("*************")
    //console.log("             ")
    //console.log(curNum + " ------ curNum");
    //console.log(curNum.length);
    //console.log(total + " ---- total");
    //console.log(total.length + " ---- total.length");
    //console.log(chainOp + " -------Chain");
    //console.log(chainNum + " ------chainNum");
    //console.log(constant + " -------Constant")
    //console.log(constantOp + " --------ConstantOp")
    //console.log("             ")
    //console.log("*************")

  }); // calBtn Click
}); // Ready Function