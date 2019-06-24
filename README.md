# cocoscreator_load_alljson
cocoscreator 加载 Json

## 环境
1. cocos creator 1.9.3
2. typescript 语法
3. win10操作系统

## 需求

动态预加载 resource/json 文件中所有文件，然后更加文件名对应相应文件中的数据

## 设计

### 1.文件结构设计

|文件夹名|描述
-|-|-|-
resources | 需要代码动态加载的资源存放处
Scene | 界面
Script | 脚本

### 2.文件设计

|文件名|文件路径|描述
-|-|-
product_config.json|resources/json/product_config.json|商品配置文件（需要解析的json）
main.fire | Scene/main.fire |展示主界面
basic.ts | Script/Json/basic.ts | json 解析配置文件
test.ts | Script/UI/test.ts | main界面挂载，预加载json 并展示json 数据的脚本
ConfigDecorator.ts | Script/Utility/Config/ConfigDecorator.ts | 自动索引json数据和ts中定义的数据类型
ConfigRegister.ts | Script/Utility/Config/ConfigRegister.ts | 解析Json 数据的管理 文件
AssetLoader.ts |  Script/Utility/Core/AssetLoader.ts | aesst 资源加载文件
typed-json.ts |  Script/Utility/ThirdParty/typed-json.ts | Ts Json 数据转换文件

## 实现
主页实现用例在 test.ts 中 

```ts

 
import { Product_config } from "../Json/basic";
import { iter,preloadConfig } from "../Utility/Config/ConfigRegister";
import { TypedJSON } from "../Utility/ThirdParty/typed-json";
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
  
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //预加载 所有的json 文件
       preloadConfig((readyCount: number, totalCount: number) => {
                    

        }, (err: Error) => {
            if (err !== null && err !== undefined) {
                //解析出错
            }else{
                //解析完成
                iter(Product_config,(data) => {
                                this.label.string += TypedJSON.stringify(data.type)+"\n"
                                return false;
                            });
            }
            
        });
    } 
    
}

```

preloadConfig() 中 
progress回调方法 readyCount 表示加载文件的数量。totalCount 加载文件的总数量。可以作物加载进度展示的数据。
finish 回调方法 

iter() 第一个参数 Product_config 解析文件数据模型，data 表示每个模式对应的一条实例数据

注：iter 要在 preloadConfig 执行完才能获得数据。故 preloadConfig放在界面启动预加载资源的是执行。iter 在 具体用到的界面 中进行解析



