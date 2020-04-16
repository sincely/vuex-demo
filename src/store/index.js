import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list: [],
    // 文本框内容
    inputValue: "aaa",
    // 下一个id，手动造一个
    nextId: 5,
    vueKey: 'all'
  },
  mutations: {
    // action获取值之后，通过mutation赋值
    // 获取到的list赋值给 state.list
    initlist(state, list) {
      state.list = list;
    },
    // 为state中的value赋值
    setInputValue(state, value) {
      state.inputValue = value;
    },
    // 添加列表项目
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      };
      state.list.push(obj);
      // id自增1
      state.nextId += 1;
      // 输入框清空
      state.inputValue = "";
    },
    // 根据id删除任务事项
    deleteItem(state, id) {
      // 根据id查找对应项的索引
      const i = state.list.findIndex(x => x.id === id);
      // 根据索引，删除对应的元素
      if (i !== -1) {
        state.list.splice(i, 1);
      }
    },
    // 修改列表项选中状态的操作
    changeStatus(state, param) {
      const i = state.list.findIndex(x => x.id === param.id);

      if (i !== -1) {
        state.list[i].done = param.status;
      }
    },
    // 清楚已完成的任务
    cleandone(state) {
      state.list = state.list.filter(x => x.done === false);
    },
    // 修改视图的关键字
    changeView(state, key) {
      state.vueKey = key;
    }
  },

  actions: {
    // Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用
    // context:{
    // state,   等同于store.$state，若在模块中则为局部状态
    // rootState,   等同于store.$state,只存在模块中
    // commit,   等同于store.$commit
    // dispatch,   等同于store.$dispatch
    // getters   等同于store.$getters
    // }
    getList(context) {
      axios
        .get("/list.json")
        .then(res => {
          console.log(res);
          context.commit("initlist", res.data);
        })
        .catch(err => {
          console.error(err);
        });
    }
  },
  getters: {
    // 统计未完成的任务条数
    undoneLengh(state) {
      // 返回数组，包含了符合条件的所有元素。如果没有符合条件的元素则返回空数组
      return state.list.filter(x => x.done === false).length;
    },
    infoList(state) {
      if (state.vueKey === "all") { return state.list; }
      if (state.vueKey === "undone") {
        return state.list.filter(x => !x.done);
      }
      if (state.vueKey === "done") {
        return state.list.filter(x => x.done);
      }
      return state.list;
      
    }
    
  },

  modules: {}
});
