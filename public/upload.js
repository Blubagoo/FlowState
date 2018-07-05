// 'use strict';
import * as myModule from '/FileSaver.js';

const APP_ID = "d93ca6ab";
const APP_KEY = "25ec525dac1aa1a66f16bd8edf551ea0";
let fileName = "name.webm";
const VIDEO_URL = `https://flow-state.herokuapp.com/api/resources/tempVideoStrg/${fileName}`;
const LOCAL_URL = `localhost:8080/api/resources/tempVideoStrg/${fileName}`
console.log(VIDEO_URL)
function listenForUpload() {
  document.getElementByClass('upload-btn').disabled = true;
  $('#upload-input').on('click', () => {
    document.getElementByClass('upload-btn').disabled = false;

  })
}

function runWebcam() {
  
  const constraints = {
    audio: false,
    video: {
      width: {ideal:640},
      height: {ideal:480},
      frameRate: { ideal: 20, max: 25 }
    } 
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      const mediaRecorder = new MediaRecorder(stream);
      var video = document.querySelector('video');
          
      video.srcObject = stream;
          
      video.onloadedmetadata = function(e) {
            video.play();
      };
      console.log('before event');    
      listenForEvent(mediaRecorder);
    })
        
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
}


function listenForEvent(recorder) {
  $('#btn-start-recording').on('click', function() {
    this.disabled = true;        
        

        recorder.start();
        
        console.log(recorder.state);
        console.log("recorder started");
     
        let chunks = [];
       
        recorder.ondataavailable = function(e) {
          chunks.push(e.data);
        };

        listenForStop(recorder, chunks);

    document.getElementById('btn-stop-recording').disabled = false;
    
  });
}

function listenForStop(rec,blobParts) {
  
  console.log(rec);
  $('#btn-stop-recording').on('click', function() {
      console.log(rec);
      console.log('listen for stop');
      document.getElementById('btn-start-recording').disabled = false;
      document.getElementById('end-btn').disabled = false;
      pageListener();
      rec.stop();    
     
      console.log(rec.state);          
      rec.onstop = function(e) {
        console.log('rec stopped');

        let blob = new Blob(blobParts, {'type':'video/WEBM\;codecs=h264'});
        console.log(blob);
        let myFile = new File([blob], "tstVideo.webm", {
                                                    type: 'video/WEBM\;codecs=h264',
                                                    lastModified: Date.now()
                                                  });
        
        uploadToServer(myFile);
        console.log(myFile);            
              
        
        const objectUrl = URL.createObjectURL(myFile);
      }
  });
}
function downloadVideo(blob) {
  const tryVideo = myModule.saveAs(blob, "testVideo");
}

function uploadToServer(myFile) {
  console.log('on change');
    
  var formData = new FormData();
  formData.append('uploads[]',myFile, "video.webm");
  console.log(formData);
    

      // add the files to formData object for the data payload
      

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
          submitFileToApi(VIDEO_URL);
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


function pageListener() {
  $('#end-btn').on('click', function() {
    deleteVideo();
  });
}

function deleteVideo() {
  const settings = {
    url: `/delete`,
    method: "DELETE",
    success: function(data) {
      console.log('success! it was deleted', data);
    },
    error:function(err){
      console.error(err);
    }
  };
  $.ajax(settings);

}


$(runWebcam);



// $('.upload-btn').on('click', function (){
//     $('#upload-input').click();
//     $('.progress-bar').text('0%');
//     $('.progress-bar').width('0%');
// });

// $('#upload-input').on('change', function(){
//   console.log('on change');
//   var files = $(this).get(0).files;

//   if (files.length > 0){
//     // create a FormData object which will be sent as the data payload in the
//     // AJAX request
//     var formData = new FormData();

//     // loop through all the selected files and add them to the formData object
//     for (var i = 0; i < files.length; i++) {
//       var file = files[i];

//       // add the files to formData object for the data payload
//       formData.append('uploads[]', file, file.name);
//     }

//     $.ajax({
//       url: '/upload',
//       type: 'POST',
//       data: formData,
//       processData: false,
//       contentType: false,
//       success: function(data){
//           console.log('upload successful!\n' + data);
//       },
//       xhr: function() {
//         // create an XMLHttpRequest
//         var xhr = new XMLHttpRequest();

//         // listen to the 'progress' event
//         xhr.upload.addEventListener('progress', function(evt) {

//           if (evt.lengthComputable) {
//             // calculate the percentage of upload completed
//             var percentComplete = evt.loaded / evt.total;
//             percentComplete = parseInt(percentComplete * 100);

//             // update the Bootstrap progress bar with the new percentage
//             $('.progress-bar').text(percentComplete + '%');
//             $('.progress-bar').width(percentComplete + '%');

//             // once the upload reaches 100%, set the progress bar text to done
//             if (percentComplete === 100) {
//               $('.progress-bar').html('Done');
//             }

//           }

//         }, false);

//         return xhr;
//       }
//     });

//   }
// });


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


function submitFileToApi(url) {
  
  console.log(url);
  
  const settings = {
    url: `https://api.kairos.com/v2/media?source=${url}`,
    headers: {
      "app_id": `${APP_ID}`,
      "app_key": `${APP_KEY}`,
    },
    method: "POST",
    success: function(data) {
      console.log('success', data);

    },
    error: function(error) {
      console.error(error);
    }
  }
  $.ajax(settings);
}