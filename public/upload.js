'use strict';

const constraints = {
  audio: false,
  video: {
    width: {ideal:1280},
    height: {ideal:720}
  }
};
        
// if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//    console.log('getUserMedia supported.');
//    navigator.mediaDevices.getUserMedia(constraints)
//       .then(function(stream) {
//         var mediaRecorder = new MediaRecorder(stream);

//       })
//       .catch(function(err) {
//          console.log('The following getUserMedia error occured: ' + err);
//       }
//    );
// } else {
//    console.log('getUserMedia not supported on your browser!');
// }

function listenForEvent() {
  $('#btn-start-recording').on('click', function() {
    this.disabled = true;
    
    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(stream) {
        var mediaRecorder = new MediaRecorder(stream);
        var video = document.querySelector('video');
        
        video.srcObject = stream;
        
        mediaRecorder.start();
        
        console.log(mediaRecorder.state);
        console.log("recorder started");
        video.onloadedmetadata = function(e) {
          video.play();
        };
        let chunks = [];
        
        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        };
        
        $('#btn-stop-recording').on('click', function() {
          this.disabled = true;
          
          mediaRecorder.stop();
          
          console.log(mediaRecorder.state);
          
          mediaRecorder.onstop = function(e) {
            console.log('recorder stopped');

            let blob = new Blob(chunks, {'type':'video/webm\;codecs=vp8'});
            console.log(blob);
            let myFile = new File([blob], "blob.webm", {
                                                      type: 'video/webm\;codecs=vp8',
                                                      lastModified: Date.now()
                                                    });
            console.log(myFile);
            let videoUrl = window.URL.createObjectURL(myFile);
            console.log(videoUrl);

          }
        });

      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });
  
    document.getElementById('btn-stop-recording').disabled = false;
  });
  

}


$(listenForEvent);







// if (navigator.mediaDevices.getUserMedia) {
//   var constraints = { audio: true, video: true };
//   var chunks = [];

//   var onSuccess = function(stream) {
//     var options = {
//       audioBitsPerSecond : 128000,
//       videoBitsPerSecond : 2500000,
//       mimeType : 'video/mp4'
//     }
//     var mediaRecorder = new MediaRecorder(stream,options);
//     m = mediaRecorder;







//   var recordRTC;

// function successCallback(stream) {
//     // RecordRTC usage goes here

//     var options = {
//       mimeType: 'video/mp4', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
//       audioBitsPerSecond: 128000,
//       videoBitsPerSecond: 128000,
//       bitsPerSecond: 128000 // if this line is provided, skip above two
//     };
//     recordRTC = RecordRTC(stream, options);
//     recordRTC.startRecording();
//     recordRTC.play;
// }

// function errorCallback(error) {
//     // maybe another application is using the device
//     console.log('error');
// }

// var mediaConstraints = { video: true, audio: true };

// function listenForStop() {  
//   $('#btn-stop-recording').on('click', function() {
//       recordRTC.stopRecording(function (audioVideoWebMURL) {
//           recordRTC.src = audioVideoWebMURL;
//           videoLocale = audioVideoWebMURL
//           videoSrc(videoLocale);
//           console.log(videoLocale);

//           var recordedBlob = recordRTC.getBlob();
//           recordRTC.getDataURL(function(dataURL) { });
//       });
//   });
// }
// function videoSrc(urls) {
//   const settings = {
//     url: "https://api.kairos.com/v2/media",
//     data: urls,
//     headers: {
//       app_id: "d93ca6ab",
//       app_key: "25ec525dac1aa1a66f16bd8edf551ea0",
//     },
//     method: "POST",
//     dataType: "json",
//     success: function (data, textStatus, xhr) {
//       console.log('success', data)
//     },
//     error: function() {
//       console.log(arguments);
//     }
//   }; 
//   console.log('aquired data')
//   $.ajax(settings);
//   console.log('api on its way')
// }

// $(listenForStart);
// $(listenForStop);