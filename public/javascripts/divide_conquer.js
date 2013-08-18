function randomColors(num){

  var hues = [];
  var h = Math.floor( (Math.random() * 360) + 1 );
  hues.push(h);
  for(var i = 0; i < num-1; i++){
 
    h += (360/num);
    hues.push(h);

  }

  return hues;

}

var hues = [];

function createSchedule(data){

  $("#page2 .canvas").empty();

  // console.log(data);
  var chineseN = [ "一", "二", "三", "四", "五", "六", "日" ];
  var timeName = [
    "0", "1", "2", "3", "4", "@", "5", "6",
    "7", "8", "9", "A", "B", "C", "D"
  ];
  var groups = JSON.parse( data );
  var group_keys = Object.keys(groups);
  group_keys.sort(function(a, b){ return groups[b].length - groups[a].length; });
  hues = randomColors( group_keys.length );

  var canvas = $("#page2 > .canvas");
  canvas.append("<p>1 上下拖曳來改變志願序</p><p>2 按住彩色長條可以移動整個群組</p>");
  var table = $("<table>");
  table.attr('id', "schedule");
  var tbody = $("<tbody>");
  
  var time_count = 0;
  for(var i = 0; i < 16; i++){

    var tr = $("<tr>");

    for(var j = 0; j < 8; j++){

      var td = $("<td>");

      if(j == 0){ 

        td.addClass("time");
        if(i!=0) td.append(timeName[i-1]);

      }
      else if(i == 0){

        td.append("星期" + chineseN[j-1]);
      }
      else{

        for(var k = 0; k < group_keys.length; k++){

          if(i==3 && j==2 && k==3) console.log(group_keys[k] + " " + time_count);
          if( group_keys[k].split(",").indexOf(time_count.toString()) != -1 ){

            td.attr("group", k);
            td.css("background-color", "hsl(" + hues[k] + ", 60%, 75%)");

          }
        }
        time_count++;
      }
      tr.append(td);
    }
    tbody.append(tr);
  }

  table.append(tbody);
  canvas.append(table);

  // put groups
  var canvas = $("#page2 > .canvas");
  var groups_arr = [];
  for(var i = 0; i < group_keys.length; i++){

    var g = createGroups(groups[ group_keys[i] ], i);
    groups_arr.push(g);

  }
  for(var i = 0; i < groups_arr.length; i++){

    canvas.append(groups_arr[i]);

  }
  var btn = $("<div class=\"next_page\">排好了</div>");
  $("#page2 .canvas").append(btn);

  // done
  $("#page2 .next_page").click(function(){

    next_page(createMergePlace);

  });

}

function createGroups(group_data, group_num){
 
  var group = $("<div class=\"group\">");
  var ul = $("<ul class=\"courses\">");

  var color_label = $("<div class=\"label" + group_num + "\">");
  color_label.css("background-color", "hsl(" + hues[group_num] + ", 60%, 75%)");
  group.append(color_label);

  for(var i = 0; i < group_data.length; i++){

    var course_name = group_data[i]["name"];
    var prof = group_data[i]["prof"];
    var li = $("<li>" + course_name + " (" + prof + ")" + "</li>");
    ul.append(li);

  }

  ul.sortable();
  group.append(ul);
  group.draggable( {
  
    handle: "div[class*=label]",
    containment: "body",
    start: function() {
      $(".group_selected").removeClass("group_selected");
      $(this).addClass("group_selected");    
    }

  });
  group.attr("group_num", group_num);
  group.click(function(){

    $(".group_selected").removeClass("group_selected");
    $(this).addClass("group_selected");

  });
  // canvas.append(group);
  return group;
  
}

