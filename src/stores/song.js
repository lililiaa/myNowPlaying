import { defineStore } from "pinia";

export const useSongStore = defineStore("song", {
  state: () => ({
    songData: {},
    lyricData: {
      author: [],
      lyric: [],
      translatedLyric: [],
    },
    ws: null,
    wsConnected: false,
  }),
  getters: {

  },
  actions: {
    /**
     * 获取歌曲信息
     */
    async fetchSongData() {
      try {
        const res = await fetch(`http://${import.meta.env.VITE_API_HOST}:9863/query`);
        let data = await res.json();
        if (data.player?.statePercent) data.player.statePercent = +data.player?.statePercent.toFixed(4);
        this.songData = data;
      } catch (error) {
        this.songData = {};
        console.error(error);
      }
    },
    /**
     * 获取歌词信息
     */
    async getLyricData() {
      const authorRegex = /^{.*}$/gm;
      const lyricRegex = /^\[\d+:\d+\.\d+\].*$/gm;
      const lyricRegex2 = /^(\[\d+:\d+\.\d+\])(.*)$/;
      try {
        const res = await fetch(`http://${import.meta.env.VITE_API_HOST}:9863/api/lyric`);
        const data = await res.json();
        this.lyricData.author = data.lrc?.match(authorRegex)?.map(i => JSON.parse(i)) || [];
        this.lyricData.lyric = data.lrc?.match(lyricRegex)?.map(i => i.match(lyricRegex2)) || [];
        if (data.hasTranslatedLyric) {
          this.lyricData.translatedLyric = data.translatedLyric?.match(lyricRegex)?.map(i => i.match(lyricRegex2)) || [];
        } else {
          this.lyricData.translatedLyric = [];
        }
      } catch (error) {
        this.lyricData = {};
        console.error(error);
      }
    },
    /**
     * 重置歌曲信息
     */
    resetSongData() {
      this.songData = {};
      this.lyricData = {
        author: [],
        lyric: [],
        translatedLyric: [],
      };
    }
  },
});
