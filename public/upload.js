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
        console.log("chunks array", chunks);
        
        mediaRecorder.ondataavailable = function(e) {
          console.log('should be individual chunk data', chunks)
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
            var upload = multer({
              storage: Storage
              }).array("imgUploader", 3);

            console.log(myFile);            
            
            const tryVideo = myModule.(blob, "tst-video");
            const objectUrl = URL.createObjectURL(myFile);
            
            console.log(objectUrl);
            
            buildAPI(myFile);
            submitFileToApi(myFile);
          }
        });
 
      
  
    document.getElementById('btn-stop-recording').disabled = false;
  });
}


function buildAPI(file) {
  const settings = {
    url: `api/upload`,
    data: ``,
    method: "GET",
    success: (data) => 
      console.log('success', data),
    error: (err) => console.error(err)
    

  }
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


<script>
    $(document).ready(function() {
                var options = {
                        beforeSubmit: showRequest, 
                        // pre-submit callback success: showResponse 
                        // post-submit callback }; 
                        // bind to the form's submit event $('#frmUploader').submit(function () { $(this).ajaxSubmit(options); 
                        // always return false to prevent standard browser submit and page navigation return false; }); }); 
                        // pre-submit callback function showRequest(formData, jqForm, options) { alert('Uploading is starting.'); return true; } 
                        // post-submit callback function showResponse(responseText, statusText, xhr, $form) { alert('status: ' + statusText + '\n\nresponseText: \n' + responseText ); }
</script>