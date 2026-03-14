<template>
  <div class="main">
    <!-- <MyHeader @open-tour="openTour" /> -->
    <div class="content">
      <!-- 左侧内容 -->
      <el-scrollbar
        ref="leftScrollbarRef"
        height="100%"
        style="flex: 1;"
        always
      >
        <div class="content-left">
          <div
            class="page-container"
            v-for="(item, index) in filterdPageList"
            :key="index"
          >
            <div class="page-header">
              <div class="header-left">
                <i class="iconfont icon-yemian"></i>
                <span class="title-span">{{ item.meta.title }}</span>
                <div class="tag-container">
                  <template
                    v-for="(tag, index) in item.meta.tags"
                    :key="index"
                  >
                    <el-tooltip
                      :content="tag.description"
                      placement="top"
                      effect="dark"
                    >
                      <el-tag
                        :type="tag.type"
                        :effect="params.tags.includes(tag.label) ? 'dark' : 'plain'"
                      >{{ tag.label }}</el-tag>
                    </el-tooltip>
                  </template>
                </div>
              </div>
              <div class="page-header-btn">
                <div @click="refresh(item.url, index)">
                  <el-tooltip
                    content="刷新组件"
                    placement="top"
                    effect="dark"
                  >
                    <img
                      :class="{ 'refresh-rotate': isRotating[index] }"
                      src="../assets/icons/refresh.svg"
                      alt="refresh"
                    >
                  </el-tooltip>
                </div>
                <div @click="copyUrl(item.url, index)">
                  <el-tooltip
                    content="复制URL"
                    placement="top"
                    effect="dark"
                  >
                    <transition
                      name="fade"
                      mode="out-in"
                      :appear="false"
                    >
                      <img
                        v-if="!copied[index]"
                        src="../assets/icons/copy.svg"
                        alt="copy"
                        class="fade"
                      >
                      <img
                        v-else
                        src="../assets/icons/success.svg"
                        alt="success"
                        class="fade"
                      >
                    </transition>
                  </el-tooltip>
                </div>
                <div @click.stop="openNow(item)">
                  <el-tooltip
                    content="在当前窗口打开"
                    placement="top"
                    effect="dark"
                  >
                    <img
                      src="../assets/icons/open-in-window.svg"
                      alt="open-in-window"
                    >
                  </el-tooltip>
                </div>
                <div @click="openNew(item.url)">
                  <el-tooltip
                    content="在新窗口打开"
                    placement="top"
                    effect="dark"
                  >
                    <img
                      src="../assets/icons/open-in-new.svg"
                      alt="open-in-new"
                    >
                  </el-tooltip>
                </div>
              </div>
            </div>
            <div class="page-content">
              <iframe
                :data-src="item.url"
                frameborder="0"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
        <el-empty
          v-if="filterdPageList.length === 0"
          description="暂无数据"
        >
          <template #image>
            <div></div>
          </template>
        </el-empty>
        <!-- 回到顶部 -->
        <el-backtop
          :target="'.el-scrollbar__wrap'"
          :visibility-height="200"
          :right="isCollapse ? 70 : 350"
          :bottom="40"
          class="back-top"
        />
      </el-scrollbar>
      <!-- 右侧内容 -->
      <div
        class="content-right-box"
        :class="isCollapse ? 'content-right-box-fold' : ''"
      >
        <el-scrollbar
          v-if="!isCollapse"
          height="100%"
          always
        >
          <div class="content-right">
            <div>
              <span class="title">组件筛选</span>
              <div class="form-item">
                <span>组件类型</span>
                <el-segmented
                  v-model="params.type"
                  :options="typeOptions"
                  @change="handleTypeChange"
                >
                  <template #default="scope">
                    <span>{{ scope.item.label }}</span>
                  </template>
                </el-segmented>
              </div>
              <div class="form-item">
                <span>组件名称</span>
                <el-input
                  v-model="params.name"
                  placeholder="根据组件名称筛选"
                  clearable
                />
              </div>
              <div class="form-item">
                <span>组件标签</span>
                <el-select
                  v-model="params.tags"
                  placeholder="根据组件标签筛选"
                  value-key="label"
                  filterable
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  :max-collapse-tags="3"
                >
                  <el-option
                    v-for="item in tagList"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="divider"></div>
            <div>
              <span class="title">统计信息</span>
              <div>
                <span>组件数量：</span>
                <span>{{ filterdPageList.length }} / {{ pageList.length }}&ensp;个</span>
              </div>
            </div>
            <div class="divider"></div>
            <div class="system-box">
              <span class="title">系统配置</span>
              <div>
                <span>请求间隔：</span>
                <span
                  class="right-text"
                  :title="queryTime"
                >{{ queryTime }}&ensp;ms</span>
                <el-icon
                  class="edit-btn"
                  title="点击修改请求间隔"
                  @click="editQueryTime"
                >
                  <Edit />
                </el-icon>
              </div>
              <div>
                <span>游戏名称：</span>
                <span
                  class="right-text"
                  :title="gameName"
                >{{ gameName }}</span>
                <el-icon
                  class="edit-btn"
                  title="点击修改游戏名称"
                  @click="editGameName"
                >
                  <Edit />
                </el-icon>
              </div>
              <div>
                <span>电脑配置：</span>
                <span
                  class="right-text"
                  :title="PCConfig"
                >{{ PCConfig }}</span>
                <el-icon
                  class="edit-btn"
                  title="点击修改电脑配置"
                  @click="editPCConfig"
                >
                  <Edit />
                </el-icon>
              </div>
              <div>
                <span>颜色搭配：</span>
                <div
                  class="color-box"
                  :style="{ backgroundColor: backgroundColor, color: textColor, filter: `drop-shadow(0 1px 4px ${shadowColor})` }"
                >
                  <span>预览文本</span>
                </div>
                <el-icon
                  class="edit-btn"
                  title="点击修改颜色搭配"
                  @click="editColor"
                >
                  <Edit />
                </el-icon>
              </div>
              <div>
                <span>rain组件配置：</span>
                <span
                  class="right-text"
                  :title="`是否有雨：${rainConfig.isRain ? '是' : '否'}，雨滴数量：${rainConfig.amount}，雨滴角度：${rainConfig.angle}°，雨滴速度：${rainConfig.speed}`"
                >{{
                  Object.values(rainConfig).join(", ") }}</span>
                <el-icon
                  class="edit-btn"
                  title="点击修改rain组件配置"
                  @click="editRainConfig"
                >
                  <Edit />
                </el-icon>
              </div>
            </div>
            <div
              class="expand-btn"
              @click="toggleCollapse"
            >
              <el-icon>
                <Expand />
              </el-icon>
            </div>
          </div>
        </el-scrollbar>
        <div
          v-else
          @click="toggleCollapse"
        >
          <el-icon>
            <Fold />
          </el-icon>
        </div>
      </div>
    </div>
    <!-- 颜色选取dialog -->
    <ColorSelectDialog
      ref="colorSelectRef"
      @closed="handleColorChange"
    />
    <!-- rain配置dialog -->
    <RainConfigDialog
      ref="rainConfigRef"
      @closed="handleRainChange"
    />
  </div>
</template>
<script setup>
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import router from '../router';
import { ElMessage, ElTooltip, ElBacktop, ElMessageBox, ElInput, ElTag } from 'element-plus';
import { Edit, Fold, Expand } from '@element-plus/icons-vue';
import ColorSelectDialog from '../components/colorSelectDialog.vue';
import RainConfigDialog from '../components/rainConfigDialog.vue';
import { tagList } from '../dicts/tags';
import ColorThief from 'colorthief';
import { getCoverUrl } from '../utils/cover';
import { useSongStore } from '../stores/song';

const songStore = useSongStore();
// 颜色选取dialog
const colorSelectRef = ref(null);
const handleColorChange = () => {
  window.location.reload();
};
// rain配置dialog
const rainConfigRef = ref(null);
const handleRainChange = () => {
  window.location.reload();
};
// 组件列表
let routeList = router.getRoutes();
const pageList = routeList.filter(item => item.meta.isPage).map(item => {
  item.url = window.location.origin + window.location.pathname + '#' + item.path;
  return item;
});
const leftScrollbarRef = ref(null);
const typeOptions = [
  {
    value: 'combined',
    label: '组合组件',
  },
  {
    value: 'uncombined',
    label: '独立组件',
  },
];
const handleTypeChange = (value) => {
  params.type = value;
  leftScrollbarRef.value.setScrollTop(0);
};
const params = reactive({
  type: 'combined',
  name: '',
  tags: Object.values(tagList).map(i => i.label),
});
const filterdPageList = computed(() => {
  return pageList.filter(item => item.meta.title.includes(params.name) && item.meta.tags.some(i => params.tags.includes(i.label)) && item.meta.type === params.type);
});

// 刷新组件
const isRotating = ref([]);
const refresh = (url, index) => {
  isRotating.value[index] = true;

  const iframes = document.querySelectorAll('iframe');
  if (iframes[index]) {
    // iframes[index].contentWindow.location.reload();
    iframes[index].src = 'about:blank';
    setTimeout(() => {
      iframes[index].src = url;
    }, 100)
  }

  setTimeout(() => (isRotating.value[index] = false), 1000);
};
// 复制url
const copied = ref([]);
const copyUrl = async (url, index) => {
  try {
    await navigator.clipboard.writeText(url);
    copied.value[index] = true;
    ElMessage.success('复制成功');
    setTimeout(() => (copied.value[index] = false), 2000);
  } catch (error) {
    ElMessage.error('复制失败');
  }
  // const input = document.createElement('input');
  // input.value = url;
  // document.body.appendChild(input);
  // input.select();
  // document.execCommand('copy');
  // document.body.removeChild(input);
  // alert('复制成功');
};
// 当前窗口打开
const openNow = async (route) => {
  await router.push(route.path);
  await new Promise(resolve => setTimeout(resolve, 100));
};
// 新窗口打开
const openNew = (url) => {
  window.open(url, '_blank');
};

// 请求间隔
const queryTime = ref(localStorage.getItem('queryTime') || '-');
const editQueryTime = () => {
  ElMessageBox.prompt('请输入请求间隔（单位：ms）', '修改请求间隔', {
    type: 'info',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: localStorage.getItem('queryTime') || '-',
    inputValidator: (value) => {
      if (value === "") return '请输入请求间隔';
      if (isNaN(value)) return '请输入数字';
      if (value < 100) return '请求间隔不能小于100ms';
      return true;
    },
    inputErrorMessage: '请输入数字',
    draggable: true,
    closeOnClickModal: false,
  })
    .then(({ value }) => {
      localStorage.setItem('queryTime', value);
      queryTime.value = value;
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
      window.location.reload();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消修改',
      })
    })
    .finally(() => {
      queryTime.value = localStorage.getItem('queryTime') || '-';
    });
};
// 游戏名称
const gameName = ref(JSON.parse(localStorage.getItem('extraInfo'))[0][0]);
const editGameName = () => {
  let extraInfo = JSON.parse(localStorage.getItem('extraInfo'));
  ElMessageBox.prompt('请输入游戏名称', '修改游戏名称', {
    type: 'info',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: extraInfo[0][0],
    // inputValidator: (value) => {
    //   if (value === "") return '请输入游戏名称';
    //   return true;
    // },
    draggable: true,
    closeOnClickModal: false,
  })
    .then(({ value }) => {
      if (value !== '') {
        extraInfo[0][0] = value;
      } else {
        extraInfo[0].length = 0;
      }
      localStorage.setItem('extraInfo', JSON.stringify(extraInfo));
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
      reloadAll();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消修改',
      })
    })
    .finally(() => {
      gameName.value = JSON.parse(localStorage.getItem('extraInfo'))[0][0];
    });
};
// 配置信息
const PCConfig = ref(JSON.parse(localStorage.getItem('extraInfo'))[1].join(' '));
const editPCConfig = () => {
  let extraInfo = JSON.parse(localStorage.getItem('extraInfo'));
  ElMessageBox.prompt('请输入配置信息(以空格分隔)', '修改配置信息', {
    type: 'info',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: JSON.parse(localStorage.getItem('extraInfo'))[1].join(' '),
    // inputValidator: (value) => {
    //   if (value === "") return '请输入配置信息';
    //   return true;
    // },
    draggable: true,
    closeOnClickModal: false,
  })
    .then(({ value }) => {
      if (value !== '') {
        extraInfo[1] = value.split(' ');
      } else {
        extraInfo[1].length = 0;
      }
      localStorage.setItem('extraInfo', JSON.stringify(extraInfo));
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
      reloadAll();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消修改',
      })
    })
    .finally(() => {
      PCConfig.value = JSON.parse(localStorage.getItem('extraInfo'))[1].join(' ');
    });
};
// 颜色搭配
const backgroundColor = ref(localStorage.getItem('backgroundColor') || 'rgba(0, 0, 0, 1)');
const textColor = ref(localStorage.getItem('textColor') || 'rgba(255, 255, 255, 1)');
const shadowColor = ref(localStorage.getItem('shadowColor') || 'rgba(255, 255, 255, 1)');
// 提取图片主题色
const getImgColor = () => {
  const colorThief = new ColorThief();
  const img = new Image();
  img.src = getCoverUrl(songStore.songData?.track?.cover);
  img.onload = function () {
    const color = colorThief.getColor(img);
    backgroundColor.value = `rgba(${color.join(',')}, 1)`;
    textColor.value = `rgba(${color.map(i => 255 - i).join(',')}, 1)`;
    shadowColor.value = `rgba(${color.map(i => 255 - i).join(',')}, 1)`;
  };
};
// 监听封面变化
if (!JSON.parse(localStorage.getItem('isCustomColor'))) {
  watch(
    () => songStore.songData?.track?.cover,
    (newVal, oldVal) => {
      if (newVal && (newVal !== oldVal)) {
        // 获取主题色
        getImgColor();
      }
    },
  );
};
const editColor = () => {
  colorSelectRef.value.openDialog();
};
// rain配置
const rainConfig = JSON.parse(localStorage.getItem('rainConfig') || {});
const editRainConfig = () => {
  rainConfigRef.value.openDialog();
};
// 切换折叠擦边菜单
const isCollapse = ref(JSON.parse(localStorage.getItem('menuFold')) || false);
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  localStorage.setItem('menuFold', JSON.stringify(isCollapse.value));
};
// 重新加载所有iframe
const reloadAll = () => {
  let iframes = document.querySelectorAll('iframe');
  iframes.forEach((item) => {
    item.contentWindow.location.reload();
  });
};
// iframe懒加载
const debounceTimers = new Map();
const debounce = (fn, delay, key) => {
  if (debounceTimers.has(key)) {
    clearTimeout(debounceTimers.get(key));
  }
  const timer = setTimeout(() => {
    fn();
    debounceTimers.delete(key);
  }, delay);
  debounceTimers.set(key, timer);
}
const handleIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    const iframe = entry.target.querySelector('iframe');
    const containerIndex = Array.from(document.querySelectorAll('.page-container')).indexOf(entry.target);
    if (entry.isIntersecting) {
      // 进入视口
      if (iframe) {
        iframe.src = iframe.getAttribute('data-src');
      }
      if (debounceTimers.has(containerIndex)) {
        clearTimeout(debounceTimers.get(containerIndex));
        debounceTimers.delete(containerIndex);
      }
    } else {
      // 离开视口
      debounce(() => {
        if (iframe) {
          iframe.src = 'about:blank';
        }
      }, 5000, containerIndex);
    }
  });
};

const observerRef = ref(null);
const observePageContainers = () => {
  if (observerRef.value) {
    document.querySelectorAll('.page-container').forEach(item => {
      observerRef.value.unobserve(item);
    });
  }
  const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '0px',
    threshold: 0.0,
  });
  document.querySelectorAll('.page-container').forEach((item) => {
    observer.observe(item);
  });
  observerRef.value = observer;
};
watch(
  () => filterdPageList.value,
  (newVal) => {
    nextTick(() => {
      observePageContainers();
    })
  }
);

onMounted(() => {
  copied.value = [];
  isRotating.value = [];
  pageList.forEach(item => {
    copied.value.push(false);
    isRotating.value.push(false);
  });
  if (!JSON.parse(localStorage.getItem('isCustomColor'))) {
    getImgColor();
  }
  // const observer = new IntersectionObserver(handleIntersection, {
  //   root: null,
  //   rootMargin: '0px',
  //   threshold: 0,
  // });
  // document.querySelectorAll('.page-container').forEach((item) => {
  //   observer.observe(item);
  // });
  observePageContainers();
});

onUnmounted(() => {
  if (observerRef.value) {
    observerRef.value.disconnect();
  }
});
</script>
<style lang="scss" scoped>
.main {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: background-color 0.3s ease;
  background-color: var(--background-color);

  .content {
    height: 100%;
    display: flex;
    flex-direction: row;

    .content-left {
      flex: 1;
      height: 100%;
      box-sizing: border-box;
      padding: 20px;
      display: grid;
      gap: 20px;
      grid-template-columns: repeat(auto-fit, minmax(600px, auto));

      .page-container {
        // width: 100%;
        height: min-content;
        border-radius: 10px;
        box-shadow: 0 4px 10px var(--shadow-color);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        &:hover {
          box-shadow: 0 4px 12px var(--shadow-color-hover);
          // transform: translateY(-5px);
        }

        .page-header {
          width: 100%;
          height: 50px;
          box-sizing: border-box;
          padding: 0 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          align-items: center;
          color: #fff;
          background: #BE5869;
          background: -webkit-linear-gradient(to right, #BE5869, #c48791);
          background: linear-gradient(to right, #BE5869, #c48791);
          position: relative;

          .header-left {
            user-select: none;
            display: flex;
            align-items: center;
            gap: 10px;

            .title-span {
              font-size: 30px;
              white-space: nowrap;
            }

            .tag-container {
              margin-left: 10px;
              display: flex;
              gap: 5px;
            }
          }

          i {
            font-size: 30px;
          }

          img {
            width: 35px;
            height: 35px;
          }

          .page-header-btn {
            height: 35px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            border-radius: 5px;
            overflow: hidden;
            color: #eee;
            gap: 10px;

            &>div {
              height: 28px;
              aspect-ratio: 1/1;
              cursor: pointer;
              user-select: none;

              img {
                width: 100%;
                height: 100%;
              }

              .fade-enter-active,
              .fade-leave-active {
                transition: opacity 0.15s ease-out;
              }

              .fade-enter-from,
              .fade-leave-to {
                opacity: 0;
              }

              .refresh-rotate {
                animation: refresh-rotate 1s ease-out;
              }

              @keyframes refresh-rotate {
                from {
                  transform: rotate(0deg);
                }

                to {
                  transform: rotate(360deg);
                }
              }
            }
          }
        }

        .page-content {
          width: 100%;
          aspect-ratio: 16/9;

          iframe {
            width: 100%;
            height: 100%;
            position: relative;
            pointer-events: none;

            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              height: inherit;
              width: inherit;
              z-index: 2;
              pointer-events: auto;
            }
          }
        }
      }
    }

    .back-top {
      background-color: var(--background-color);
      box-shadow: 0 0 6px var(--shadow-color-hover);
      transition: right 0.5s ease;
    }

    .content-right-box {
      width: 320px;
      height: calc(100% - 20px);
      margin: 10px;
      justify-content: flex-start;
      box-sizing: border-box;
      border-radius: 10px;
      box-shadow: 0 0 10px var(--shadow-color);
      color: var(--text-color);
      font-size: 15px;
      transition: all 0.3s ease, width 0.5s ease;

      .content-right {
        display: flex;
        flex-direction: column;
        position: relative;

        // 模块
        &>div:not(.divider) {
          width: 100%;
          box-sizing: border-box;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;

          .title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
            border-left: 6px solid #4286f4;
            padding-left: 5px;
          }

          .form-item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;

            .el-segmented {
              --el-border-radius-base: 16px;
            }
          }

          // 单行内容
          &>div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 15px;
            min-height: 20px;
            position: relative;

            span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .right-text {
              flex: 1;
              text-align: right;
            }

            .color-box {
              height: 20px;
              padding: 0 10px;
              border-radius: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .edit-btn {
              position: absolute;
              opacity: 0;
              right: -20px;
              top: 50%;
              transform: translateY(-50%);
              transition: all 0.3s ease;
              user-select: none;
              cursor: pointer;
              font-size: 18px;
            }

            &:hover {
              .edit-btn {
                opacity: 1;
              }
            }
          }
        }

        .divider {
          width: 100%;
          height: 1px;
          background-color: var(--shadow-color);
        }

        .expand-btn {
          width: min-content !important;
          position: absolute;
          top: 0;
          right: 0;
          font-size: 22px;
          user-select: none;
          cursor: pointer;
        }
      }
    }

    .content-right-box-fold {
      width: 40px;
      font-size: 22px;
      user-select: none;
      cursor: pointer;

      &:hover {
        box-shadow: 0 0 10px var(--shadow-color-hover);
      }

      div {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}
</style>