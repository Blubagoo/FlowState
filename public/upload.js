// 'use strict';
import * as myModule from '/FileSaver.js';

const APP_ID = "d93ca6ab";
const APP_KEY = "25ec525dac1aa1a66f16bd8edf551ea0";

const constraints = {
  audio: false,
  video: {
    width: {ideal:1280},
    height: {ideal:720}
  }
};

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
            
            
            const tryVideo = myModule.saveAs(blob, "tst-video");
           
           
    

            submitFileToApi(tryVideo);
          }
        });

      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });
  
    document.getElementById('btn-stop-recording').disabled = false;
  });
  

}

function submitFileToApi(file) {
  
  console.log(file);
  
  const settings = {
    url: `https://api.kairos.com/v2/media?source=${file}`,
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



$(listenForEvent);
