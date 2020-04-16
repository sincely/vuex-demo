<template>
  <div id="app">
    <a-input placeholder="请输入任务" class="my_ipt" :value="inputValue" @change="handleInputValue" />
    <a-button type="primary" @click="addItemList">添加事项</a-button>

    <a-list bordered :dataSource="infoList" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <a-checkbox
          :checked="item.done"
          @change="(e) =>{cbStatusChanged(e,item.id)}"
        >{{ item.info }}</a-checkbox>
        <!-- 删除链接 -->
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{undoneLengh}}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button :type="vueKey === 'all' ? 'primary':'defaults'" @click="changeList('all')">全部</a-button>
          <a-button :type="vueKey === 'undone' ? 'primary':'defaults'" @click="changeList('undone')">未完成</a-button>
          <a-button :type="vueKey === 'done' ? 'primary':'defaults'" @click="changeList('done')">已完成</a-button>
        </a-button-group>
        <!-- 把已经完成的任务清空 -->
        <a @click="clean">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
// 按需导入函数

import { mapState, mapGetters } from "vuex";

export default {
  name: "app",
  data() {
    return {};
  },
  created() {
    this.$store.dispatch("getList");
  },
  methods: {
    // 监听文本框内容变化
    handleInputValue(q) {
      // 拿到input最新的值
      console.log(q.target.value);
      // 如何为state重新赋值？
      this.$store.commit("setInputValue", q.target.value);
    },
    // 像列表中新增item项
    addItemList() {
      // 判断是否输入值
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning("文本框内容不能为空！");
      }
      this.$store.commit("addItem");
    },
    // 根据id删除
    removeItemById(id) {
      // console.log(id);
      this.$store.commit("deleteItem", id);
    },
    // 监听复选框的选中状态的变化
    cbStatusChanged(e, id) {
      // e.target.checkd可以接收到最新的选中状态
      // console.log(e.target.checkd);
      const param = {
        id: id,
        status: e.target.checked
      };
      this.$store.commit("changeStatus", param);
    },
    // 清除已完成
    clean() {
      this.$store.commit("cleandone");
    },
    changeList(hightlight) {
      console.log(hightlight);
      this.$store.commit("changeView", hightlight);
    }
  },
  computed: {
    ...mapState(["list", "inputValue","vueKey"]),
    ...mapGetters(["undoneLengh","infoList"])
  }
};
</script>

<style scoped>
#app {
  padding: 10px;
}

.my_ipt {
  width: 500px;
  margin-right: 10px;
}

.dt_list {
  width: 500px;
  margin-top: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
