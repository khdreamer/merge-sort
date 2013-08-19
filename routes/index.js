var cheerio = require('cheerio');
var fs = require('fs');
var iconv = require('iconv-lite');

var courses = [];

exports.index = function(req, res){
  
  res.render('index');

};

exports.upload = function(req, res){
  
  fs.readFile(req.files.courses.path, function (err, raw_data) {

    if(err){res.send("err:" + err);}
    else{

      try {

        courses = [];

        var data = iconv.decode(raw_data,'big5');
        $ = cheerio.load(data);
        var $table = $("table[cellspacing=1]");

        $table.find("tr[height=30][align=CENTER]").each(function(idx, ele){

          var course = {};
          $(this).children().each(function(i, e){

            if(i == 5) course['name'] = $(this).text().trim();
            else if(i == 10) course['prof'] = $(this).text().trim();
            else if(i == 12) course['time'] = $(this).text().trim();

          });
          courses.push(course);

        });

        var results = JSON.stringify( group(courses) );
        res.send( results );
        res.end();

      } catch(e) {
        // failed to parse
        res.send("err: " + e);
      }

    }

  });

};

// helper function

function time2Int(time_str){

  var chineseN = { "一": 0, "二": 1, "三": 2, "四": 3, "五": 4, "六": 5, "日": 6 };
  var classN = {
    "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "@": 5, "5": 6, "6": 7,
    "7": 8, "8": 9, "9": 10, "A": 11, "B": 12, "C": 13, "D": 14
  };

  var time = time_str.replace(/\(([^)]+)\)/g, " ").trim().split(" ");
  var slots = [];
  for(var j = 0; j < time.length; j++){
    var t = time[j];
    for(var i = 1; i < t.length; i++ ){
      var n = 7*classN[ t[i].toString() ] + chineseN[ t[0].toString() ];
      slots.push(n);
    }
  }
  return slots;

}

function group(courses){

  // console.log(courses);
  var groups = {};
  for(var i = 0; i < courses.length; i++){

    var course = courses[i];
    var slots = time2Int( course['time'] );
    var added = false;
    var added_key = null;
    var merge = [];

    // see if there's a group to join
    for(var j = 0; j < slots.length; j++){

      for(var group_key in groups){

        if( !added && // not added before 
            group_key.split(",").indexOf( slots[j].toString() ) != -1 ){

          groups[group_key].push(course);
          added_key = group_key;
          added = true;
        }
        else if( added && group_key.split(",").indexOf( slots[j].toString() ) != -1){          

          if(merge.indexOf(group_key) == -1) merge.push(group_key);

        }
      }
    }

    if(!added){ // no group and crying

      groups[slots.toString()] = [course];

    }
    else if(merge.length > 1){ // too popular

      var new_group = groups[merge[0]];
      var new_key = merge[0];
      for(var k = 1; k < merge.length; k++){

        var key = merge[k];
        new_group = new_group.concat( groups[key] );
        new_key = new_key + "," + key;
        delete groups[key];

      }
      groups[new_key] = new_group;
      delete groups[merge[0]];

    }
  }

  return groups;

}

