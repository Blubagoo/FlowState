// 'use strict';
import * as myModule from '/FileSaver.js';

const APP_ID = "d93ca6ab";
const APP_KEY = "25ec525dac1aa1a66f16bd8edf551ea0";

const constraints = {
  audio: false,
  video: {
    width: {ideal:640},
    height: {ideal:480}
  }
};

navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        
        var video = document.querySelector('video');
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
          video.play();
        };
        listenForEvent(stream);
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });


function listenForEvent(stream) {
  $('#btn-start-recording').on('click', function() {
    this.disabled = true;        
        var mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.start();
        
        console.log(mediaRecorder.state);
        console.log("recorder started");
     
        let chunks = [];
       
        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        };
        
        $('#btn-stop-recording').on('click', function() {
          this.disabled = true;
          $('#btn-start-recording').disabled = false;
          
          mediaRecorder.stop();
          
          console.log(mediaRecorder.state);
          
          mediaRecorder.onstop = function(e) {
            console.log('recorder stopped');

            let blob = new Blob(chunks, {'type':'video/webm\;codecs=vp8'});
            console.log(blob);
            let myFile = new File([blob], "tstVideo", {type: 'video/webm\;codecs=vp8',
                                                    lastModified: Date.now()});

            console.log(myFile);            
            
            const tryVideo = myModule.saveAs(blob, "tst-video");
            const objectUrl = URL.createObjectURL(myFile);
          
            
            // buildAPI(myFile);
            // submitFileToApi(myFile);
          }
        });
 
      
  
    document.getElementById('btn-stop-recording').disabled = false;
  });
}
$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){
  console.log('on change');
  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
      },
      xhr: function() {
        // create an XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // listen to the 'progress' event
        xhr.upload.addEventListener('progress', function(evt) {

          if (evt.lengthComputable) {
            // calculate the percentage of upload completed
            var percentComplete = evt.loaded / evt.total;
            percentComplete = parseInt(percentComplete * 100);

            // update the Bootstrap progress bar with the new percentage
            $('.progress-bar').text(percentComplete + '%');
            $('.progress-bar').width(percentComplete + '%');

            // once the upload reaches 100%, set the progress bar text to done
            if (percentComplete === 100) {
              $('.progress-bar').html('Done');
            }

          }

        }, false);

        return xhr;
      }
    });

  }
});
// function buildAPI(file) {
//   const settings = {
//     url: `https://localhost:8080/api/upload`,
//     data: ``,
//     method: "POST",
//     success: (data) => 
//       console.log('success', data),
//     error: (err) => console.error(err)
    

//   }
// }


// function submitFileToApi(file) {
  
//   console.log(file);
  
//   const settings = {
//     url: `https://api.kairos.com/v2/media?source=${file}`,
//     headers: {
//       "app_id": `${APP_ID}`,
//       "app_key": `${APP_KEY}`,
//     },
//     method: "POST",
//     success: function(data) {
//       console.log('success', data);

//     },
//     error: function(error) {
//       console.error(error);
//     }
//   }
//   $.ajax(settings);
// }