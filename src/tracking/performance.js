/**
 * Track Overall Performance
 * This event triggers when the player has changed sources, has ended, or
 * has been destroyed.
 *
 * Example Usage:
 * player.eventTracking({
 *  performance: function(data) {
 *    // tracking here...
 *  },
 * });
 *
 * Data Attributes:
 * => pauseCount:       Total number of Pause events triggered
 * => seekCount:        Total number of Seek events triggered
 * => bufferCount:      Total number of Buffer events triggered
 * => totalDuration:    Total duration provided by the file
 * => watchedDuration:  Total number of seconds watched (not seeked past)
 * => bufferDuration:   Total seconds that buffering has occured
 * => initialLoadTime:  Seconds it took for the initial frame to appear
 *
 * @function PerformanceTracking
 * @param    {Object} [config={}]
 *           An object of config left to the plugin author to define.
 */
import { v4 } from 'uuid';

const PerformanceTracking = function(config) {
  if (
    typeof config === 'undefined' ||
    typeof config.performance !== 'function'
  ) {
    return;
  }

  const triggerOnPause =
    typeof config.triggerOnPause === 'boolean' ? config.triggerOnPause : true;
  const triggerInterval =
    typeof config.triggerInterval === 'number' ? config.triggerInterval : 10;

  const player = this;
  let session = v4();
  let seekCount = 0;
  let pauseTime = 0;
  let pauseCount = 0;

  let bufferCount = 0;
  let totalDuration = 0;
  let watchedDuration = 0;
  let bufferDuration = 0;
  let initialLoadTime = 0;
  let timestamps = [];

  const reset = function() {
    session = v4();
    seekCount = 0;
    pauseTime = 0;
    pauseCount = 0;
    bufferCount = 0;
    bufferDuration = 0;

    timestamps = [];
    totalDuration = 0;
    watchedDuration = 0;
    initialLoadTime = 0;
  };

  const trigger = function() {
    const data = {
      session,
      pauseTime,
      pauseCount,
      seekCount,
      bufferCount,
      totalDuration,
      watchedDuration,
      bufferDuration,
      initialLoadTime
    };

    config.performance.call(player, data);
  };

  const triggerAndReset = function() {
    trigger();
    reset();
  };

  if (typeof window.addEventListener === 'function') {
    window.addEventListener('beforeunload', triggerAndReset);
    player.on('dispose', function() {
      window.removeEventListener('beforeunload', triggerAndReset);
    });
  }

  player.on('loadstart', function() {
    if (totalDuration > 0) {
      trigger();
    }

    reset();
  });

  player.on('ended', triggerAndReset);
  player.on('dispose', triggerAndReset);
  player.on('timeupdate', function() {
    const curTime = +player.currentTime().toFixed(0);

    if (timestamps.indexOf(curTime) < 0) {
      timestamps.push(curTime);
      // Update watched duration
      watchedDuration = timestamps.length;
      if (watchedDuration % triggerInterval === 0) {
        trigger();
      }
    }
  });
  player.on('loadeddata', function(e, data) {
    totalDuration = +player.duration().toFixed(0);
  });
  player.on('tracking:seek', function(e, data) {
    seekCount = data.seekCount;
  });
  player.on('tracking:pause', function(e, data) {
    pauseCount = data.pauseCount;
    if (triggerOnPause) {
      trigger();
    }
  });
  player.on('tracking:unpause', function(e, data) {
    pauseTime = data.pauseTime;
    pauseCount = data.pauseCount;
  });
  player.on('tracking:buffered', function(e, data) {
    ({ bufferCount } = data);
    bufferDuration = +(bufferDuration + data.secondsToLoad).toFixed(3);
  });
  player.on('tracking:firstplay', function(e, data) {
    initialLoadTime = data.secondsToLoad;
  });
};

export default PerformanceTracking;
