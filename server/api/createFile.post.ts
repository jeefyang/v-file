import fs from "fs"
import path from "path"
import { PostCreateFileType, PostCreateFileReturnType } from "~/typings"


export default defineEventHandler(async (e) => {
    const body: PostCreateFileType = await readBody(e)
    let url = path.join(body.baseDir, body.url, body.name)
    let r: PostCreateFileReturnType = {
        status: false,
        err: "none"
    }
    if (fs.existsSync(url)) {
        r.err = "exist"
        return r

    }

    if (body.isDir) {
        fs.mkdirSync(url)
    }
    else {
        fs.writeFileSync(url, "", "utf-8")
    }

    r.status = true
    return r
})