<template>
  <div class="draw-canvas">
    <div class="tool-bar">
      <ul class="clearfix">
        <li class="fl" v-for="obj in operationList"
            :key="obj.id">
          <button class="vc-image--btn"
                  :title="obj.name" @click="button_clicked(obj.id)">
            <svg-icon :icon-class="obj.icon"></svg-icon>
          </button>
        </li>
      </ul>
    </div>
    <div class="canvas-main">
      <div class="draw_wrapper" ref="draw_wrapper" id="drawWrapper">
        <canvas ref="canvas" id="canvasId"
                :width="canvas_wh.width"
                :height="canvas_wh.height">你的浏览器不支持 canvas，请升级你的浏览器</canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Drawboard, { DrawMode } from '../utils/drawboard';
import {
  register_arror_draw,
  register_right_draw,
  register_wrong_draw,
  register_aplus_draw,
  register_aminus_draw,
} from '../utils/custom';
import { get_image_natural_wh } from '../utils/common';

const DEFAULT_MODE = 4; // 默认画笔模式
const DEFAULT_ANGLE = 0; // 默认旋转角度
const DEFAULT_ZOOM = 100; // 默认缩放比例
const DEFAULT_COLOR = '#FF0000'; // 默认颜色

// 字体大小
const DEFAULT_FONT_SIZE = 16; // 默认字体大小
const DEFAULT_MAX_FONT_SIZE = 128;
const DEFAULT_MIN_FONT_SIZE = 32;

// 线宽大小
const DEFAULT_BRUSH_WIDTH = 4;
const DEFAULT_MAX_BRUSH_WIDTH = 32;
const DEFAULT_MIN_BRUSH_WIDTH = 4;

const ROTATE_DIALOG_KEY = 'noshowdrawrotatedialog';
const ROTATE_DIALOG_VAL = '1';
export default {
  name: 'canvasPage',
  data() {
    return {
      imgUrl: '',
      operationList: [
        {
          id: 100,
          name: '选择',
          icon: 'select',
        },
        {
          id: 1,
          name: '方框',
          icon: 'rect',
        },
        {
          id: 2,
          name: '圆形',
          icon: 'ellipse',
        },
        {
          id: 3,
          name: '箭头',
          icon: 'arrow',
        },
        {
          id: 4,
          name: '画线',
          icon: 'line',
        },
        {
          id: 5,
          name: '画笔',
          icon: 'pen',
        },
        {
          id: 6,
          name: '文本',
          icon: 'text',
        },
        {
          id: 50,
          name: '撤销',
          icon: 'undo',
        },
        {
          id: 51,
          name: '清屏',
          icon: 'clean',
        },
        {
          id: 52,
          name: '导出图片',
          icon: 'clean',
        }
      ],
      img_loading: false,
      drawboard: null,
      current_button_index: 4,
    // 颜色
      color: DEFAULT_COLOR,
    // 处于移动模式
      in_move_mode: false,
      rotate_angle: DEFAULT_ANGLE,
      init_zoom: DEFAULT_ZOOM / 100,
      zoom: DEFAULT_ZOOM,
      font_size: DEFAULT_FONT_SIZE,
      canvas_wh: { width: 1000, height: 450 },
      brush_width: DEFAULT_BRUSH_WIDTH,
      rotate_dialog: false,
      rotate_dialog_checked: false,
      current_size_mode_is_font: false,
      size_input_val: DEFAULT_BRUSH_WIDTH,
      size_picker_val: DEFAULT_BRUSH_WIDTH,
      show_picker_slider: false,
      init_state: { is_img: false, img_check: true, data: '' },
    };
  },
  created() {
    this.imgUrl = require('@/assets/234.jpg');
  },
  computed: {
    picker_min_max_size() {
      if (this.current_size_mode_is_font) {
        return {min: DEFAULT_MIN_FONT_SIZE, max: DEFAULT_MAX_FONT_SIZE};
      }

      return {min: DEFAULT_MIN_BRUSH_WIDTH, max: DEFAULT_MAX_BRUSH_WIDTH};
    },
  },
  mounted() {
    this.draw(this.imgUrl);
    this.delete_event = this.delete_handler.bind(this);
    window.addEventListener('keyup', this.delete_event);
  },
  destroyed() {
    window.removeEventListener('keyup', this.delete_event);
    if (!this.drawboard) { return; }
    this.drawboard.destroyed();
  },
  methods: {
    init_drawboard() {
      if (this.drawboard) {
        return;
      }
      const $canvas = this.$refs.canvas;
      if (!$canvas) {
        console.error('[draw-dialog] canvas not found!');
        return;
      }
      this.drawboard = new Drawboard({
        canvas: document.getElementById('canvasId'),
        brush_color: this.color,
        brush_width: DEFAULT_BRUSH_WIDTH,
        mode: DrawMode.PEN,
        back_event: (history) => {
          if (!history.length) {
            this.$message.warning('没有可撤销的记录了');
            this.draw_init_state();
          }
        },
        zoom_change: (zoom) => {
          const scale = zoom / this.init_zoom;
          const z = parseInt(`${scale * 100}`, 10);
          this.zoom = z;
          this.set_zoom_size();
        },
        drag_event: (status) => {
          if (status) {
            this.in_move_mode = false;
          }
        },
      });
      console.log('this.drawboard', this.drawboard)
      this.current_button_index = DEFAULT_MODE;
      this.register_custom_draw_func();
    },
    draw(str) {
      // const win_height = window.screen.height - 400;
      // const win_width = document.body.clientWidth;
      const win_height = document.getElementById('drawWrapper').offsetHeight;
      const win_width = document.getElementById('drawWrapper').offsetWidth;
      this.canvas_wh = {width: win_width, height: win_height};
      this.set_img(str);
    },
    /** 设置图片 */
    async set_img(src, angle = DEFAULT_ANGLE, imgcheck = true) {
      this.img_loading = true;
      // const img_src = network_url_replace_to_root_url(get_img_src_or_url(src));
      const img_src = src;
      console.log('draw_dialog url: ', src, img_src);

      const set_error_img = () => {
        console.warn('drawing_board load image error ', img_src);
        this.drawboard.set_text({ text: ['图片加载失败:   ' + img_src], left: 15, top: 15, color: 'red' });
      };
      const finish = () => { this.img_loading = false; };

      try {
        let { width, height } = await get_image_natural_wh(img_src);
        if (width < this.canvas_wh.width) {
          width = this.canvas_wh.width;
        }
        if (height < this.canvas_wh.height) {
          height = this.canvas_wh.height;
        }

        if (angle === 90 || angle === 270) {
          const tempw = width;
          width = height;
          height = tempw;
        }

        let zoom = 1;
        if (width > this.canvas_wh.width) {
          zoom = this.canvas_wh.width / width;
          height = height * zoom;
        }
        this.init_zoom = zoom;

        if (height > this.draw_content_height) {
          // this.canvas_wh.height = height;
        }

        await this.reset_canvas();
        if (!this.drawboard) {
          finish();
          return;
        }
        if (this.drawboard) {
          this.drawboard.set_bg_img({ src: img_src, angle, catch: set_error_img, finish });
          this.drawboard.set_min_zoom(0.2 * zoom);
          this.drawboard.set_max_zoom(3 * zoom);
          this.drawboard.set_zoom(zoom);
        }
      } catch (err) {
        this.reset_canvas();
        set_error_img();
        finish();
      }

      this.init_state.is_img = true;
      this.init_state.img_check = imgcheck;
      this.init_state.data = src;
    },
    /** 注册自定义绘图函数 */
    register_custom_draw_func() {
      if (!this.drawboard) { return; }
      // 箭头
      register_arror_draw('箭头', this.drawboard);
      // 勾
      // register_right_draw(this.btn_names[8], this.drawboard);
      // 叉
      // register_wrong_draw(this.btn_names[9], this.drawboard);
      // A+
      // register_aplus_draw(this.btn_names[10], this.drawboard);
      // A-
      // register_aminus_draw(this.btn_names[11], this.drawboard);

    },
    /** 按比例设置线宽和字体大小 */
    set_zoom_size() {
      if (!this.drawboard) { return; }
      const zoom = this.zoom / 100;
      this.drawboard.set_brush({width: this.brush_width / zoom});
      this.drawboard.set_font_size(this.font_size / zoom);
      console.log(`'当前比例: ${zoom}; 当前线宽: ${this.brush_width}/${this.brush_width / zoom}; 字体为: ${this.font_size}/${this.font_size / zoom}`);
    },
    draw_init_state() {
      if (this.init_state.is_img) {
        // this.set_img(this.init_state.data, this.rotate_angle, this.init_state.img_check);
      } else {
        // this.set_text(this.init_state.data, this.rotate_angle);
      }
    },
    /** 键盘事件-删除 */
    delete_handler(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      if (!this.show) { return; }
      // DEL 删除按钮
      if (ev.keyCode !== 46) { return; }
      this.delete_selected();
    },
    /** 删除 */
    delete_selected() {
      if (!this.drawboard) { return; }
      this.drawboard.delete_selected();
    },
    async reset_canvas() {
      await this.$nextTick();
      this.destroy_drawboard();
      this.init_drawboard();
    },
    destroy_drawboard() {
      if (this.drawboard) {
        this.drawboard.destroyed();
      }
      this.drawboard = null;
    },
    /* 移动 */
    change_move_mode() {
      if (!this.drawboard) { return; }
      this.in_move_mode = !this.in_move_mode;
      if (this.in_move_mode) {
        this.drawboard.enable_select();
      } else {
        this.button_clicked(this.current_button_index);
      }
    },
    button_clicked(button_index) {
      if (!this.drawboard) { return; }

      // 退出移动模式
      if (this.in_move_mode && ([50, 51].indexOf(button_index) === -1)) {
        this.in_move_mode = false;
      }
      switch (button_index) {
        case 100: // 选择
          this.change_move_mode();
          this.current_button_index = button_index;
          break;
        case 1: // 画矩形
          this.drawboard.set_mode(DrawMode.RECT);
          this.current_button_index = button_index;
          break;
        case 2: // 画圆
          this.drawboard.set_mode(DrawMode.CIRCLE);
          this.current_button_index = button_index;
          break;
        case 3: // 画箭头
          this.drawboard.set_custom_draw_func_enable(['箭头']);
          this.current_button_index = button_index;
          break;
        case 4: // 画直线
          this.drawboard.set_mode(DrawMode.LINE);
          this.current_button_index = button_index;
          break;
        case 5: // 画笔
          this.drawboard.set_mode(DrawMode.PEN);
          this.current_button_index = button_index;
          break;
        case 6: // 输入文字
          this.drawboard.set_mode(DrawMode.TEXT);
          this.current_button_index = button_index;
          break;
        case 50: // 撤销
          this.drawboard.back();
          break;
        case 51: // 清屏
          this.drawboard.clear();
          this.draw_init_state();
          break;
        case 52:
          this.drawboard.exportCanvas();
        /* case 9: // 勾
          this.drawboard.set_custom_draw_func_enable([this.btn_names[button_index]]);
          this.current_button_index = button_index;
          break;
        case 10: // 叉
          this.drawboard.set_custom_draw_func_enable([this.btn_names[button_index]]);
          this.current_button_index = button_index;
          break;
        case 10: // A+
          this.drawboard.set_custom_draw_func_enable([this.btn_names[button_index]]);
          this.current_button_index = button_index;
          break;
        case 11: // A-
          this.drawboard.set_custom_draw_func_enable([this.btn_names[button_index]]);
          this.current_button_index = button_index;
          break;
        case 12: // 旋转
        const status = window.localStorage.getItem(ROTATE_DIALOG_KEY);
          if (status === ROTATE_DIALOG_VAL) {
            this.rotate();
          } else {
            this.rotate_dialog = true;
          }
          break;*/
      }
    },
  },
}
</script>

<style scoped>

</style>
