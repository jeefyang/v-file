import fs from "fs"

export default defineEventHandler(() => {
    let exampleUrl = "./config.example.jsonc"
    let url = "./config.jsonc"
    if (!fs.existsSync(url)) {
        let steam = fs.readFileSync(exampleUrl)
        fs.writeFileSync(url, steam)
    }
    let data = fs.readFileSync(url, "utf-8")
    return data
})
