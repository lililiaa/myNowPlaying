<template>
  <v-scale-screen
    :width="1900"
    :height="1000"
    :box-style="{ backgroundColor: 'none' }"
  >
    <div class="main">
      <div class="title">
        <transition
          mode="out-in"
          name="fade"
        >
          <span :key="songStore.songData?.track?.title">{{ songStore.songData?.track?.title }}</span>
        </transition>
      </div>
      <div class="lyric">
        <transition
          mode="out-in"
          name="fade"
        >
          <span v-if="songStore.lyricData.lyric.length === 0">暂无歌词</span>
          <span
            v-else
            :key="currentLyricIndex"
          >{{
            songStore.lyricData.lyric[currentLyricIndex] ? songStore.lyricData.lyric[currentLyricIndex][2] : ''
          }}</span>
        </transition>
      </div>
    </div>
  </v-scale-screen>
</template>

<script setup>
import VScaleScreen from 'v-scale-screen';
import { computed, onMounted } from 'vue';
import { useSongStore } from '../../stores/song';

const songStore = useSongStore();

// 计算当前显示歌词
const currentLyricIndex = computed(() => {
  const currentTimeStr = songStore.songData?.player?.seekbarCurrentPositionHuman.split(':') || 0;
  const currentTime = parseInt(currentTimeStr[0]) * 60 + parseInt(currentTimeStr[1]);
  let index = -1;
  for (let i = songStore.lyricData.lyric.length - 1; i >= 0; i--) {
    const timeStr = songStore.lyricData.lyric[i][1].match(/\[(\d+):(\d+)\.(\d+)\]/);
    if (timeStr) {
      const time = parseInt(timeStr[1]) * 60 + parseInt(timeStr[2]);
      if (currentTime >= time) {
        index = i;
        break;
      }
    }
  }
  // 滚动位置
  let scrollPosition = 0;
  if (songStore.lyricData.translatedLyric.length === 0) {
    scrollPosition = -(index - 0) * 90;
  } else {
    scrollPosition = -(index) * 180;
  }
  // 滚动歌词
  const lyricContainer = document.querySelector('.lyric-box');
  if (lyricContainer) {
    lyricContainer.style.transform = `translateY(${scrollPosition}px)`;
  }
  return index;
});

onMounted(() => {
  songStore.resetSongData();
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  position: absolute;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.main {
  width: 1700px;
  height: 800px;
  margin: 100px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 100px;
  font-family: 'fangsong', 'simsun', 'Microsoft YaHei', 'Arial', 'sans-serif';
  letter-spacing: 3px;

  &>div {
    position: relative;
    width: 100%;
    height: 50%;
    white-space: none;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
  }

  .title {
    font-size: 70px;
    align-items: flex-end;
  }

  .lyric {
    font-size: 70px;
    align-items: flex-start;
  }
}
</style>