import fs from "fs"
import path from "path"
import { PostEditorFileType, PostEditorFileReturnType } from "~/typings"


export default defineEventHandler(async (e) => {
    const body: PostEditorFileType = await readBody(e)
    let url = path.join(body.baseDir, body.url, body.name)
    let r: PostEditorFileReturnType = {
        status: false,
        err: "none"
    }
    if (!fs.existsSync(url)) {
        r.err = "noExist"
        return r

    }
    if (fs.statSync(url).isDirectory()) {
        r.err = "isDir"
        return r
    }
    fs.writeFileSync(url, body.content, body.type || "utf-8")
    r.status = true
    return r
})