<template>
  <v-scale-screen
    :width="850"
    :height="1100"
    :box-style="{ backgroundColor: 'none' }"
  >
    <div class="main">
      <img
        class="disc"
        src="../../assets/icons/disc.svg"
        alt=""
      >
      <div class="cover">
        <transition
          v-show="songStore.songData?.track?.cover"
          name="fade2"
          mode="default"
        >
          <img
            id="cover"
            :src="songStore.songData?.track?.cover"
            :key="songStore.songData?.track?.cover"
            alt="封面"
          />
        </transition>
        <img
          v-show="!songStore.songData?.track?.cover"
          style="box-sizing:border-box;padding: 30px;color: #fff;"
          src="../../assets/icons/music.svg"
          alt=""
        >
      </div>
      <div class="song-container">
        <transition
          name="fade"
          mode="out-in"
        >
          <overflow-text
            v-if="songStore.songData?.track?.title"
            :key="songStore.songData?.track?.title"
            color="#5a5a77"
            is-bold="bold"
            font-size="55px"
            content-align="center"
            class="shadow-text"
          >
            {{ songStore.songData?.track?.title }}
          </overflow-text>
        </transition>
        <transition
          name="fade"
          mode="out-in"
        >
          <overflow-text
            v-if="songStore.songData?.track?.author"
            :key="songStore.songData?.track?.author"
            color="#5a5a77"
            font-size="45px"
            content-align="center"
            class="shadow-text"
          >
            {{ songStore.songData?.track?.author }}
          </overflow-text>
        </transition>
        <span v-if="!songStore.songData?.track?.title && !songStore.songData?.track?.author">暂无歌曲信息</span>
      </div>
      <div class="status-container">
        <div
          class="process-container"
          :style="{ '--process': songStore.songData?.player?.statePercent || 0 }"
        >
          <div class="process-bar"></div>
        </div>
        <div class="play-container">
          <span class="shadow-text">{{ songStore.songData?.player?.seekbarCurrentPositionHuman }}</span>
          <div class="status">
            <transition name="slide">
              <img
                v-if="songStore.songData?.player?.isPaused"
                src="../../assets/icons/play.svg"
                alt=""
              >
              <img
                v-else
                src="../../assets/icons/pause.svg"
                alt=""
              >
            </transition>
          </div>
          <span class="shadow-text">{{ songStore.songData?.track?.durationHuman }}</span>
        </div>
      </div>
    </div>
  </v-scale-screen>
</template>

<script setup>
import overflowText from '../../components/overflowText.vue';
import VScaleScreen from 'v-scale-screen';
import { useSongStore } from '../../stores/song';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const songStore = useSongStore();

// 监听封面变化
const oldCover = ref('');
watch(
  () => songStore.songData?.track?.cover,
  (newVal, oldVal) => {
    oldCover.value = oldVal || '../assets/icons/music.svg';
  },
);

onMounted(() => {
  songStore.resetSongData();
});
</script>

<style lang="scss" scoped>
$text-color: #5a5a77;

.fade2-enter-active,
.fade2-leave-active {
  transition: opacity 0.5s ease 0.3s, transform 2s ease 0.3s;
  transform-origin: 50% 0;
}

.fade2-enter-from {
  opacity: 0;
  transform: translate(50px, -30px) rotate(-10deg);
}

.fade2-leave-to {
  opacity: 1;
}

.fade2-enter-active {
  position: absolute;
  width: 100%;
  height: 100%;
}

.fade2-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 1s ease;
  position: absolute;
}

.slide-enter-from {
  transform: translateX(-200%);
}

.slide-leave-to {
  transform: translateX(200%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.main {
  width: 650px;
  height: 900px;
  margin: 100px;
  box-sizing: border-box;
  padding: 100px 0 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  background-color: rgb(230, 233, 239);
  box-shadow: 0 30px 60px rgba(196, 199, 204, 0.8);
  border-radius: 50px;
  position: relative;

  .disc {
    position: absolute;
    top: 40px;
    right: 40px;
    width: 50px;
    height: 50px;
  }

  span {
    color: $text-color;
  }

  .cover {
    width: calc(100% - 240px);
    aspect-ratio: 1 / 1;
    position: relative;
    // overflow: hidden;
    box-sizing: border-box;
    border-radius: 40px;
    box-shadow: 30px 30px 40px rgb(196, 199, 204);

    img {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      // box-shadow: 30px 30px 40px rgb(196, 199, 204);
    }
  }

  .song-container {
    width: 90%;
    display: flex;
    flex-direction: column;
    font-size: 50px;

    span {
      margin: auto;
    }
  }

  .status-container {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .process-container {
      width: 90%;
      height: 16px;
      border-radius: 10px;
      box-sizing: border-box;
      overflow: hidden;
      box-shadow: inset 5px 5px 10px #c4c7cc,
        inset -5px -5px 10px #ffffff;

      .process-bar {
        height: 100%;
        width: calc(var(--process) * 100%);
        border-radius: 8px;
        background: linear-gradient(90deg, #8a8aa3, #5a5a77);
        transition: width 1s ease;
      }
    }

    .play-container {
      width: 90%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 35px;

      .status {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: $text-color;
        box-sizing: border-box;
        padding: 10px;
        overflow: hidden;
        position: relative;
        box-shadow: 8px 8px 15px rgb(196, 199, 204);

        img {
          width: 60px;
          height: 60px;
        }
      }
    }
  }
}

.shadow-text {
  text-shadow: 2px 2px 2px #999;
}
</style>