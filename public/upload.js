  var recordRTC;

function successCallback(stream) {
    // RecordRTC usage goes here

    var options = {
      mimeType: 'video/mp4', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    recordRTC = RecordRTC(stream, options);
    recordRTC.startRecording();
    recordRTC.play;
}

function errorCallback(error) {
    // maybe another application is using the device
    console.log('error');
}

var mediaConstraints = { video: true, audio: true };
function listenForStart() {
  $('#btn-start-recording').on('click', function() {
    this.disabled = true;
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
    document.getElementById('btn-stop-recording').disabled = false;
  });
}
function listenForStop() {  
  $('#btn-stop-recording').on('click', function() {
      recordRTC.stopRecording(function (audioVideoWebMURL) {
          recordRTC.src = audioVideoWebMURL;
          videoLocale = audioVideoWebMURL
          videoSrc(videoLocale);
          console.log(videoLocale);

          var recordedBlob = recordRTC.getBlob();
          recordRTC.getDataURL(function(dataURL) { });
      });
  });
}
function videoSrc(urls) {
  const settings = {
    url: "https://api.kairos.com/v2/media",
    data: urls,
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

$(listenForStart);
$(listenForStop);