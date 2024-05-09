import fs from "fs"
import { PostTarPackType, PostTarPackReturnType } from "~/typings"
import * as tar from "tar"
import path from "path"

export default defineEventHandler(async (e) => {
    let body: PostTarPackType = await readBody(e)
    let r: PostTarPackReturnType = {
        status: false,
        err: "none",
        noCompletePackList: []
    }

    if (body.baseDir && !fs.existsSync(body.baseDir)) {
        r.err = "noExistPackDir"
        return r
    }

    if (body.packDirUrl && !fs.existsSync(path.join(body.baseDir || "", body.packDirUrl))) {
        r.err = "noExistPackDir"
        return r
    }

    await new Promise((res, rej) => {
        // const output = fs.createWriteStream(path.join(body.baseDir, body.packDirUrl, body.packName))
        const filesToPack = []
        for (let i = 0; i < body.filenameList.length; i++) {
            let c = body.filenameList[i]
            let url = path.join(body.baseDir, body.packDirUrl, body.filenameList[i])
            if (!fs.existsSync(url)) {
                r.noCompletePackList.push(c)
                continue
            }
            filesToPack.push(c)
        }
        tar.c(
            {
                gzip: true,
                file: path.join(body.baseDir, body.packDirUrl, body.packName),
                cwd: path.join(body.baseDir, body.packDirUrl)
            },
            filesToPack
        ).then(() => {
            console.log("打包完成")
            res(undefined)
        })
    })
    return r

})
