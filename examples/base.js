(function (window, videojs) {
  var log = function (name, data) {
    var args = Array.from(arguments);
    var ele = document.getElementById("console");
    var node = document.createElement("p");
    node.innerHTML = name + ": " + JSON.stringify(data);
    ele.innerHTML = node.outerHTML + ele.innerHTML;
  };

  var btn = document.getElementById("load");
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    player.autoplay(true);
    player.src([
      {
        src: "https://hls.hunter.fm/pop2k/320.m3u8?rand=" + Math.random(),
        type: "application/x-mpegURL",
      },
      {
        src: "https://vjs.zencdn.net/v/oceans.mp4?" + Math.random(),
        type: "video/mp4",
      },
      {
        src: "https://vjs.zencdn.net/v/oceans.webm?" + Math.random(),
        type: "video/webm",
      },
    ]);
  });

  var player = (window.player = videojs("videojs-event-tracking-player", {
    poster: "https://vjs.zencdn.net/v/oceans.png",
    sources: [
      // {
      //   src: "https://hls.hunter.fm/rock/320.m3u8?rand=" + Math.random(),
      //   type: "application/x-mpegURL",
      // },
      { src: "https://vjs.zencdn.net/v/oceans.mp4", type: "video/mp4" },
      { src: "https://vjs.zencdn.net/v/oceans.webm", type: "video/webm" },
    ],
  }));
  player.volume(0.05);
  player.eventTracking({
    performance: function (data) {
      log("tracking:performance", data);
    },
    triggerInterval: 10,
    /*
    // optional configuration to consider buffering while user is scrubbing on the video player.
    bufferingConfig: {
      includeScrub: true
    }*/
  });

  player.on("tracking:firstplay", function (e, data) {
    log(e.type, data);
  });

  player.on("error", function (e) {
    log(e.type, { message: e.message });
  });

  player.on("tracking:play", function (e, data) {
    log(e.type, data);
  });

  player.on("tracking:pause", function (e, data) {
    log(e.type, data);
  });

  player.on("tracking:first-quarter", function (e, data) {
    log(e.type, data);
  });

  player.on("tracking:second-quarter", function (e, data) {
    log(e.type, data);
  });

  player.on("tracking:third-quarter", function (e, data) {
    log(e.type, data);
  });

  player.on("tracking:fourth-quarter", function (e, data) {
    log(e.type, data);
  });

  player.on("tracking:buffered", function (e, data) {
    log(e.type, data);
  });

  player.on("tracking:seek", function (e, data) {
    log(e.type, data);
  });

  log("videojs", { version: videojs.VERSION });
})(window, window.videojs);
