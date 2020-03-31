import { get, post } from "@/utils/request";

const baseUrl = "/api/MCatMenu/";

export default {
  // 根据用户获取菜单树列表
  PcMenuGetMenuTreeByUser(params) {
    return post(baseUrl + "MenuGetMenuTreeByUser", params)
  }
}