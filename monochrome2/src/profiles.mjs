export const audioProfiles = Object.freeze({
  flac_master: { codec: "flac", lossless: true, sampleRate: "source", channels: "source" },
  aac_lc_128: { codec: "aac", profile: "aac_low", bitrate: "128k" },
  aac_lc_256: { codec: "aac", profile: "aac_low", bitrate: "256k" },
  he_aac_v1_96: { codec: "libfdk_aac", profile: "aac_he", bitrate: "96k" },
  he_aac_v2_48: { codec: "libfdk_aac", profile: "aac_he_v2", bitrate: "48k" },
  opus_96: { codec: "libopus", bitrate: "96k" },
  opus_160: { codec: "libopus", bitrate: "160k" },
  vorbis_192: { codec: "libvorbis", bitrate: "192k" }
});

const video = (height, bitrate, maxrate, bufsize) => ({ height, bitrate, maxrate, bufsize });
export const videoLadder = Object.freeze({
  "144p": video(144, "180k", "240k", "360k"),
  "240p": video(240, "350k", "470k", "700k"),
  "360p": video(360, "700k", "940k", "1400k"),
  "480p": video(480, "1400k", "1800k", "2800k"),
  "576p": video(576, "2400k", "3000k", "4800k"),
  "720p": video(720, "5000k", "6500k", "10000k"),
  "1080p": video(1080, "12000k", "15000k", "24000k"),
  "1440p": video(1440, "24000k", "30000k", "48000k"),
  "2160p": video(2160, "50000k", "65000k", "100000k")
});

export const videoCodecs = Object.freeze({
  h264: { encoder: "libx264", pixelFormat: "yuv420p", preset: "slow" },
  hevc: { encoder: "libx265", pixelFormat: "yuv420p10le", preset: "slow" },
  vp9: { encoder: "libvpx-vp9", pixelFormat: "yuv420p10le", rowMt: true },
  av1: { encoder: "libsvtav1", pixelFormat: "yuv420p10le", preset: 4 }
});
