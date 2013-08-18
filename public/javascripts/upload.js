$(function(){

  $('input[type=file]').change(function(e){
    
    var path = $(this).val()
    var file_name = path.substring(path.lastIndexOf("\\") + 1, path.length);
    $("#upload_btn div").html(file_name);

  });

  $("input[type=button]").click(function(){

    console.log("uploading");
    var formData = new FormData($("form")[0]);
    $.ajax({

      url: '/upload',  //Server script to process data
      type: 'POST',
      xhr: function() {  // Custom XMLHttpRequest

        var myXhr = $.ajaxSettings.xhr();
        if(myXhr.upload){ // Check if upload property exists
        
          myXhr.upload.addEventListener('progress',progressHandlingFunction, false); 
          // For handling the progress of the upload
        }
        return myXhr;

      },
      
      //Ajax events
      beforeSend: beforeSendHandler,
      success: completeHandler,
      error: errorHandler,
      
      // Form data
      data: formData,
      
      //Options to tell jQuery not to process data or worry about content-type.
      cache: false,
      contentType: false,
      processData: false

    });
  });

});

var completeHandler = function(data){

  next_page(function(){ createSchedule(data); });

}
var progressHandlingFunction = function(){}
var beforeSendHandler = function(){}
var errorHandler =  function( jqXHR, textStatus, errorThrown ){

  console.log("err: " + errorThrown);

}