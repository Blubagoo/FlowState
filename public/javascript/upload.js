'use strict';

let username = window.location.href.split("username=")[1];
const VIDEO_URL = `https://flow-state.herokuapp.com/api/video/${username}.webm`;
const TEST_URL = "https://flow-state.herokuapp.com/api/video/test.webm";

let appKey;
let appId;

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
      listenForMediaEvent(mediaRecorder);
    })
        
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    });
}


function listenForMediaEvent(recorder) {
  $('#btn-start-recording').on('click', function() {
    this.disabled = true;              
    recorder.start();
    let chunks = [];
    recorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    listenForStop(recorder, chunks);
    document.getElementById('btn-stop-recording').disabled = false; 
  });
  $('#dashboard-btn').on('click', (e) => {
    e.preventDefault();
    let user = window.location.href.split("username=")[1];
    $('.upload-area').remove();
    $('main').html(`
      <div class="dashboard-area">
        <div id="nav-area">
          <button id="new-btn">New Video</button>
          <button id="overall-btn">Overall Feel</button>
          <button id="lastVid-btn">Video Results</button>
        </div>
        <div class="canvas-overall">
          <canvas id="overall-chart"></canvas>
        </div>
        <div class="canvas-recent" hidden>
          <canvas id="recentVideo"></canvas>
        </div>
        <div id="help-info">
          <p class="help-info">Here the goal is to compare your notes with the our emotional tracking to find
          out what kind of emotions you were portraying while being very efficient.
        </div>
      </div>
      `);
      callForAnalytics(user);
      callForData(user);
      listenForGraphEvent();
  });
  $('#camera-shy').on('click', (e) => {
    submitFileToApi(TEST_URL);
    console.log('text pressed');
  })
}
function listenForStop(rec,blobParts) {
  $('#btn-stop-recording').on('click', function() {
    document.getElementById('btn-start-recording').disabled = false;
    document.getElementById('btn-stop-recording').disabled = true;
    
    rec.stop();    
   
    console.log(rec.state);          
    rec.onstop = (e) => {
      let blob = new Blob(blobParts, {'type':'video/WEBM\;codecs=h264'});
      let myFile = new File(
        [blob], "tstVideo.webm", {
          type: 'video/WEBM\;codecs=h264',
          lastModified: Date.now()
      });
      
      uploadToServer(myFile);
    }
  });
}

function uploadToServer(myFile) {    
  var formData = new FormData();
  formData.append('uploads[]',myFile, "video.webm");

  $.ajax({
    url: `/api/video/${username}`,
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: (data) => {
        checkAuthentication(1);
    },
    error: (err) => console.error(err)
  });
}

function deleteVideo(user) {
  const settings = {
    url: `/api/video/${user}`,
    method: "DELETE",
    success: (data) => {
    },
    error:(err) => {
      console.error(err);
    }
  };
  $.ajax(settings);

}


function submitFileToApi(url, obj) { 
  const settings = {
    url: `https://api.kairos.com/v2/media?source=${url}`,
    headers: {
      "app_id": `${obj.APPid}`,
      "app_key": `${obj.APPkey}`,
    },
    method: "POST",
    success: (data) => {
      console.log(data);
      setTimeout(()=>{
        getAnalytics(data.id, obj);
        getVideoData(data.id, obj);
      }, 20000);

    },
    error: (error) => {
      console.error(error);
    }
  }
  $.ajax(settings);
}

function serializeOverall(data) {
  console.log('before serialize',data);
  let username = window.location.href.split("username=")[1];

  return {
    user: username,
    anger: data.average_emotion.anger,
    disgust: data.average_emotion.disgust,
    fear: data.average_emotion.fear,
    joy: data.average_emotion.joy,
    sadness: data.average_emotion.sadness,
    surprise: data.average_emotion.surprise, 
    glances: data.tracking.glances,
    dwell: data.tracking.dwell,
    attention: data.tracking.attention,
    positive: data.emotion_score.positive,
    negative: data.emotion_score.negative,
    neutral: data.emotion_score.neutral
  };
};
function convertOverallData(data) { 
  let analytics = data.impressions[0];
  let info = serializeOverall(analytics);

  postAnalytics(info);
}

function serializeVideoData(data) {
  return {
    anger: data.emotions.anger,
    disgust: data.emotions.disgust,
    fear: data.emotions.fear,
    joy: data.emotions.joy,
    sadness: data.emotions.sadness,
    surprise: data.emotions.surprise, 
  };
}

function convertVideoData(data) {
  let videoFrame = data.frames.map(frame => {
    let dynamic = frame.people[0];
    let dynamicData = serializeVideoData(dynamic);
    return dynamicData;
  });
  let dataObject = {
    user: username,
    frames: videoFrame
  };
  postVideoData(dataObject);
}

function getAnalytics(id, obj) {
  const settings = {
    url: `https://api.kairos.com/v2/analytics/${id}`,
    headers: {
      "app_id": `${obj.APPid}`,
      "app_key": `${obj.APPkey}`
    },
    method: "GET",
    success: (data) => {
      convertOverallData(data);
      deleteVideo(username);
    },
    error: (err) => console.error(err)
  };
  $.ajax(settings);
}
function getVideoData(id, obj) {
  const settings = {
    url: `https://api.kairos.com/v2/media/${id}`,
    headers: {
      "app_id": `${obj.APPid}`,
      "app_key": `${obj.APPkey}`,
    },
    method: "GET",
    success: (data) => {
      console.log('video data', data)
      convertVideoData(data);
    },
    error: (err) => console.error(err)
  };
  $.ajax(settings);  
}

function postAnalytics(obj) {
  const settings = {
    url: `/api/users/analytics/${username}`,
    headers: {
      "Content-Type": "application/json"
    },
    method: 'POST',
    contentType: "application/json",
    data: JSON.stringify(obj),
    success: (data) => {
      console.log('success');
    },
    error: (err) => console.error(err)
  };
  $.ajax(settings);
}

function postVideoData(obj) {

  const settings = {
    url: `/api/users/analytics/videoData/${username}`,
    headers: {
      "Content-Type": "application/json"
    },
    method: 'POST',
    contentType: "application/json",
    data: JSON.stringify(obj),
    success: (data) => {
      console.log('updated database');
      setTimeout(window.location = `index.html?username=${username}`, 5 * 1000)
    },
    error: (err) => console.error(err)
  };
  $.ajax(settings);
}

