import fs from "fs"
import path from "path"
import { PostDownloadFileType } from "~/typings"


export default defineEventHandler(async (e) => {
    return new Promise(async (res) => {
        const body: PostDownloadFileType = await readBody(e)
        let url = path.join(body.baseDir, body.dirUrl, body.name)
        console.log("download")
        if (!fs.existsSync(url)) {
            setResponseStatus(e, 404)

            return
        }
        setResponseHeader(e, "Content-Disposition", `attachment; filename=${body.name}`)
        setResponseHeader(e,"Content-Type","application/octet-stream")
        const readstream = fs.createReadStream(url)

        readstream.on("close", () => {
            console.log("end")
            e.node.res.end()
        })
        readstream.pipe(e.node.res)
    })


    // e.node.res.end()
    // readstream
})