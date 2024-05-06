import fs from "fs"
import path from "path"
import { PostDelFileType, PostDelFileReturnType } from "~/typings"


export default defineEventHandler(async (e) => {
    const body: PostDelFileType = await readBody(e)
    console.log(body)
    let url = path.join(body.baseDir, body.url, body.name)
    let r: PostDelFileReturnType = {
        status: false,
        err: "none"
    }
    if (!fs.existsSync(url)) {
        r.err = "noExist"
        return r

    }
    if (body.isDir) {

        let delFunc = (p: string) => {
            let l = fs.readdirSync(p)
            for (let i = 0; i < l.length; i++) {
                let u = path.join(p, l[i])
                let s = fs.statSync(u)
                if (s.isDirectory()) {
                    delFunc(path.join(u))
                }
                fs.unlinkSync(u)
            }
            fs.rmdirSync(p)
        }
        try {
            delFunc(url)
            r.status = true
        }
        catch {
            r.err = "noDel"
        }
        return r
    }
    else {
        try {
            fs.unlinkSync(url)
            r.status = true
        }
        catch {
            r.err = "noDel"
        }
        return r
    }

})