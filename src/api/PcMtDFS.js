//  上传文件

import { get, post } from "@/utils/request";

import {API_URL} from '@/utils/constant';

const baseUrl = API_URL+"MtDFS/";

export default {
    UploadBase64Img(file){
        //  file 是一个文件对象
        // 先转成base64
        let type = file.type.split('/')[1];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e)=>{
            console.log(e);
            return post(baseUrl+'UploadBase64Img',{
                FileName: `${new Date().getTime()}.${type}`,
                FileContent :e.target.result
            },true,{
                isReturnAll: true
            })
        }
    },

    UploadStreamImg(file){
        let formData = new FormData(); 
        formData.append('name',file);
        return post(baseUrl+'UploadStreamImg',formData,true,{
            isReturnAll: true,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              }
        });
    }
}