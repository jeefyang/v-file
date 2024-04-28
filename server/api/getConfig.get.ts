import fs from "fs"
import { ConfigType } from "~/typings"


export default defineEventHandler(() => {
    let exampleUrl = "./config.example.jsonc"
    let url = "./config.jsonc"
    // 开发环境调试
    if (process.env.NODE_ENV == "development") {
        url = exampleUrl
    }
    if (!fs.existsSync(url)) {
        let steam = fs.readFileSync(exampleUrl)
        fs.writeFileSync(url, steam)
    }
    let str = fs.readFileSync(url, "utf-8")
    if (!str) {
        let steam = fs.readFileSync(exampleUrl)
        fs.writeFileSync(url, steam)
    }
    else {
        str = fs.readFileSync(url, "utf-8")
    }
    let data: ConfigType = JSON.parse(str)
    return data
})
