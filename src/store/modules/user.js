import {login, logout, userInfo} from '@/api/user'
import {getToken, removeToken, setToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import {constantRoutes} from '../../router/index'

const state = {
  token: getToken(),
  user: '',
  name: '',
  buttonList: [],
  routerList: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_BUTTONLIST: (state, buttonList) => {
    state.buttonList = buttonList
  },
  SET_ROUTERLIST: (state, routerList) => {
    state.routerList = routerList
  }
}

const actions = {

  login({ commit }, userInfo) {
    const { username, password } = userInfo
    login({ username: username, password: password })
      .then(response => {
        commit('SET_TOKEN', response.headers.token)
        console.log(response.headers.token,"?")
        setToken(response.headers.token)
        return(response)
      })
  },

  getInfo({commit}) {
    return new Promise((resolve, reject) => {
      userInfo().then(response => {
        const {data} = response
        const {name} = data
        commit('SET_USER', name)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getRouter({commit, state}) {
    return new Promise((resolve, reject) => {
      getRouter().then(res => {
        let data = res.data
        commit('setButtonList', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  setRouterList({commit}, routerList) {
    commit('SET_ROUTERLIST', constantRoutes.concat(routerList))
  },
  setButtonList({commit}, buttonList) {
    commit('SET_BUTTONLIST', buttonList)
  },
  setName({commit}, name) {
    commit('SET_NAME', name)
  },
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
