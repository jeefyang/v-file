import fs from "fs"
import path from "path"
import { FileStatusType, PostFileListReturnType, PostFileListType } from "~/typings"

export default defineEventHandler(async (e) => {
    const body: PostFileListType = await readBody(e)
    let url = path.join(body.baseDir, body.url)
    let isErrorUrl: boolean = false
    if (!fs.existsSync(url)) {
        body.url = '.'
        isErrorUrl = true
    }
    url = path.join(body.baseDir, body.url)
    let files = fs.readdirSync(url)
    let fileList: FileStatusType[] = []
    let folderList: FileStatusType[] = []
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
        a.isDir ? (folderList.push(a)) : (fileList.push(a))
    }
    let r: PostFileListReturnType = {
        url: body.url, baseDir: body.baseDir, list: [...folderList, ...fileList], isErrorUrl
    }
    return r
})