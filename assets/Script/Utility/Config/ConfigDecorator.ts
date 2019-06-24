import { register } from "./ConfigRegister";

/**
 * Copy-right is reserved by [fanyoy.com], Even not mentioned clearly with signature 
 * This is not a free ware, Please DO-NOT copy it outside of this company
 * File : ConfigDecorator
 * Date : 2018-07-18
 */
// 自动索引json数据和ts中定义的数据类型
export function config(path: string): Function {
    return (target: Object) => {
        register(target, path)
    }
}