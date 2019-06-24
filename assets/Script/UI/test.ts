 
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
            iter(Product_config,(data) => {
                this.label.string += TypedJSON.stringify(data.type)+"\n"
                return false;
            });
        });
    }

    start () {
      

         
    }

    // update (dt) {}
}
