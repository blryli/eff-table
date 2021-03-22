
import axios from './request'
/** 数据源私有属性
 */
const privates = new WeakMap();

/** 数据源类,用于集中处理应用数据交互问题,并受监管
 */
class DataSource {
    /* 用于保存当前存在的数据源实例
     */
    static instances = []

    get params() {
        return this.options.params;
    }
    set params(value) {
        this.options.params = value;
    }

    get options() {
        return privates.get(this);
    }

    set options(originalApi = {}) {
        let api = this.optionsConvert(originalApi);
        let options = {
            id: api.apiUcode || api.id,
            apiUcode: api.apiUcode,
            name: api.name,
            path: api.path,
            method: api.method,
            requests: api.requests,
            responses: api.responses,
            mode: "auto", // 模式  auto  delay  trigger 
            beforeRquest: api.beforeRquest, //请求之前
            afterReuqest: api.afterReuqest, //请求之后
            updatedTime: Date.now()
            //后续待添加功能[缓存 单例多例 权限控制]
        };
        privates.set(this, options);
    }


    /**可通过服务市场api配置对象构建数据源对象
     * @method 构造函数
     * @param {Object} serverApi 
     */
    constructor(api) {
        this.options = api;
        
    }

    optionsConvert(api) {
        if (this.apiUcode) {
            let requests = api.requestParamResponseVoList.map(param => {
                return {
                    fieldName: param.paramName, //字段名
                    fieldRemark: param.remark, //字段说明
                    sType: param.paramType, //后端标注类型
                    required: param.required //是否必填
                }
            });
            let responses = api.requestDetailsResponseVoList.map(param => {
                return {
                    fieldName: param.fieldName, //字段名
                    fieldRemark: param.fieldRemark, //字段说明
                    sType: param.fieldType, //后端标注类型
                }
            });
            return {
                apiUcode: api.apiUcode,
                name: api.interfaceName,
                path: api.path,
                method: api.requestType == 1 ? 'GET' : 'POST',
                requests,
                responses
            }
        } else {
            return api;
        }
    }

    reloadOptions() {
        if (this.options.apiUcode) {

        }
    }


    request() {

    }


}


export default DataSource
