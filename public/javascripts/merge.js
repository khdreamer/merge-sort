function createMergePlace(){

  $(".sorted_group").remove();
  $("#sink ol").remove();
  $("#sink").height(196 + "px");

  var canvas = $("#page3 > .canvas");
  var n = 0;

  // add and set groups
  $("#page2 > .canvas > .group").each(function(i, e){

    var sorted_group = $(this).clone();
    sorted_group.css({"left": "", "top": ""});
    sorted_group.removeClass();
    sorted_group.find("ul").removeClass("ui-sortable");
    sorted_group.addClass("sorted_group");

    canvas.append(sorted_group);
    n++;

  });
  $(".sorted_group").width(canvas.outerWidth() / n - 20);
  $("div.sorted_group ul.courses li")
    .addClass("course")
    .css("cursor", "move")
    .draggable({
      revert: "invalid"
    });

  // set sink
  $("div#sink").droppable({
    accept: ".course:not(.ui-sortable-helper)",
    drop: function(event, ui){

      $(this).find("p").css("opacity", 0.5);
      if($(this).children().length < 2){ 

        $(this).append( $("<ol>") );
        $("div#sink ol").sortable( {containment: "parent"} );

      }
      if($(this).find("ol").children().length == 4) $(this).css("height", "auto");
      $(this).find("p").css("line-height", $(this).outerHeight()-6 + "px");
      var li = $( "<li></li>" ).text( ui.draggable.text() );
      $(this).find("ol").append(li);
      $(ui.draggable).remove();
      $("html, body").height($("#page3").outerHeight());

    }
  });

  $("div.sorted_group ul.courses li").click(function(){

    // setup sink
    var sink = $("#sink");
    sink.find("p").css("opacity", 0.5);
      if(sink.children().length < 2){ 

        sink.append( $("<ol>") );
        $("div#sink ol").sortable( {containment: "parent"} );

    }
    if(sink.find("ol").children().length == 4) sink.css("height", "auto");
    sink.find("p").css("line-height", sink.outerHeight()-6 + "px");

    // append
    var li = $( "<li></li>" ).text( $(this).text() );
    sink.find("ol").append(li);
    $(this).remove();

    // other settings
    $("html, body").height($("#page3").outerHeight());

  }).css("cursor", "pointer");

  // done
  $("#page3 > .canvas > .next_page").click(function(){

    next_page(createResult);

  });

}