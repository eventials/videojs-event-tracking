/**
 * Tracks when users pause the video.
 *
 * Example Usage:
 * player.on('tracking:pause', (e, data) => console.log(data))
 *
 * Data Attributes:
 * => pauseCount:       Total number of Pause events triggered
 *
 * @function PauseTracking
 * @param    {Object} [config={}]
 *           An object of config left to the plugin author to define.
 */

const PauseTracking = function (config) {
  const player = this;
  let pauseTime = 0;
  let pauseCount = 0;
  let initPauseTime = null;
  let timer = null;
  let locked = false;

  const reset = function (e) {
    if (timer) {
      clearTimeout(timer);
    }
    pauseTime = 0;
    pauseCount = 0;
    initPauseTime = null;
    locked = false;
  };

  const isSeeking = function () {
    return (
      (typeof player.seeking === "function" && player.seeking()) ||
      (typeof player.scrubbing === "function" && player.scrubbing())
    );
  };

  player.on("dispose", reset);
  player.on("loadstart", reset);
  player.on("ended", reset);
  player.on("play", function () {
    if (initPauseTime !== null) {
      pauseTime += (Date.now() - initPauseTime) / 1000;
      player.trigger("tracking:unpause", { pauseTime, pauseCount });
      initPauseTime = null;
    }
  });
  player.on("pause", function () {
    if (isSeeking() || locked) {
      return;
    }

    timer = setTimeout(function () {
      pauseCount++;
      initPauseTime = Date.now();
      player.trigger("tracking:pause", { pauseTime, pauseCount });
    }, 300);
  });
};

export default PauseTracking;
