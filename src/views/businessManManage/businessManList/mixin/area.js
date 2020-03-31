
var AREA = {
    EasternChina: "华东",
    NorthChina: "华北",
    CentralChina: "华中", 
    SouthChina: "华南", 
    Shandong:"山东",
    NorthEast: "东北",
    NorthWest: "西北",
    SouthWest: '西南',
};

export default {

    data(){
        return{
            reviewStr:"", //编辑完后回显用的区域名字符串
            reviewArr:[], //编辑完后回显用的区域名数组

            sendIDList:[],

            // 城市区域
            EasternChina: [], // 华东
            NorthChina: [], // 华北
            CentralChina: [], // 华中
            SouthChina: [], // 华南
            Shandong:[], // 山东
            NorthEast: [], // 东北
            NorthWest: [], // 西北
            SouthWest: [], // 西南

            // 默认选中的列表
            CheckedEasternChina: [], // 华东
            CheckedNorthChina: [], // 华北
            CheckedCentralChina: [], // 华中
            CheckedSouthChina: [], // 华南
            CheckedShandong:[], // 山东
            CheckedNorthEast: [], // 东北
            CheckedNorthWest: [], // 西北
            CheckedSouthWest: [], // 西南
        }
    },

	methods:{
        // 添加区域权限
        addArea(){
            this.sendIDList = [];
            this.ifShowAreaDialog = true;
            let sendObj = {};
            // 编辑状态
            if(this.currentUser.UDID)
            {
                sendObj.udid = this.currentUser.UDID
            }
            // 新建状态
            else
            {
                sendObj.udid = this.newUID;
            }
            // 获取所有省市列表
            this.$http.HLUser
            .GetListAreaAndBusinessAsyncCtl(sendObj)
            .then((res)=>{
                this.allAreaList = JSON.parse(JSON.stringify(res.getListAreaOutDto));
                for(let i = 0;i<this.allAreaList.length;i++)
                {
                    let currentArea = this.allAreaList[i];
                    for(let x = 0;x<currentArea.getListProvinceOutDto.length;x++)
                    {
                        let currentProvince = currentArea.getListProvinceOutDto[x];
                        currentProvince.nodeName = currentProvince.ProvinceName;
                        for(let y = 0;y<currentProvince.getListCityOutDto.length;y++)
                        {
                            let currentCity = currentProvince.getListCityOutDto[y];
                            currentCity.nodeName = currentCity.CityName;
                        }
                    }
                }

                // 初始化选中的树节点
                for(let i = 0;i<this.allAreaList.length;i++)
                {
                    if(this.allAreaList[i].AreaName === AREA.NorthEast)
                    {
                        let currentArea = this.allAreaList[i];
                        // 选中了当前大区
                        if(currentArea.IsEchoDisplay === true)
                        {
                            this.areaForm.regions.push(AREA.NorthEast);
                            this.setNorthEast(this.areaForm.regions);
                        }
                        for(let y = 0;y<currentArea.getListProvinceOutDto.length;y++)
                        {
                            let currentProvince = currentArea.getListProvinceOutDto[y];
                            // 选中了某个省
                            if(currentProvince.IsEchoDisplay === true)
                            {
                                this.CheckedNorthEast.push(currentProvince.ProvinceName);
                                break;
                            }
                            else
                            {
                                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                                {
                                    let currentCity = currentProvince.getListCityOutDto[x];
                                    // 选中了某个市
                                    if(currentCity.IsEchoDisplay === true)
                                    {
                                        this.CheckedNorthEast.push(currentCity.CityName)
                                    }
                                }
                            }
                        }   
                        this.NorthEast = this.allAreaList[i].getListProvinceOutDto;
                    }
                    else if(this.allAreaList[i].AreaName === AREA.NorthChina)
                    {
                        let currentArea = this.allAreaList[i];
                        // 选中了当前大区
                        if(currentArea.IsEchoDisplay === true)
                        {
                            this.areaForm.regions.push(AREA.NorthChina);
                            this.setNorthChina(this.areaForm.regions);
                        }
                        for(let y = 0;y<currentArea.getListProvinceOutDto.length;y++)
                        {
                            let currentProvince = currentArea.getListProvinceOutDto[y];
                            // 选中了某个省
                            if(currentProvince.IsEchoDisplay === true)
                            {
                                this.CheckedNorthChina.push(currentProvince.ProvinceName);
                                break;
                            }
                            else
                            {
                                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                                {
                                    let currentCity = currentProvince.getListCityOutDto[x];
                                    // 选中了某个市
                                    if(currentCity.IsEchoDisplay === true)
                                    {
                                        this.CheckedNorthChina.push(currentCity.CityName)
                                    }
                                }
                            }
                        } 
                        this.NorthChina = this.allAreaList[i].getListProvinceOutDto;
                    }
                    else if(this.allAreaList[i].AreaName === AREA.CentralChina)
                    {
                        let currentArea = this.allAreaList[i];
                        // 选中了当前大区
                        if(currentArea.IsEchoDisplay === true)
                        {
                            this.areaForm.regions.push(AREA.CentralChina);
                            this.setCentralChina(this.areaForm.regions);
                        }
                        for(let y = 0;y<currentArea.getListProvinceOutDto.length;y++)
                        {
                            let currentProvince = currentArea.getListProvinceOutDto[y];
                            // 选中了某个省
                            if(currentProvince.IsEchoDisplay === true)
                            {
                                this.CheckedCentralChina.push(currentProvince.ProvinceName);
                                break;
                            }
                            else
                            {
                                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                                {
                                    let currentCity = currentProvince.getListCityOutDto[x];
                                    // 选中了某个市
                                    if(currentCity.IsEchoDisplay === true)
                                    {
                                        this.CheckedCentralChina.push(currentCity.CityName)
                                    }
                                }
                            }
                        } 
                        this.CentralChina = this.allAreaList[i].getListProvinceOutDto;
                    }
                    else if(this.allAreaList[i].AreaName === AREA.NorthWest)
                    {
                        let currentArea = this.allAreaList[i];
                        // 选中了当前大区
                        if(currentArea.IsEchoDisplay === true)
                        {
                            this.areaForm.regions.push(AREA.NorthWest);
                            this.setNorthWest(this.areaForm.regions);
                        }
                        for(let y = 0;y<currentArea.getListProvinceOutDto.length;y++)
                        {
                            let currentProvince = currentArea.getListProvinceOutDto[y];
                            // 选中了某个省
                            if(currentProvince.IsEchoDisplay === true)
                            {
                                this.CheckedNorthWest.push(currentProvince.ProvinceName);
                                break;
                            }
                            else
                            {
                                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                                {
                                    let currentCity = currentProvince.getListCityOutDto[x];
                                    // 选中了某个市
                                    if(currentCity.IsEchoDisplay === true)
                                    {
                                        this.CheckedNorthWest.push(currentCity.CityName)
                                    }
                                }
                            }
                        } 
                        this.NorthWest = this.allAreaList[i].getListProvinceOutDto;
                    }
                    else if(this.allAreaList[i].AreaName === AREA.EasternChina)
                    {
                        let currentArea = this.allAreaList[i];
                        // 选中了当前大区
                        if(currentArea.IsEchoDisplay === true)
                        {
                            this.areaForm.regions.push(AREA.EasternChina);
                            this.setEasternChina(this.areaForm.regions);
                        }
                        for(let y = 0;y<currentArea.getListProvinceOutDto.length;y++)
                        {
                            let currentProvince = currentArea.getListProvinceOutDto[y];
                            // 选中了某个省
                            if(currentProvince.IsEchoDisplay === true)
                            {
                                this.CheckedEasternChina.push(currentProvince.ProvinceName);
                                break;
                            }
                            else
                            {
                                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                                {
                                    let currentCity = currentProvince.getListCityOutDto[x];
                                    // 选中了某个市
                                    if(currentCity.IsEchoDisplay === true)
                                    {
                                        this.CheckedEasternChina.push(currentCity.CityName)
                                    }
                                }
                            }
                        } 
                        this.EasternChina = this.allAreaList[i].getListProvinceOutDto;
                    }
                    else if(this.allAreaList[i].AreaName === AREA.SouthChina)
                    {
                        let currentArea = this.allAreaList[i];
                        // 选中了当前大区
                        if(currentArea.IsEchoDisplay === true)
                        {
                            this.areaForm.regions.push(AREA.SouthChina);
                            this.setSouthChina(this.areaForm.regions);
                        }
                        for(let y = 0;y<currentArea.getListProvinceOutDto.length;y++)
                        {
                            let currentProvince = currentArea.getListProvinceOutDto[y];
                            // 选中了某个省
                            if(currentProvince.IsEchoDisplay === true)
                            {
                                this.CheckedSouthChina.push(currentProvince.ProvinceName);
                                break;
                            }
                            else
                            {
                                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                                {
                                    let currentCity = currentProvince.getListCityOutDto[x];
                                    // 选中了某个市
                                    if(currentCity.IsEchoDisplay === true)
                                    {
                                        this.CheckedSouthChina.push(currentCity.CityName)
                                    }
                                }
                            }
                        } 
                        this.SouthChina = this.allAreaList[i].getListProvinceOutDto;
                    }
                    else if(this.allAreaList[i].AreaName === AREA.Shandong)
                    {
                        let currentArea = this.allAreaList[i];
                        // 选中了当前大区
                        if(currentArea.IsEchoDisplay === true)
                        {
                            this.areaForm.regions.push(AREA.Shandong);
                            this.setShandong(this.areaForm.regions);
                        }
                        for(let y = 0;y<currentArea.getListProvinceOutDto.length;y++)
                        {
                            let currentProvince = currentArea.getListProvinceOutDto[y];
                            // 选中了某个省
                            if(currentProvince.IsEchoDisplay === true)
                            {
                                this.CheckedShandong.push(currentProvince.ProvinceName);
                                break;
                            }
                            else
                            {
                                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                                {
                                    let currentCity = currentProvince.getListCityOutDto[x];
                                    // 选中了某个市
                                    if(currentCity.IsEchoDisplay === true)
                                    {
                                        this.CheckedShandong.push(currentCity.CityName)
                                    }
                                }
                            }
                        } 
                        this.Shandong = this.allAreaList[i].getListProvinceOutDto;
                    }
                    else if(this.allAreaList[i].AreaName === AREA.SouthWest)
                    {
                        let currentArea = this.allAreaList[i];
                        // 选中了当前大区
                        if(currentArea.IsEchoDisplay === true)
                        {
                            this.areaForm.regions.push(AREA.SouthWest);
                            this.setSouthWest(this.areaForm.regions);
                        }
                        for(let y = 0;y<currentArea.getListProvinceOutDto.length;y++)
                        {
                            let currentProvince = currentArea.getListProvinceOutDto[y];
                            // 选中了某个省
                            if(currentProvince.IsEchoDisplay === true)
                            {
                                this.CheckedSouthWest.push(currentProvince.ProvinceName);
                                break;
                            }
                            else
                            {
                                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                                {
                                    let currentCity = currentProvince.getListCityOutDto[x];
                                    // 选中了某个市
                                    if(currentCity.IsEchoDisplay === true)
                                    {
                                        this.CheckedSouthWest.push(currentCity.CityName)
                                    }
                                }
                            }
                        } 
                        this.SouthWest = this.allAreaList[i].getListProvinceOutDto;
                    }
                }
            })
            .catch((err)=>{
                console.log(err);
            });
        },


        getEasternChina(AreaId) {
            let arr = this.$refs.treeEasternChina.getCheckedNodes();
            let result = [];
            for(let i = 0;i<this.EasternChina.length;i++)
            {
                let currentProvince = this.EasternChina[i];
                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                {
                    let currentCity = currentProvince.getListCityOutDto[x];
                    for(let z = 0;z<arr.length;z++)
                    {

                        if(arr[z].nodeName === currentCity.CityName)
                        {                                
                            let tempObj = {
                                AreaId:AreaId,
                                ProvinceId:currentProvince.ProvinceId,
                                CityId:arr[z].CityId
                            };
                            result.push(tempObj);
                        }
                    }
                }
            }

            // 拼接回显字段
            let ifChosenArea = false
            for(let i = 0;i<this.areaForm.regions.length;i++)
            {
                if(this.areaForm.regions[i] === AREA.EasternChina)
                {
                    this.reviewArr.push(AREA.EasternChina);
                    ifChosenArea = true;
                }
            }
            if(!ifChosenArea)
            {
                for(let x = arr.length-1;x>=0;x--)
                {
                    this.reviewArr.push(arr[x].nodeName);
                    if(arr[x].getListCityOutDto)
                    {
                        let currentProvince = arr[x];
                        for(let y = 0;y<currentProvince.getListCityOutDto.length;y++)
                        {
                            let index = this.reviewArr.indexOf(currentProvince.getListCityOutDto[y].nodeName);
                            this.reviewArr.splice(index,1);
                        }
                    }
                }
            }
            return result;
        },
        setEasternChina(value) {
            if (value.length) 
            {
                let checkNodeList = [];
                for(let i = 0;i<this.allAreaList.length;i++)
                {
                    if(this.allAreaList[i].AreaName === AREA.EasternChina)
                    {
                        let currentArea = this.allAreaList[i];
                        for(let x = 0;x<currentArea.getListProvinceOutDto.length;x++)
                        {
                            checkNodeList.push(currentArea.getListProvinceOutDto[x].nodeName);
                        }
                    }
                }
                this.$nextTick(()=>{
                    this.$refs.treeEasternChina.setCheckedKeys(checkNodeList);
                });
            } 
            else 
            {
                this.$refs.treeEasternChina.setCheckedKeys([]);
            }
        },

        getNorthChina(AreaId) {
            let arr = this.$refs.treeNorthChina.getCheckedNodes();
            let result = [];
            for(let i = 0;i<this.NorthChina.length;i++)
            {
                let currentProvince = this.NorthChina[i];
                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                {
                    let currentCity = currentProvince.getListCityOutDto[x];
                    for(let z = 0;z<arr.length;z++)
                    {
                        if(arr[z].nodeName === currentCity.CityName)
                        {                                
                            let tempObj = {
                                AreaId:AreaId,
                                ProvinceId:currentProvince.ProvinceId,
                                CityId:arr[z].CityId
                            };
                            result.push(tempObj);
                        }
                    }
                }
            }

            // 拼接回显字段
            let ifChosenArea = false
            for(let i = 0;i<this.areaForm.regions.length;i++)
            {
                if(this.areaForm.regions[i] === AREA.NorthChina)
                {
                    this.reviewArr.push(AREA.NorthChina);
                    ifChosenArea = true;
                }
            }
            if(!ifChosenArea)
            {
                for(let x = arr.length-1;x>=0;x--)
                {
                    this.reviewArr.push(arr[x].nodeName);
                    if(arr[x].getListCityOutDto)
                    {
                        let currentProvince = arr[x];
                        for(let y = 0;y<currentProvince.getListCityOutDto.length;y++)
                        {
                            let index = this.reviewArr.indexOf(currentProvince.getListCityOutDto[y].nodeName);
                            this.reviewArr.splice(index,1);
                        }
                    }
                }
            }
            return result;
        },
        setNorthChina(value) {
            if (value.length) 
            {
                let checkNodeList = [];
                for(let i = 0;i<this.allAreaList.length;i++)
                {
                    if(this.allAreaList[i].AreaName === AREA.NorthChina)
                    {
                        let currentArea = this.allAreaList[i];
                        for(let x = 0;x<currentArea.getListProvinceOutDto.length;x++)
                        {
                            checkNodeList.push(currentArea.getListProvinceOutDto[x].nodeName);
                        }
                    }
                }
                this.$nextTick(()=>{
                    this.$refs.treeNorthChina.setCheckedKeys(checkNodeList);
                });
            } 
            else 
            {
                this.$refs.treeNorthChina.setCheckedKeys([]);
            }
        },

        getCentralChina(AreaId) {
            let arr = this.$refs.treeCentralChina.getCheckedNodes();
            let result = [];
            for(let i = 0;i<this.CentralChina.length;i++)
            {
                let currentProvince = this.CentralChina[i];
                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                {
                    let currentCity = currentProvince.getListCityOutDto[x];
                    for(let z = 0;z<arr.length;z++)
                    {
                        if(arr[z].nodeName === currentCity.CityName)
                        {                                
                            let tempObj = {
                                AreaId:AreaId,
                                ProvinceId:currentProvince.ProvinceId,
                                CityId:arr[z].CityId
                            };
                            result.push(tempObj);
                        }
                    }
                }
            }

            // 拼接回显字段
            let ifChosenArea = false
            for(let i = 0;i<this.areaForm.regions.length;i++)
            {
                if(this.areaForm.regions[i] === AREA.CentralChina)
                {
                    this.reviewArr.push(AREA.CentralChina);
                    ifChosenArea = true;
                }
            }
            if(!ifChosenArea)
            {
                for(let x = arr.length-1;x>=0;x--)
                {
                    this.reviewArr.push(arr[x].nodeName);
                    if(arr[x].getListCityOutDto)
                    {
                        let currentProvince = arr[x];
                        for(let y = 0;y<currentProvince.getListCityOutDto.length;y++)
                        {
                            let index = this.reviewArr.indexOf(currentProvince.getListCityOutDto[y].nodeName);
                            this.reviewArr.splice(index,1);
                        }
                    }
                }
            }
            return result;
        },
        setCentralChina(value) {
            if (value.length) 
            {
                let checkNodeList = [];
                for(let i = 0;i<this.allAreaList.length;i++)
                {
                    if(this.allAreaList[i].AreaName === AREA.CentralChina)
                    {
                        let currentArea = this.allAreaList[i];
                        for(let x = 0;x<currentArea.getListProvinceOutDto.length;x++)
                        {
                            checkNodeList.push(currentArea.getListProvinceOutDto[x].nodeName);
                        }
                    }
                }
                this.$nextTick(()=>{
                    this.$refs.treeCentralChina.setCheckedKeys(checkNodeList);
                });
            } 
            else 
            {
                this.$refs.treeCentralChina.setCheckedKeys([]);
            }
        },

        getSouthChina(AreaId) {
            let arr = this.$refs.treeSouthChina.getCheckedNodes();
            let result = [];
            for(let i = 0;i<this.SouthChina.length;i++)
            {
                let currentProvince = this.SouthChina[i];
                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                {
                    let currentCity = currentProvince.getListCityOutDto[x];
                    for(let z = 0;z<arr.length;z++)
                    {
                        if(arr[z].nodeName === currentCity.CityName)
                        {                                
                            let tempObj = {
                                AreaId:AreaId,
                                ProvinceId:currentProvince.ProvinceId,
                                CityId:arr[z].CityId
                            };
                            result.push(tempObj);
                        }
                    }
                }
            }

            // 拼接回显字段
            let ifChosenArea = false
            for(let i = 0;i<this.areaForm.regions.length;i++)
            {
                if(this.areaForm.regions[i] === AREA.SouthChina)
                {
                    this.reviewArr.push(AREA.SouthChina);
                    ifChosenArea = true;
                }
            }
            if(!ifChosenArea)
            {
                for(let x = arr.length-1;x>=0;x--)
                {
                    this.reviewArr.push(arr[x].nodeName);
                    if(arr[x].getListCityOutDto)
                    {
                        let currentProvince = arr[x];
                        for(let y = 0;y<currentProvince.getListCityOutDto.length;y++)
                        {
                            let index = this.reviewArr.indexOf(currentProvince.getListCityOutDto[y].nodeName);
                            this.reviewArr.splice(index,1);
                        }
                    }
                }
            }
            return result;
        },
        setSouthChina(value) {
            if (value.length) 
            {
                let checkNodeList = [];
                for(let i = 0;i<this.allAreaList.length;i++)
                {
                    if(this.allAreaList[i].AreaName === AREA.SouthChina)
                    {
                        let currentArea = this.allAreaList[i];
                        for(let x = 0;x<currentArea.getListProvinceOutDto.length;x++)
                        {
                            checkNodeList.push(currentArea.getListProvinceOutDto[x].nodeName);
                        }
                    }
                }
                this.$nextTick(()=>{
                    this.$refs.treeSouthChina.setCheckedKeys(checkNodeList);
                });
            } 
            else 
            {
                this.$refs.treeSouthChina.setCheckedKeys([]);
            }
        },

        getNorthEast(AreaId) {
            let arr = this.$refs.treeNorthEast.getCheckedNodes();
            let result = [];
            for(let i = 0;i<this.NorthEast.length;i++)
            {
                let currentProvince = this.NorthEast[i];
                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                {
                    let currentCity = currentProvince.getListCityOutDto[x];
                    for(let z = 0;z<arr.length;z++)
                    {
                        if(arr[z].nodeName === currentCity.CityName)
                        {                                
                            let tempObj = {
                                AreaId:AreaId,
                                ProvinceId:currentProvince.ProvinceId,
                                CityId:arr[z].CityId
                            };
                            result.push(tempObj);
                            break;
                        }
                    }
                }
            }

            // 拼接回显字段
            let ifChosenArea = false
            for(let i = 0;i<this.areaForm.regions.length;i++)
            {
                if(this.areaForm.regions[i] === AREA.NorthEast)
                {
                    this.reviewArr.push(AREA.NorthEast);
                    ifChosenArea = true;
                }
            }
            if(!ifChosenArea)
            {
                for(let x = arr.length-1;x>=0;x--)
                {
                    this.reviewArr.push(arr[x].nodeName);
                    if(arr[x].getListCityOutDto)
                    {
                        let currentProvince = arr[x];
                        for(let y = 0;y<currentProvince.getListCityOutDto.length;y++)
                        {
                            let index = this.reviewArr.indexOf(currentProvince.getListCityOutDto[y].nodeName);
                            this.reviewArr.splice(index,1);
                        }
                    }
                }
            }
            return result;
        },
        setNorthEast(value) {
            if (value.length) 
            {
                let checkNodeList = [];
                for(let i = 0;i<this.allAreaList.length;i++)
                {
                    if(this.allAreaList[i].AreaName === AREA.NorthEast)
                    {
                        let currentArea = this.allAreaList[i];
                        for(let x = 0;x<currentArea.getListProvinceOutDto.length;x++)
                        {
                            checkNodeList.push(currentArea.getListProvinceOutDto[x].nodeName);
                        }
                    }
                }
                this.$nextTick(()=>{
                    this.$refs.treeNorthEast.setCheckedKeys(checkNodeList);
                });
            } 
            else 
            {
                this.$refs.treeNorthEast.setCheckedKeys([]);
            }
        },

        getNorthWest(AreaId) {
            let arr = this.$refs.treeNorthWest.getCheckedNodes();
            let result = [];
            for(let i = 0;i<this.NorthWest.length;i++)
            {
                let currentProvince = this.NorthWest[i];
                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                {
                    let currentCity = currentProvince.getListCityOutDto[x];
                    for(let z = 0;z<arr.length;z++)
                    {
                        if(arr[z].nodeName === currentCity.CityName)
                        {                                
                            let tempObj = {
                                AreaId:AreaId,
                                ProvinceId:currentProvince.ProvinceId,
                                CityId:arr[z].CityId
                            };
                            result.push(tempObj);
                        }
                    }
                }
            }

            // 拼接回显字段
            let ifChosenArea = false
            for(let i = 0;i<this.areaForm.regions.length;i++)
            {
                if(this.areaForm.regions[i] === AREA.NorthWest)
                {
                    this.reviewArr.push(AREA.NorthWest);
                    ifChosenArea = true;
                }
            }
            if(!ifChosenArea)
            {
                for(let x = arr.length-1;x>=0;x--)
                {
                    this.reviewArr.push(arr[x].nodeName);
                    if(arr[x].getListCityOutDto)
                    {
                        let currentProvince = arr[x];
                        for(let y = 0;y<currentProvince.getListCityOutDto.length;y++)
                        {
                            let index = this.reviewArr.indexOf(currentProvince.getListCityOutDto[y].nodeName);
                            this.reviewArr.splice(index,1);
                        }
                    }
                }
            }
            return result;
        },
        setNorthWest(value) {
            if (value.length) 
            {
                let checkNodeList = [];
                for(let i = 0;i<this.allAreaList.length;i++)
                {
                    if(this.allAreaList[i].AreaName === AREA.NorthWest)
                    {
                        let currentArea = this.allAreaList[i];
                        for(let x = 0;x<currentArea.getListProvinceOutDto.length;x++)
                        {
                            checkNodeList.push(currentArea.getListProvinceOutDto[x].nodeName);
                        }
                    }
                }
                this.$nextTick(()=>{
                    this.$refs.treeNorthWest.setCheckedKeys(checkNodeList);
                });
            } 
            else 
            {
                this.$refs.treeNorthWest.setCheckedKeys([]);
            }
        },

        getShandong(AreaId) {
            let arr = this.$refs.treeShandong.getCheckedNodes();
            let result = [];
            for(let i = 0;i<this.Shandong.length;i++)
            {
                let currentProvince = this.Shandong[i];
                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                {
                    let currentCity = currentProvince.getListCityOutDto[x];
                    for(let z = 0;z<arr.length;z++)
                    {
                        if(arr[z].nodeName === currentCity.CityName)
                        {                                
                            let tempObj = {
                                AreaId:AreaId,
                                ProvinceId:currentProvince.ProvinceId,
                                CityId:arr[z].CityId
                            };
                            result.push(tempObj);
                        }
                    }
                }
            }

            // 拼接回显字段
            let ifChosenArea = false
            for(let i = 0;i<this.areaForm.regions.length;i++)
            {
                if(this.areaForm.regions[i] === AREA.Shandong)
                {
                    this.reviewArr.push(AREA.Shandong);
                    ifChosenArea = true;
                }
            }
            if(!ifChosenArea)
            {
                for(let x = arr.length-1;x>=0;x--)
                {
                    this.reviewArr.push(arr[x].nodeName);
                    if(arr[x].getListCityOutDto)
                    {
                        let currentProvince = arr[x];
                        for(let y = 0;y<currentProvince.getListCityOutDto.length;y++)
                        {
                            let index = this.reviewArr.indexOf(currentProvince.getListCityOutDto[y].nodeName);
                            this.reviewArr.splice(index,1);
                        }
                    }
                }
            }
            return result;
        },
        setShandong(value) {
            if (value.length) 
            {
                let checkNodeList = [];
                for(let i = 0;i<this.allAreaList.length;i++)
                {
                    if(this.allAreaList[i].AreaName === AREA.Shandong)
                    {
                        let currentArea = this.allAreaList[i];
                        for(let x = 0;x<currentArea.getListProvinceOutDto.length;x++)
                        {
                            checkNodeList.push(currentArea.getListProvinceOutDto[x].nodeName);
                        }
                    }
                }
                this.$nextTick(()=>{
                    this.$refs.treeShandong.setCheckedKeys(checkNodeList);
                });
            } 
            else 
            {
                this.$refs.treeShandong.setCheckedKeys([]);
            }
        },


        getSouthWest(AreaId) {
            let arr = this.$refs.treeSouthWest.getCheckedNodes();
            let result = [];
            for(let i = 0;i<this.SouthWest.length;i++)
            {
                let currentProvince = this.SouthWest[i];
                for(let x = 0;x<currentProvince.getListCityOutDto.length;x++)
                {
                    let currentCity = currentProvince.getListCityOutDto[x];
                    for(let z = 0;z<arr.length;z++)
                    {
                        if(arr[z].nodeName === currentCity.CityName)
                        {                                
                            let tempObj = {
                                AreaId:AreaId,
                                ProvinceId:currentProvince.ProvinceId,
                                CityId:arr[z].CityId
                            };
                            result.push(tempObj);
                        }
                    }
                }
            }
            // 拼接回显字段
            let ifChosenArea = false
            for(let i = 0;i<this.areaForm.regions.length;i++)
            {
                if(this.areaForm.regions[i] === AREA.SouthWest)
                {
                    this.reviewArr.push(AREA.SouthWest);
                    ifChosenArea = true;
                }
            }
            if(!ifChosenArea)
            {
                for(let x = arr.length-1;x>=0;x--)
                {
                    this.reviewArr.push(arr[x].nodeName);
                    if(arr[x].getListCityOutDto)
                    {
                        let currentProvince = arr[x];
                        for(let y = 0;y<currentProvince.getListCityOutDto.length;y++)
                        {
                            let index = this.reviewArr.indexOf(currentProvince.getListCityOutDto[y].nodeName);
                            this.reviewArr.splice(index,1);
                        }
                    }
                }
            }
            return result;
        },
        setSouthWest(value) {
            if (value.length) 
            {
                let checkNodeList = [];
                for(let i = 0;i<this.allAreaList.length;i++)
                {
                    if(this.allAreaList[i].AreaName === AREA.SouthWest)
                    {
                        let currentArea = this.allAreaList[i];
                        for(let x = 0;x<currentArea.getListProvinceOutDto.length;x++)
                        {
                            checkNodeList.push(currentArea.getListProvinceOutDto[x].nodeName);
                        }
                    }
                }
                this.$nextTick(()=>{
                    this.$refs.treeSouthWest.setCheckedKeys(checkNodeList);
                });
            } 
            else 
            {
                this.$refs.treeSouthWest.setCheckedKeys([]);
            }
        },

        // 拼接城市数组
        nameFilter() { 
            var NorthEast = [],
                NorthChina = [],
                CentralChina = [],
                NorthWest = [],
                EasternChina = [],
                SouthChina = [],
                Shandong = [],
                SouthWest = [];
            for(let i = 0;i<this.allAreaList.length;i++)
            {
                if(this.allAreaList[i].AreaName === AREA.NorthEast)
                {
                    NorthEast = this.getNorthEast(this.allAreaList[i].AreaId)
                }
                else if(this.allAreaList[i].AreaName === AREA.NorthChina)
                {
                    NorthChina = this.getNorthChina(this.allAreaList[i].AreaId);
                }
                else if(this.allAreaList[i].AreaName === AREA.CentralChina)
                {
                    CentralChina = this.getCentralChina(this.allAreaList[i].AreaId);
                }
                else if(this.allAreaList[i].AreaName === AREA.NorthWest)
                {
                    NorthWest = this.getNorthWest(this.allAreaList[i].AreaId);
                }
                else if(this.allAreaList[i].AreaName === AREA.EasternChina)
                {
                    EasternChina = this.getEasternChina(this.allAreaList[i].AreaId);
                }
                else if(this.allAreaList[i].AreaName === AREA.SouthChina)
                {
                    SouthChina = this.getSouthChina(this.allAreaList[i].AreaId);
                }
                else if(this.allAreaList[i].AreaName === AREA.Shandong)
                {
                    Shandong = this.getShandong(this.allAreaList[i].AreaId);
                }
                else if(this.allAreaList[i].AreaName === AREA.SouthWest)
                {
                    SouthWest = this.getSouthWest(this.allAreaList[i].AreaId);
                }
            }
            this.sendIDList = this.sendIDList.concat(NorthEast,NorthChina,CentralChina,NorthWest,EasternChina,SouthChina,Shandong,SouthWest);
            console.log(this.sendIDList);
        },


        // 保存区域选择时间
        saveArea() { 

            // 拼接回显的城市名
            setTimeout(()=>{
                this.reviewStr = this.reviewArr.join(",");
                this.userAreaList = this.reviewStr;
                this.reviewArr = [];
                console.log(this.reviewStr);
            },0);

            // 获取选中的城市ID对象
            this.nameFilter();

            // 清空区域选择框
            this.areaForm = {
                regions:[],
                index:"",
            };

            // 清空地址选择
            this.$refs.treeEasternChina.setCheckedKeys([]);
            this.$refs.treeNorthChina.setCheckedKeys([]);
            this.$refs.treeCentralChina.setCheckedKeys([]);
            this.$refs.treeSouthChina.setCheckedKeys([]);
            this.$refs.treeNorthEast.setCheckedKeys([]);
            this.$refs.treeNorthWest.setCheckedKeys([]);
            this.$refs.treeShandong.setCheckedKeys([]);
            this.$refs.treeSouthWest.setCheckedKeys([]);

            // 校验是否有选择地区
            if(!this.sendIDList.length)
            {
                this.$message({
                    message:"请选择地区",
                    type:"warning"
                });
                return;
            }
            // 获取当前管辖系统的列表，无则传null
            let BrandSystemId = [];
            for(let i = 0;i<this.userSystemList.length;i++)
            {
                BrandSystemId.push(this.userSystemList[i].BrandSystemId);
            }
            if(!BrandSystemId.length)
            {
                BrandSystemId = null;
            }
            // 编辑业务员
            if(this.state === "edit")
            {
                let sendObj = {
                    UDID:this.currentUser.UDID,
                    BrandSystemId,
                    AreaId:this.sendIDList,
                };
                this.$http.HLUser
                .SetBusinessUserPowerAsyncCtl(sendObj)
                .then((res)=>{
                    console.log(res);
                })
                .catch((err)=>{
                    console.log(err);
                });
            }
            // 新增业务员
            else if(this.state === "create")
            {
                let sendObj = {
                    UsersIndex:1,
                    HLUsersCreate:{
                        TrueName:this.baseInfo.TrueName,
                        Phone:this.baseInfo.Phone
                    },
                    HLUsersCreate1:{
                        UDID:this.newUID,
                        BrandSystemId,
                        AreaId:this.sendIDList,
                    },
                    HLUsersCreate2:{
                        UDID:this.newUID,
                        AppId:"wxe1c7b856b23c746d",
                        AppSecret:"9601b68ae3a007cb44a87ff007798df4",
                        width:"280px",
                        page:"",
                    },
                };
                this.$http.HLUser
                .CreateBusinessUserAsyncCtl(sendObj)
                .then((res)=>{
                    console.log(res);
                })
                .catch((err)=>{
                    console.log(err);
                });
            }

            this.ifShowAreaDialog = false;
        },
	},
}