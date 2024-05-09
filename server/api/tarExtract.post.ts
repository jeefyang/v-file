import fs from 'fs'
import path from "path"
import { PostTarExtractReturnType, PostTarExtractType } from '~/typings'
import * as tar from "tar"

export default defineEventHandler(async (e) => {
    return new Promise<PostTarExtractReturnType>(async (res, rej) => {
        const body: PostTarExtractType = await readBody(e)
        const r: PostTarExtractReturnType = {
            status: false,
            err: "none"
        }
        let url = path.join(body.baseDir, body.dirUrl, body.name)
        if (!fs.existsSync(url)) {
            r.err = "noExist"
            return r
        }
        const extract = tar.extract({
            cwd: path.join(body.baseDir, body.extractDirUrl)
        })
        fs.createReadStream(url).pipe(extract)
        extract.on("finish", () => {
            r.status = true
            res(r)
        })
        extract.on("error", (err) => {
            console.error('解压错误:', err);
            r.err = "errExtract"
            res(r)
        })

    })

})