var core = require('hap-nodejs/CameraCore.js');
var Camera = require('hap-nodejs').Camera;
var uuid = require('hap-nodejs/lib/util/uuid.js');
const spawn = require('child_process').spawn;
var shell = require('shelljs');
var fs = require('fs');

Camera.prototype.handleSnapshotRequest = function(request, callback) {
    var raspistill = `raspistill -w ${request.width} -h ${request.height} -t 10 -o ./snapshots/snapshot.jpg`;

    shell.exec(raspistill, function(code, stdout, stderr) {
        var snapshot = undefined;
        if (code === 0) {
          snapshot = fs.readFileSync(__dirname + '/snapshots/snapshot.jpg');
        }
        callback(stderr, snapshot);
    });
}

Camera.prototype.handleStreamRequest = function(request) {
  // Invoked when iOS device asks stream to start/stop/reconfigure
  var sessionID = request["sessionID"];
  var requestType = request["type"];
  if (sessionID) {
    let sessionIdentifier = uuid.unparse(sessionID);

    if (requestType == "start") {
      var sessionInfo = this.pendingSessions[sessionIdentifier];
      if (sessionInfo) {
        var width = 1280;
        var height = 720;
        var fps = 30;
        var bitrate = 300;

        let videoInfo = request["video"];
        if (videoInfo) {
          width = videoInfo["width"];
          height = videoInfo["height"];

          let expectedFPS = videoInfo["fps"];
          if (expectedFPS < fps) {
            fps = expectedFPS;
          }

          bitrate = videoInfo["max_bit_rate"];
          console.log('bitrate: ', bitrate);
        }

        let targetAddress = sessionInfo["address"];
        let targetVideoPort = sessionInfo["video_port"];
        let videoKey = sessionInfo["video_srtp"];


        bitrate = 100;
        width = 640;
        height = 480;


        // let ffmpegCommand = '-f video4linux2 -i /dev/video0 -threads 0 -vcodec libx264 -an -pix_fmt yuv420p -r '+ fps +' -f rawvideo -tune zerolatency -vf scale=w='+ width +':h='+ height +' -b:v '+ bitrate +'k -bufsize '+ bitrate +'k -payload_type 99 -ssrc 1 -f rtp -srtp_out_suite AES_CM_128_HMAC_SHA1_80 -srtp_out_params '+videoKey.toString('base64')+' srtp://'+targetAddress+':'+targetVideoPort+'?rtcpport='+targetVideoPort+'&localrtcpport='+targetVideoPort+'&pkt_size=1378';
        let ffmpegCommand = '-f video4linux2 -i /dev/video0 -s '+width + ':' + height + ' -threads auto -vcodec h264 -an -pix_fmt yuv420p -f rawvideo -tune zerolatency -vf scale=w='+ width +':h='+ height +' -b:v '+ bitrate +'k -bufsize '+ 2*bitrate +'k -payload_type 99 -ssrc 1 -f rtp -srtp_out_suite AES_CM_128_HMAC_SHA1_80 -srtp_out_params '+videoKey.toString('base64')+' srtp://'+targetAddress+':'+targetVideoPort+'?rtcpport='+targetVideoPort+'&localrtcpport='+targetVideoPort+'&pkt_size=1378';

        console.log('avconv stream: ', ffmpegCommand);
        let ffmpeg = spawn('avconv', ffmpegCommand.split(' '), {env: process.env});
        this.ongoingSessions[sessionIdentifier] = ffmpeg;
      }

      delete this.pendingSessions[sessionIdentifier];
    } else if (requestType == "stop") {
      var ffmpegProcess = this.ongoingSessions[sessionIdentifier];
      if (ffmpegProcess) {
        ffmpegProcess.kill('SIGKILL');
      }

      delete this.ongoingSessions[sessionIdentifier];
    }
  }
}
