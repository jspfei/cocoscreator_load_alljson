/**
 * Copy-right is reserved by [fanyoy.com], Even not mentioned clearly with signature 
 * This is not a free ware, Please DO-NOT copy it outside of this company
 * File : AssetLoader
 * Date : 2018-08-08
 */
// 在1个时刻,加载完所有的资源(热更新)
export function preloadAssets(onProgress?: (progress: number) => void, onLoaded?: (err?) => void, target?: any) {
    let finish = (err?) => {
        // 不能设置为空,否则'分享图片'没有地方读取了.
        // if (CC_WECHATGAME) {
        //     wxDownloader.REMOTE_SERVER_ROOT = ""
        // }
        if (onLoaded) {
            if (target) {
                onLoaded.call(target, err)
            }
            else {
                onLoaded(err)
            }
        }
    }
    let step = (val: number) => {
        if (onProgress) {
            if (target) {
                onProgress.call(target, val)
            } else {
                onProgress(val)
            }
        }
    }

    let importPath = ""
    let assetPath = ""
    let allAssets: Array<string> = []
    if (cc.loader.md5Pipe) {
        importPath = cc.loader.md5Pipe.libraryBase
        assetPath = cc.loader.md5Pipe.rawAssetsBase
        allAssets = []

        let globalAssetsMap = cc.loader.md5Pipe.md5AssetsMap
        for (let asset in globalAssetsMap) {
            let assetMd5 = globalAssetsMap[asset]

            // 找到再处理!
            if (asset.startWith("assets") || asset.startWith("internal")) {
                asset = assetPath + asset
            } else {
                asset = importPath + asset
            }
            // 对md5进行处理
            let splits = asset.split(".")
            if (splits.length > 1) {
                let result = splits[0]
                for (let i = 1; i < splits.length; ++i) {
                    if (i === splits.length - 1) {
                        result += "." + assetMd5 + "." + splits[i]
                    }
                    else {
                        result += "." + splits[i]
                    }
                }
                asset = result
            }
            allAssets.push(asset)
        }
    }

    if (allAssets.length === 0) {
        finish()
    } else {
        let completedCount = 0
        let totalCount = allAssets.length
        let func = () => {
            window.wxHotUpdater.ensureLocalText(allAssets[completedCount], (err, path) => {
                completedCount++
                let p = completedCount / totalCount
                step(p)
                if (completedCount === totalCount) {
                    finish()
                } else {
                    func()
                }
            })
        }

        func()
    }
}

// 随机加载一定数量的'干扰文件'
export function preloadDisturbAssets(count: number, onProgress?: (progress: number) => void, onLoaded?: (err?) => void, target?: any) {
    let finish = (err?) => {
        if (onLoaded) {
            if (target) {
                onLoaded.call(target, err)
            }
            else {
                onLoaded(err)
            }
        }
    }
    let step = (val: number) => {
        if (onProgress) {
            if (target) {
                onProgress.call(target, val)
            } else {
                onProgress(val)
            }
        }
    }

    let importPath = ""
    let assetPath = ""
    let allAssets: Array<string> = []
    if (cc.loader.md5Pipe) {
        importPath = cc.loader.md5Pipe.libraryBase
        assetPath = cc.loader.md5Pipe.rawAssetsBase
        allAssets = []

        let globalAssetsMap = cc.loader.md5Pipe.md5AssetsMap
        for (let asset in globalAssetsMap) {
            let assetMd5 = globalAssetsMap[asset]

            // 找到再处理!
            if (asset.startWith("assets") || asset.startWith("internal")) {
                asset = assetPath + asset
            } else {
                asset = importPath + asset
            }
            // 对md5进行处理
            let splits = asset.split(".")
            if (splits.length > 1) {
                let result = splits[0]
                for (let i = 1; i < splits.length; ++i) {
                    if (i === splits.length - 1) {
                        result += "." + assetMd5 + "." + splits[i]
                    }
                    else {
                        result += "." + splits[i]
                    }
                }
                asset = result
            }
            allAssets.push(asset)
        }
    }

    if (allAssets.length === 0) {
        finish()
    } else {
        // 随机指定个数
        if (count > 0 && count < allAssets.length) {
            let assets = allAssets
            allAssets = []
            for (let i = 0; i < count; ++i) {
                let idx = Math.floor(Math.random() * allAssets.length)
                allAssets.push(assets[idx])
                assets.splice(idx, 1)
            }
        }

        let completedCount = 0
        let totalCount = allAssets.length
        let func = () => {
            window.wxHotUpdater.readLocalText(allAssets[completedCount], (err, path) => {
                completedCount++
                let p = completedCount / totalCount
                step(p)
                if (completedCount === totalCount) {
                    finish()
                } else {
                    func()
                }
            })
        }

        func()
    }
}

// 获取'1个asset'的真实名称
export function getAssetsPath(name: string) {
    if (cc.loader.md5Pipe) {
        let importPath = cc.loader.md5Pipe.libraryBase
        let assetPath = cc.loader.md5Pipe.rawAssetsBase
        let assetMd5 = cc.loader.md5Pipe.md5AssetsMap[name]
        if (assetMd5) {
            // 找到再处理!
            if (name.startWith("assets") || name.startWith("internal")) {
                name = assetPath + name
            } else {
                name = importPath + name
            }
            // 对md5进行处理
            let splits = name.split(".")
            if (splits.length === 1) {
                return name
            }
            let result = splits[0]
            for (let i = 1; i < splits.length; ++i) {
                if (i === splits.length - 1) {
                    result += "." + assetMd5 + "." + splits[i]
                }
                else {
                    result += "." + splits[i]
                }
            }
            return result
        }
    }
    return name
}

// 带'干扰功能'和'映射功能'的资源加载
export function enhancedLoadResource(name: string, finished: (err: Error, res: any) => void) {
    if (window.resref) {
        let redirect = window.resref[name]
        if (redirect) {
            name = redirect
        }
    }
    cc.loader.loadRes(name, finished)
}
export function enhancedLoadResourceWithType(name: string, type: typeof cc.Asset, finished: (err: Error, res: any) => void) {
    if (window.resref) {
        let redirect = window.resref[name]
        if (redirect) {
            name = redirect
        }
    }
    cc.loader.loadRes(name, type, finished)
}
export function enhancedLoadResourceArray(urls: string[], progress: (c: number, t: number, i: any) => void, complete?: ((e: Error, r: any[]) => void)) {
    let redirects = urls
    if (window.resref) {
        redirects = []
        for (let u of urls) {
            let redirect = window.resref[u]
            if (redirect) {
                redirects.push(redirect)
            } else {
                redirects.push(u)
            }
        }
    }
    cc.loader.loadResArray(redirects, progress, complete)
}