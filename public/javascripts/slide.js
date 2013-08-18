var page = 0;
var page_width = $(window).width();
var unit = "px";

$(function(){

  $("html, body").height($("#page" + page).outerHeight());

  $("#page0 .next_page").click(function(){

    next_page();

  });
  set_step_click();

});

function next_page(before_action){

  if(before_action) before_action();

  slide_to(page+1);
  
}

function slide_to(destination){

  console.log(page + "->" + destination);
  page = destination;
  $("html, body").height($("#page" + page).outerHeight());
  $("html, body").animate({ scrollTop: "0" }, 0);
  $("#content").animate({"margin-left": -1 * page_width * page + unit}, 500);
  $(".current_step").removeClass("current_step");
  $(".step" + page).addClass("current_step");

}

function set_step_click(){

  $("li[class*=step]").click(function(){

    var clicked_step = parseInt( this.className.charAt(this.className.length - 1) );
    console.log(clicked_step);
    if(clicked_step < page){

      slide_to(clicked_step);

    }

  });

}



