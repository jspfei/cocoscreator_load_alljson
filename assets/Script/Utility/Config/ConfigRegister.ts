import { enhancedLoadResourceArray } from "../Core/AssetLoader";

/**
 * Copy-right is reserved by [fanyoy.com], Even not mentioned clearly with signature 
 * This is not a free ware, Please DO-NOT copy it outside of this company
 * File : ConfigRegister
 * Date : 2018-07-18
 */

// 实际存储的数据
type configDataSet = { [key: string]: any }
// 数据的管理
class configRegister {
    // json数据的存放路径
    //  - TODO:目前路径为'主包'的内容,未来可以考虑是否可以热更新和处理等
    private jsonAssetRootPath: string = "json/"
    // 加载完的数据索引
    //  - key : 类型
    //  - value : 实际的数据数组,可根据关键字索引
    //  - path : 记录下加载资源的路径,可能用上
    private datas: Array<{ type: Object, path: string, values: configDataSet }> = []
    // 启动时就注册好的所有资源映射信息
    private assets: Array<{ type: Object, path: string }> = []

    // 注册类型
    register(t: Object, p: string) {
        this.assets.push({ type: t, path: p })
    }
    // 预加载资源
    preload(progress: (readyCount: number, totalCount: number) => any, finish?: (err: Error) => any) {
        let paths: Array<string> = []

        // 拼接好所有路径列表
        this.assets.forEach(s => {
            paths.push(this.jsonAssetRootPath + s.path)
        })

        // 加载资源
        enhancedLoadResourceArray(paths, (completedCount: number, totalCount: number, item: any) => {
            if (progress) {
                progress(completedCount, totalCount)
            }
        }, (error: Error, resources: any[]) => {
            if (error) {
                if (finish) {
                    finish(error)
                }
            } else {
                if (resources.length !== this.assets.length) {
                    // 数目不同, 可能丢失
                    console.error(`error, json resource loaded count=${resources.length} not equal to requested count=${this.assets.length}`)
                } else {
                    // 加载成功,缓存数据
                    for (let i = 0; i < resources.length; ++i) {
                        let asset = this.assets[i]
                        let resource = resources[i]
                        let p = asset.path
                        let t = asset.type
                        this.datas.push({ type: t, path: p, values: resource })
                    }
                }

                if (finish) {
                    finish(undefined)
                }
            }
        })
    }
    // 遍历数据
    iter<T>(type: new () => T, func: (data: T, index: number, count: number) => boolean) {
        let datas: configDataSet = null
        let exist = this.datas.some(value => {
            if (value.type === type) {
                datas = value.values
                return true
            }
            return false
        })
        if (exist && func) {
            let index = 1
            let count = Object.getOwnPropertyNames(datas).length
            for (let p in datas) {
                let shouldstop = func(datas[p], index, count)
                index++
                if (shouldstop) {
                    break
                }
            }
        }
    }
    // 读取数据
    find<T>(key: string | number, type: new () => T): T {
        let strKey: string = key.toString()
        let result: T = null
        let path: string = ""
        let exist = this.datas.some(value => {
            if (value.type === type) {
                path = value.path
                result = value.values[strKey]
                return true
            }
            return false
        })

        // 错误提示
        if (!exist) {
            console.error(`[get<T>]>>>>does not contain type:${type} json defination!`)
        }
        else if (!result) {
            // 没找到
            console.error(`[get<T>]>>>>does not contain key:${key} data at path:${path}!`)
        }
        return result
    }
    // 数据长度
    configLength<T>(type: new () => T): number {
        let datas: configDataSet = null
        let exist = this.datas.some(value => {
            if (value.type === type) {
                datas = value.values
                return true
            }
            return false
        })
        if (exist) {
            let count = Object.getOwnPropertyNames(datas).length
            return count
        }
        return 0
    }
}

// 全局创建1个对象,方便API调用
let inst: configRegister = null
function instance(): configRegister {
    if (!inst) {
        inst = new configRegister()
    }
    return inst
}

/**
 * 以下为外部调用的API
 */
// 外部调用注册类型
export function register(t: Object, p: string) {
    instance().register(t, p)
}
// 外部调用预加载
export function preloadConfig(progress: (readyCount: number, totalCount: number) => any, finish?: (err: Error) => any) {
    instance().preload(progress, finish)
}
// 外部调用读取
export function find<T>(key: string | number, type: new () => T): T {
    return instance().find(key, type)
}
// 外部调用遍历
export function iter<T>(type: new () => T, func: (data: T, index: number, count: number) => boolean) {
    instance().iter(type, func)
}

export function configLength<T>(type: new () => T): number {
    return instance().configLength(type)
}