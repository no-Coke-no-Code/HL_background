import Cookies from 'js-cookie'

const state = {
  menuSlider: {
    opened: Cookies.get('menuSliderOpened') ? !!+Cookies.get('menuSliderOpened') : true,
  },
  menuIdList: Cookies.get('menuIdList') || ''
}

const mutations = {
  TOGGLE_MENU: state => {
    // 打开或者关闭菜单栏
    state.menuSlider.opened = !state.menuSlider.opened;
    if(state.menuSlider.opened){
      Cookies.set('menuSliderOpened', 1)//打开
    }else{
      Cookies.set('menuSliderOpened', 0) //关闭
    }
  },
  OPEN_MENU: state => {
    // 打开菜单栏
    state.menuSlider.opened = true;
    Cookies.set('menuSliderOpened', 1)//打开
  },
  SET_MENUIDLIST: (state, menuIdList) => { //暂时不用，用链接带参数而不是cookie
    state.menuIdList = menuIdList;
    Cookies.set('menuIdList', menuIdList) //关闭
  }
}

const actions = {
  toggleMenu({commit}){
    commit('TOGGLE_MENU');
  },
  openMenu({commit}){
    commit('OPEN_MENU');
  },
  setMenuIdList({commit},value){
    console.log('menuIdList',value);
    commit('SET_MENUIDLIST',value);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
