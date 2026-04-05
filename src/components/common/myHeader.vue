<template>
  <div class="header">
    <div class="header-left">
      <img
        src="../../assets/icons/music.svg"
        alt="music"
      >
      <span>自定义歌曲组件</span>
    </div>
    <div class="header-center">
      
    </div>
    <div class="header-right">
      <span class="time">{{ timeNow }}</span>
      <img
        src="../../assets/icons/email.svg"
        alt="email"
        title="联系作者"
        @click="openEmail"
      >
      <img
        src="../../assets/icons/theme.svg"
        alt="github"
        title="切换主题"
        @click="changTheme"
      >
      <img
        src="../../assets/icons/github.svg"
        alt="github"
        title="在github上查看"
        @click="openGithub"
      >
      <img
        src="../../assets/icons/question.svg"
        alt="question"
        title="如何使用"
        @click="openTour"
      >
    </div>
    <!-- 漫游式引导 -->
    <el-tour
      v-model="tourOpen"
      :target-area-clickable="false"
      @close="handleFinishTour"
    >
      <el-tour-step
        title="自定义歌曲组件"
        description="欢迎使用myNowPlaying，点击开始新手引导。"
        :next-button-props="{ children: '开始' }"
      />
      <el-tour-step
        target=".page-header-btn"
        title="歌曲组件"
        description="每个歌曲组件右上角可以进行组件相关操作。"
        placement="bottom"
        :prev-button-props="{ children: '上一步' }"
        :next-button-props="{ children: '下一步' }"
      />
      <el-tour-step
        target=".content-right-box"
        title="控制面板"
        description="控制面板包含组件筛选功能、组件信息统计、系统配置信息。"
        placement="left"
        :prev-button-props="{ children: '上一步' }"
        :next-button-props="{ children: '下一步' }"
      />
      <el-tour-step
        target=".system-box"
        title="系统信息"
        placement="left"
        :prev-button-props="{ children: '上一步' }"
        :next-button-props="{ children: '下一步' }"
      >
        <div>系统信息可以进行编辑操作。</div>
        <br />
        <div>（注意：直播软件中系统配置与浏览器不通用，浏览器只起预览作用，修改系统配置请在直播软件中选中源并点击交互进行修改）</div>
      </el-tour-step>
      <el-tour-step
        target=".header-right"
        title="系统操作"
        description="标题栏右侧可以进行系统相关操作"
        placement="bottom-end"
        :prev-button-props="{ children: '上一步' }"
        :next-button-props="{ children: '下一步' }"
      />
      <el-tour-step
        title="右键菜单"
        description="鼠标右键可以进行组件刷新、页面跳转操作"
        :prev-button-props="{ children: '上一步' }"
        :next-button-props="{ children: '下一步' }"
      />
      <el-tour-step
        target=".fade"
        title="如何使用"
        placement="bottom"
        :prev-button-props="{ children: '上一步' }"
        :next-button-props="{ children: '完成' }"
      >
        <div>方法1：复制组件URL，填入直播软件中浏览器源的URL地址。</div>
        <br />
        <div>方法2：直接复制根目录URL，填入直播软件中浏览器源的URL地址，再点击浏览器源组件的交互按钮来切换页面。</div>
      </el-tour-step>
      <template #indicators="{ current, total }">
        <span style="color: var(--el-tour-text-color);">{{ current + 1 }} / {{ total }}</span>
      </template>
    </el-tour>
  </div>
</template>

<script setup>
import { markRaw, onBeforeUnmount, onMounted, ref } from 'vue';
import router from '../../router';
import { ElMessageBox } from 'element-plus';
import { Message } from '@element-plus/icons-vue';

const timeNow = ref(new Date().toLocaleString());
let dateInterval = null;

const emit = defineEmits(['openTour']);

const routeList = router.getRoutes().find(i => i.path === '/').children;
// 联系作者
const openEmail = () => {
  ElMessageBox.alert('邮箱：3460391727@qq.com', '联系作者', {
    confirmButtonText: '关闭',
    icon: markRaw(Message),
    closeOnClickModal: true,
    closeOnPressEscape: true,
  });
};
// 切换主题
const changTheme = () => {
  let theme = localStorage.getItem('theme');
  if (theme === 'dark') {
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }
};
// 打开github
const openGithub = () => {
  window.open('https://github.com/lililiaa/LiNowPlaying', '_blank');
};
// 漫游式引导
const tourOpen = ref(false);
const openTour = () => {
  tourOpen.value = true;
};
const handleFinishTour = () => {
  localStorage.setItem('tour', 'true');
  tourOpen.value = false;
};

onMounted(() => {
  if (localStorage.getItem('tour') !== 'true') {
    setTimeout(() => {
      openTour();
    }, 1000);
  }
  dateInterval = setInterval(() => {
    timeNow.value = new Date().toLocaleString();
  }, 1000);
});

onBeforeUnmount(() => {
  if (dateInterval) clearInterval(dateInterval);
});
</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 30px;
  background: #8360c3;
  background: -webkit-linear-gradient(to right, #2ebf91, #8360c3);
  background: linear-gradient(to right, #2ebf91, #8360c3);
  box-shadow: 0 0 10px var(--shadow-color-hover);
  z-index: 2;

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
    user-select: none;
    font-size: 35px;

    img {
      width: 50px;
      height: 50px;
    }
  }

  .header-center {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    div {
      display: flex;
      gap: 5px;
      user-select: none;
      cursor: pointer;

      span {
        font-size: 25px;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 10px;
    user-select: none;

    .time {
      font-size: 22px;
      margin-right: 10px;
    }

    img {
      width: 30px;
      height: 30px;
      cursor: pointer;
      transition: filter 0.3s ease;

      &:active {
        filter: brightness(0.8);
      }
    }
  }
}

// 移动端适配
@media screen and (max-width: 768px) {
  .header {
    height: 50px;
    padding: 0 15px;

    .header-left {
      gap: 10px;
      font-size: 20px;

      img {
        width: 35px;
        height: 35px;
      }

      span {
        font-size: 18px;
      }
    }

    .header-right {
      gap: 8px;

      .time {
        font-size: 16px;
        margin-right: 5px;
      }

      img {
        width: 26px;
        height: 26px;
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .header {
    height: 45px;
    padding: 0 10px;

    .header-left {
      gap: 8px;
      font-size: 16px;

      img {
        width: 30px;
        height: 30px;
      }
    }

    .header-right {
      gap: 6px;

      .time {
        display: none; // 小屏幕隐藏时间
      }

      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>