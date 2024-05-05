import fs from "fs"
import path from "path"
import { PostRenameFileType, PostRenameFileReturnType } from "~/typings"


export default defineEventHandler(async (e) => {
    const body: PostRenameFileType = await readBody(e)
    let url = path.join(body.baseDir, body.url, body.name)
    let r: PostRenameFileReturnType = {
        status: false,
        err: "none"
    }
    if (!fs.existsSync(url)) {
        r.err = "noExist"
        return r
    }
    let s = fs.statSync(url)
    if (s.isDirectory() && !body.isDir) {
        r.err = "isFile"
        return r
    }

    if (s.isFile() && body.isDir) {
        r.err = "isDir"
        return r
    }

    let renameUrl = path.join(body.baseDir, body.url, body.rename)
    fs.renameSync(url, renameUrl)
    r.status = true
    return r
})