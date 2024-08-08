import fs from "fs"
import path from "path"
import { PostDownloadSplitFileType } from "~/typings"


export default defineEventHandler(async (e) => {
    return new Promise(async (res) => {
        const body: PostDownloadSplitFileType = await readBody(e)
        let url = path.join(body.baseDir, body.dirUrl, body.name)
        if (!fs.existsSync(url)) {
            setResponseStatus(e, 404)

            return
        }
        setResponseHeader(e, "Content-Disposition", `attachment; filename=${body.name}`)
        setResponseHeader(e, "Content-Type", "application/octet-stream")
        const readstream = fs.createReadStream(url, { start: body.start, end: body.end })

        readstream.on("close", () => {
            e.node.res.end()
        })
        readstream.pipe(e.node.res)
    })


    // e.node.res.end()
    // readstream
})