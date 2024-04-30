import fs from "fs"
import path from "path"
import { PostFileContentType, PostFileContentReturnType } from "~/typings"


export default defineEventHandler(async (e) => {
    const body:PostFileContentType = await readBody(e)
    let url = path.join(body.baseDir, body.url, body.name)
    let o: PostFileContentReturnType = {
        isExist: true,
        content: "",
        url: url
    }
    if (!fs.existsSync(url)) {
        o.isExist = false
        return o
    }
    o.content = fs.readFileSync(o.url, body.type || "utf-8")
    return o
})