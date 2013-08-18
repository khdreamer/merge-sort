function createResult(){

  $(".result").remove();

  var canvas = $("#page4 > .canvas");
  var result = $("<div class=\"result\">");
  result.append("<ul>");
  var selected_courses = $("#page3 > .canvas > #sink").find("ol").children();

  // spacing
  var n = selected_courses.length;
  var spacing = Math.floor ( 98/(n-1) );
  if(spacing < 1) spacing = 1;

  var idx = 1;
  selected_courses.each(function(i, e){

    var li = $(this).clone();
    var num = $("<span>");
    num.html(idx);
    if(idx < 10) num.prepend("0");
    li.prepend(num);
    result.find("ul").append(li);
    idx+=spacing;

  });

  canvas.append(result);


}