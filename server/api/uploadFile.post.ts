import fs from "fs"
import path from "path"
import { PostUploadFileType, PostUploadFileReturnType } from "~/typings"


export default defineEventHandler(async (e) => {

    const form = await readFormData(e)
    let r: PostUploadFileReturnType = {
        statusList: [],
        err: "none",
        status: false
    }
    const baseDir: string = <any>form.get("baseDir")
    const url: string = <any>form.get("url")
    const isOverride: boolean = !!Number(form.get("isOverride") || 0)

    // 管道读取数据到文件
    let pipeBlobToFile = async (reader: ReadableStreamDefaultReader<Uint8Array>, fileWriter: fs.WriteStream) => {
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            fileWriter.write(value);
        }

        fileWriter.end();
    }
    // console.log(baseDir, url, isOverride)
    await new Promise<null>(res => {
        let asyncCount = 0
        form.forEach(async (v, k, p) => {
            if (k != "files[]") {
                return
            }
            asyncCount++
            let f: File = <any>v
            let furl = path.join(baseDir, url, f.name)
            if (fs.existsSync(furl) && !isOverride) {
                r.statusList.push({ name: f.name, isWrite: false })
                asyncCount--
                if (asyncCount == 0) {
                    res(null)
                }
                return
            }

            const reader = new Response(f)?.body?.getReader();
            if (!reader) {
                r.statusList.push({ name: f.name, isWrite: false })
                asyncCount--
                if (asyncCount == 0) {
                    res(null)
                }
                return
            }
            const fileWriter = fs.createWriteStream(furl);
            await pipeBlobToFile(reader, fileWriter)
            r.statusList.push({ name: f.name, isWrite: true })
            asyncCount--
            if (asyncCount == 0) {
                res(null)
            }
            return
        })
    })
    r.status = true
    return r
})