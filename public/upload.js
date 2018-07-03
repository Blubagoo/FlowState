// 'use strict';

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
            videoUrl = window.URL.createObjectURL(myFile);
            console.log(videoUrl);
            submitFileToApi(myFile, videoUrl);
          }
        });

      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });
  
    document.getElementById('btn-stop-recording').disabled = false;
  });
  

}

function submitFileToApi(file, url) {
  console.log(file);
  console.log(url);
  const settings = {
    url: `https://api.kairos.com/v2/media?source=${file}`,
    headers: {
      "app_id": "d93ca6ab",
      "app_key": "25ec525dac1aa1a66f16bd8edf551ea0",
    },
    method: "POST",
    success: function(data) {
      console.log('success');
    },
    error: function(error) {
      console.error(error);
    }



  }
  $.ajax(settings);
}



$(listenForEvent);
