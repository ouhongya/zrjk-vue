const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.name,
  user: state => state.user.user,
  routerList: state => state.user.routerList,
  buttonList: state => state.user.buttonList,
}
export default getters
