<template>
  <div>
    <div class="vc-image-container" id="box">
      <div class="vc-image-tool">
        <ul class="clearfix">
          <li class="fl">
            <button class="vc-image--btn"
                    title="选择"
                    @click="select"
                    :class="[ activeId === 100 ?'active':'' ]">
              <svg-icon icon-class="select"></svg-icon>
            </button>
          </li>
          <li class="fl" v-for="obj in operationList"
              :key="obj.id">
            <button class="vc-image--btn"
                    :title="obj.name"
                    @click="shapeToggle(obj.id)">
              <svg-icon :icon-class="obj.icon"></svg-icon>
            </button>
          </li>
          <li class="fl">
            <button class="vc-image--btn"
                    title="放大">
              <svg-icon icon-class="zoomOut"></svg-icon>
            </button>
          </li>
          <li class="fl">
            <button class="vc-image--btn"
                    title="缩小">
              <svg-icon icon-class="zoomIn"></svg-icon>
            </button>
          </li>
        </ul>
        <div class="style-config" v-if="activeId && (activeId !== 5)">
          <div class="stroke-width" v-if="activeId<4">
            <span :class="currentEdit.strokeWidth===2?'checked':''"
                  @click="changeStrokeWidth(2)">
              <span class="dot mini"></span>
            </span>
            <span :class="currentEdit.strokeWidth===4?'checked':''"
                  @click="changeStrokeWidth(4)">
              <span class="dot middle"></span></span>
            <span :class="currentEdit.strokeWidth===8?'checked':''"
                  @click="changeStrokeWidth(8)">
              <span class="dot large"></span></span>
          </div>
          <div class="font-size-select" v-if="activeId === 4">
            <el-select v-model="fontSize" size="mini" @change="changeFontSize">
              <el-option v-for="size in fontSizeList" :key="size" :value="size">{{size}}</el-option>
            </el-select>
          </div>
          <div class="stroke-color clearfix">
            <span class="checked fl" :style="{ backgroundColor: checkedColor }"></span>
            <div class="check-group fl">
              <span v-for="(color,i) in colorList"
                    :key="i"
                    :style="{backgroundColor: color}"
                    @click="changeColor(color)"></span>
            </div>
          </div>
        </div>
      </div>
      <img src="../assets/267.png"/>
    </div>
  </div>
</template>

<script>
import $ from '@/utils/jq';

export default {
  name: 'homePage',
  props: {
    colorList: {
      type: Array,
      default: () => ['#ff3540', '#ff5d94', '#d256d0', '#10a9d7', '#05a446', '#ffbf2f', '#ff6632', '#999999', '#000000', '#feffff'],
    },
    fontSizeList: {
      type: Array,
      default: () => [8, 9, 10, 12, 14, 16, 18, 20, 22],
    },
  },
  data() {
    return {
      activeId: 4,
      operationList: [
        {
          id: 1,
          name: '箭头',
          icon: 'path'
        },
        {
          id: 2,
          name: '方框',
          icon: 'rect'
        },
        {
          id: 3,
          name: '圆形',
          icon: 'ellipse'
        },
        {
          id: 4,
          name: '文本',
          icon: 'text'
        }
      ],
      fontSize: 14,
      checkedColor: '',
    };
  },
  methods: {
    select() {

    },
    shapeToggle() {

    },
    changeFontSize() {

    },
    changeColor(color) {
      this.checkedColor = color;
    },
  },
  mounted() {
    console.log($('#box'))
  },
};
</script>

<style scoped>

</style>
