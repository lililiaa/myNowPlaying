<template>
  <v-scale-screen
    :width="850"
    :height="1100"
    :box-style="{ backgroundColor: 'none' }"
  >
    <div
      class="main"
      :style="{
        '--theme-color': themeColor,
        '--text-color': textColor,
        '--bg-color': themeColorList[2] || textColor,
        '--shadow-color': shadowColor,
        '--stress-color': themeColorList[3],
        '--outline-color': outlineColor,
        '--outline-color2': outlineColor2,
      }"
    >
      <div class="cover">
        <transition
          v-show="songStore.songData?.track?.cover"
          name="slide"
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
        <overflow-text
          v-if="songStore.songData?.track?.title"
          :color="textColor"
          is-bold="bold"
          font-size="55px"
          content-align="center"
        >
          {{ songStore.songData?.track?.title }}
        </overflow-text>
        <overflow-text
          v-if="songStore.songData?.track?.author"
          :color="textColor"
          font-size="45px"
          content-align="center"
        >
          {{ songStore.songData?.track?.author }}
        </overflow-text>
        <span v-if="!songStore.songData?.track?.title && !songStore.songData?.track?.author">暂无歌曲信息</span>
      </div>
      <div class="status-container">
        <div
          class="process-container"
          :style="{ '--process': songStore.songData?.player?.statePercent || 0 }"
        ></div>
        <div class="play-container">
          <span>{{ songStore.songData?.player?.seekbarCurrentPositionHuman }}</span>
          <div
            class="status"
            :class="{ 'pause': songStore.songData?.player?.isPaused }"
          >
            <div class="line line1"></div>
            <div class="line line2"></div>
            <div class="line line3"></div>
            <div class="line line4"></div>
          </div>
          <span>{{ songStore.songData?.track?.durationHuman }}</span>
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
import ColorThief from 'colorthief';
import { getCoverUrl } from '../../utils/cover';
import { isColorDark } from '../../utils/color';

const songStore = useSongStore();
// 游戏&配置
const extraTextList = reactive(JSON.parse(localStorage.getItem('extraInfo')));

// 主体颜色
const themeColor = ref(localStorage.getItem('backgroundColor') || 'rgba(0, 0, 0, 0.8)');
const textColor = ref(localStorage.getItem('textColor') || 'rgba(255, 255, 255, 1)');
const shadowColor = ref(localStorage.getItem('shadowColor') || 'rgba(255, 255, 255, 1)');
const themeColorList = ref([]);
const outlineColor = ref('rgb(255, 255, 255)');
const outlineColor2 = ref('rgb(255, 255, 255)');

// 进度
const progress = computed(() => {
  if (songStore.songData?.player?.statePercent) {
    return (songStore.songData?.player?.statePercent * 100).toFixed(2);
  }
  return 0;
});

// 提取图片主题色
const getImgColor = () => {
  const colorThief = new ColorThief();
  const img = new Image();
  img.src = getCoverUrl(songStore.songData?.track?.cover);
  img.onload = function () {
    const color = colorThief.getColor(img);
    themeColor.value = `rgba(${color.join(',')}, 1)`;
    textColor.value = `rgba(${color.map(i => 255 - i).join(',')}, 1)`;
    shadowColor.value = `rgba(${color.map(i => 255 - i).join(',')}, 1)`;
    themeColorList.value = colorThief.getPalette(img).map((color) => `rgba(${color.join(',')}, 1)`);
    outlineColor.value = isColorDark(themeColor.value) ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
    outlineColor2.value = isColorDark(textColor.value) ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
  };
};
const getImgColor2 = () => {
  const img = new Image();
  img.src = getCoverUrl(songStore.songData?.track?.cover);
  img.onload = function () {
    outlineColor.value = isColorDark(themeColor.value) ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
    outlineColor2.value = isColorDark(textColor.value) ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)';
  };
};
// 监听封面变化
const oldCover = ref('');
if (!JSON.parse(localStorage.getItem('isCustomColor'))) {
  watch(
    () => songStore.songData?.track?.cover,
    (newVal, oldVal) => {
      oldCover.value = oldVal || '../assets/icons/music.svg';
      if (newVal && (newVal !== oldVal)) {
        // 获取主题色
        getImgColor();
      }
    },
  );
} else {
  watch(
    () => songStore.songData?.track?.cover,
    (newVal, oldVal) => {
      oldCover.value = oldVal || '/assets/icons/music.svg';
      if (newVal && (newVal !== oldVal)) {
        // 获取主题色
        getImgColor2();
      }
    },
  );
}

onMounted(() => {
  songStore.resetSongData();
});
</script>

<style lang="scss" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 1s ease 0.3s;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.slide-enter-active {
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
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
  background-color: var(--theme-color);
  box-shadow: 0 15px 40px 0 var(--shadow-color);
  // filter: drop-shadow(0 4px 10px var(--shadow-color));

  span {
    color: var(--text-color);
  }

  .cover {
    width: calc(100% - 200px);
    aspect-ratio: 1 / 1;
    position: relative;
    overflow: hidden;
    transition: border-color 1s ease;
    box-sizing: border-box;
    border: 10px solid var(--outline-color);
    background-color: transparent;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .song-container {
    width: 90%;
    display: flex;
    flex-direction: column;
    // mask-image: linear-gradient(to right, rgba(0, 0, 0, 0), #000 10%, #000 90%, rgba(0, 0, 0, 0));
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
      height: 15px;
      position: relative;
      border-radius: 10px;
      box-sizing: border-box;
      background-color: var(--outline-color2);
      transition: background-color 1s ease;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: -50%;
        left: 0;
        height: 200%;
        width: calc(var(--process) * 100%);
        box-sizing: border-box;
        background-color: var(--text-color);
        transition: width 1s ease;
      }
    }

    .play-container {
      width: 90%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 40px;

      .status {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: var(--text-color);
        position: relative;

        .line {
          position: absolute;
          width: 8px;
          height: 40px;
          border-radius: 4px;
          background-color: var(--outline-color2);
          left: 22px;
          top: 20px;
          transition: all 0.5s ease;
        }

        .line2 {
          height: 10px;
          transform-origin: 50% 4px;
        }

        .line3 {
          top: auto;
          bottom: 20px;
          height: 10px;
          transform-origin: 50% calc(100% - 4px);
        }

        .line4 {
          left: auto;
          right: 22px;
          transform-origin: 100% 50%;
        }
      }

      .pause {
        .line2 {
          height: 43px;
          transform: rotate(atan2(-2, 1));
        }

        .line3 {
          height: 43px;
          transform: rotate(atan2(2, 1));
        }

        .line4 {
          transform: scaleX(0);
        }
      }
    }
  }
}
</style>