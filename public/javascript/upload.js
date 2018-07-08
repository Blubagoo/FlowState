// 'use strict';

const APP_ID = "d93ca6ab";
const APP_KEY = "25ec525dac1aa1a66f16bd8edf551ea0";

let fileName = "video.webm";

const VIDEO_URL = `https://flow-state.herokuapp.com/api/video/${fileName}`;
const LOCAL_URL = `localhost:8080/api/video/${fileName}`

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

  $.ajax({
    url: '/api/video',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(data){
        console.log('upload successful!\n' + data);
        submitFileToApi(VIDEO_URL);
    },
    error: (err) => console.error(err)
  });
}

function pageListener() {
  $('#end-btn').on('click', function() {
    deleteVideo();
  });
}

function deleteVideo(id) {
  const settings = {
    url: `/api/video/${id}`,
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
      getAnalytics(data.id);

    },
    error: function(error) {
      console.error(error);
    }
  }
  $.ajax(settings);
}

function serialize(data) {
  return {
    date: Date.now(),
    anger: data.impressions.average_emotion.anger,
    disgust: data.impressions.average_emotion.disgust,
    fear: data.impressions.average_emotion.fear,
    joy: data.impressions.average_emotion.joy,
    sadness: data.impressions.average_emotion.sadness,
    surprise: data.impressions.average_emotion.surprise, 
    glances: data.impressions.tracking.glances,
    dwell: data.impressions.tracking.dwell,
    attention: data.impressions.tracking.attention,
    positive: data.impressions.emotion_score.positive,
    negative: data.impressions.emotion_score.negative,
    neutral: data.impressions.emotion_score.neutral
  };
};


function getAnalytics(id) {
  const settings = {
    url: `https://api.kairos.com/v2/media/${id}`,
    headers: {
      "app_id": `${APP_ID}`,
      "app_key": `${APP_KEY}`,
    },
    method: "GET",
    success: function(data) {
      console.log('success', data);
      postAnalytics(data);
    },
    error: (err) => console.error(err)
  };
  $.ajax(settings);
}

function postAnalytics(obj) {
  let username = window.location.href.split("?")[1];
  const settings = {
    url: `/api/users/${username}`,
    method: 'POST',
    data: serialize(obj),
    success: (data) => {
      console.log('updated database');
      // window.logcation = dashboard.html;
    },
    error: (err) => console.error(err)
  };
  $.ajax(settings);
}




$(runWebcam);

