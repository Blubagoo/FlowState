
////////////////////////////////////////////////////////////////


var recordRTC;

var video = document.querySelector('video');

function onStartButton() {
  $('#btn-start-recording').on('click', function(e) {
    e.preventDefault();
    console.log('button squelched');
    this.disabled = true;
    captureCamera(function(camera) {
        setSrcObject(camera, video);
        video.play();
        let options = {
          mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 128000,
          bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    recorder = RecordRTC(stream, options);
    recorder.startRecording();
            // release camera on stopRecording
    recorder.camera = camera;
    document.getElementById('btn-stop-recording').disabled = false;
    });
  });
}


function captureCamera(callback) {
  navigator.mediaDevices.getUserMedia({
    audio: true, video: true 
    }).then(successCallback).catch(function(error) {
    alert('Unable to capture your camera. Please check console logs.');
    console.error(error);
    });
}

function successCallback(stream) {
    // RecordRTC usage goes here
    var options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    recordRTC = RecordRTC(stream, options);
    recordRTC.startRecording();
}

function listenForStop() {
  $('#btn-stop-recording').on('click', function () {
      recordRTC.stopRecording(function (audioVideoWebMURL) {
          video.src = audioVideoWebMURL;
          video.src = videoURL;
          videoSRC(videoURL);
          var recordedBlob = recordRTC.getBlob();
          recordRTC.getDataURL(function(dataURL) { });
      });
  };
}


function videoSrc(urls) {
  const settings = {
    url: "https://api.kairos.com/v2/media?",
    data: {
      source: `"${urls}"`
    },
    headers: {
      app_id: "d93ca6ab",
      app_key: "25ec525dac1aa1a66f16bd8edf551ea0",
    },
    method: "POST",
    dataType: "json",
    success: function (data, textStatus, xhr) {
      console.log('success', data)
    },
    error: function() {
      console.log(arguments);
    }
  }; 
  console.log('aquired data')
  $.ajax(settings);
  console.log('api on its way')
}


$(onStartButton);
$(listenForStop);



//////////////////////////////////////////////////////////////////////




var recordRTC;

var video = document.querySelector('video');



function captureCamera(callback) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(camera) {
          callback(camera);
      }).catch(function(error) {
          alert('Unable to capture your camera. Please check console logs.');
          console.error(error);
      });
  }


function stopRecordingCallback() {
      video.src = video.srcObject = null;
      video.src = URL.createObjectURL(recorder.getBlob());
      videoURL = URL.createObjectURL(recorder.getBlob())
      video.play();
      recorder.camera.stop();
      recorder.destroy();
      recorder = null;
      videoSrc(videoURL);
      console.log(videoURL);
}


  var recorder; // globally accessible
  document.getElementById('btn-start-recording').onclick = function() {
      this.disabled = true;
      captureCamera(function(camera) {
          setSrcObject(camera, video);
          video.play();
          recorder = RecordRTC(camera, {
              type: 'video'
          });
          recorder.startRecording();
          // release camera on stopRecording
          recorder.camera = camera;
          document.getElementById('btn-stop-recording').disabled = false;
      });
  };
  document.getElementById('btn-stop-recording').onclick = function() {
      this.disabled = true;
      recorder.stopRecording(stopRecordingCallback);
  };



function videoSrc(urls) {
  console.log(urls);
  const settings = {
    url: `"https://api.kairos.com/v2/media?source=${urls}"`,
    headers: {
      app_id: "d93ca6ab",
      app_key: "25ec525dac1aa1a66f16bd8edf551ea0",
    },
    method: "POST",
    dataType: "json",
    success: function (data, textStatus, xhr) {
      console.log('success', data)
    },
    error: function() {
      console.log(arguments);
    }
  }; 
  console.log('aquired data')
  $.ajax(settings);
  console.log('api on its way')
}




///////////////////////////////////////////////////////////////////////

var recordRTC;

var video = document.querySelector('video');

function onStartButton() {
  $('#btn-start-recording').on('click', function(e) {
    e.preventDefault();
    console.log('button squelched');
    this.disabled = true;
    captureCamera(function(camera) {
        setSrcObject(camera, video);
        video.play();
        let options = {
          mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 128000,
          bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    recorder = RecordRTC(stream, options);
    recorder.startRecording();
            // release camera on stopRecording
    recorder.camera = camera;
    document.getElementById('btn-stop-recording').disabled = false;
    });
  });
}


function captureCamera(callback) {
  navigator.mediaDevices.getUserMedia({
    audio: true, video: true 
    }).then(function(camera) {
    callback(camera);
    }).catch(function(error) {
    alert('Unable to capture your camera. Please check console logs.');
    console.error(error);
    });
}


function listenForStop() {
  $('#btn-stop-recording').on('click', function () {
      recordRTC.stopRecording(function (audioVideoWebMURL) {
          video.src = audioVideoWebMURL;
          video.src = videoURL;
          videoSRC(videoURL);
          var recordedBlob = recordRTC.getBlob();
          recordRTC.getDataURL(function(dataURL) { });
      });
  });
}
