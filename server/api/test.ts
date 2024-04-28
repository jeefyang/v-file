import fs from "fs"

export default defineEventHandler(() => {
    let data = fs.readFileSync('./config.example.jsonc', "utf-8")
    return data
})
