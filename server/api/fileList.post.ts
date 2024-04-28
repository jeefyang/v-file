import fs from "fs"
import path from "path"
import { FileStatusType, PostFileListType } from "~/typings"


export default defineEventHandler(async (e) => {
    const body: PostFileListType = await readBody(e)
    console.log(123, body)
    let url = path.join(body.baseDir, body.url)
    if (!fs.existsSync(url)) {
        body.url = '.'
    }
    url = path.join(body.baseDir, body.url)
    let files = fs.readdirSync(url)
    let list: FileStatusType[] = []
    let regList: RegExp[] = []
    let glist = body.ignore.split("||")
    for (let i = 0; i < glist.length; i++) {
        let g = glist[i]
        regList.push(new RegExp(`^${g}$`))
    }
    let checkRegFunc = (f: string) => {
        for (let i = 0; i < regList.length; i++) {
            let r = regList[i]
            if (r.test(f)) {
                return true
            }
        }
        return false
    }
    for (let i = 0; i < files.length; i++) {
        let f = files[i]
        if (checkRegFunc(f)) {
            continue
        }
        let u = path.join(url, f)
        let status = fs.statSync(u)
        let a: FileStatusType = {
            name: f,
            atimeMs: status.atimeMs,
            birthtimeMs: status.birthtimeMs,
            blksize: status.blksize,
            mode: status.mode,
            mtimeMs: status.mtimeMs,
            blocks: status.blocks,
            ctimeMs: status.ctimeMs,
            gid: status.gid,
            uid: status.uid,
            nlink: status.nlink,
            size: status.size,
            isDir: status.isDirectory()
        }
        list.push(a)
    }

    return { url: body.url, baseDir: body.baseDir, list: list }
})