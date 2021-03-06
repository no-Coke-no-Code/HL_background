import { get, post } from "@/utils/request";

const baseUrl = "/api/MCatMenu/";

export default {
  // 根据用户获取菜单列表
  MenuGetMenuByUser(params){
    return post(baseUrl + "MenuGetMenuByUser", params)
  },

  // 根据用户获取菜单树列表
  MenuGetMenuTreeByUser(params) {
    return post(baseUrl + "MenuGetMenuTreeByUser", params)
  }
}