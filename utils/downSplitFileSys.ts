import { Dexie, type EntityTable } from 'dexie';
import { v4 as uuidv4 } from "uuid"
import type { PostDownloadSplitFileType } from '~/typings';

export interface SplitDataDB {
    no: number;
    fullSize: number;
    id?: number;
    uuid: string
    start: number
    end: number
    isDone: number
    b64: string
}

export interface SplitFileDB {
    dirUrl: string
    name: string
    len: number
    uuid_content: string
    splitSize: number
    size: number
    id?: number
}

export class DownSplitFileSys {

    db: Dexie & {
        splitData: EntityTable<SplitDataDB, 'id'>
        splitFile: EntityTable<SplitFileDB, 'id'>
    } = <any>new Dexie("splitDataDB")

    constructor() {
        this.db.version(1).stores({
            splitData: "++id,uuid",
            splitFile: "++id,dirUrl,name,size,splitSize"
        })
    }

    async downloadSplitFile(baseDir: string, dirUrl: string, name: string, size: number, splitSize: number, cb: (type: "splitDownload" | "merge" | "delSplit" | "delFile", int: number, len: number) => void) {

        let fileList = await this.db.splitFile.where('dirUrl').equals(dirUrl).and(c => c.splitSize == splitSize && c.size == size && c.name == name).toArray()
        if (fileList.length == 0) {
            let u = uuidv4()
            let uuid_content: string[] = [u]
            let fullSize = Math.min(size, splitSize)
            let no = 0
            let start = 0
            await this.db.splitData.add({ no: no, uuid: u, fullSize: fullSize, start: start, end: fullSize, isDone: 0, b64: "" })

            for (let i = splitSize; i < size; i += splitSize) {

                start += fullSize + 1
                fullSize = Math.min(splitSize, size - start)
                no++
                u = uuidv4()
                let o: SplitDataDB = { no: no, uuid: u, fullSize: fullSize, start: start, end: start + fullSize, isDone: 0, b64: "" }
                await this.db.splitData.add(o)
                uuid_content.push(u)
            }
            fileList.push({
                dirUrl: dirUrl,
                name: name,
                size: size,
                splitSize: splitSize,
                len: no + 1,
                uuid_content: uuid_content.join(','),

            })
            this.db.splitFile.add(fileList[0])
        }
        let file = fileList[0]

        console.log(file)

        let uuidList = file.uuid_content.split(',')
        // 下载
        for (let i = 0; i < uuidList.length; i++) {
            let uuid = uuidList[i]
            let a = await this.db.splitData.where("uuid").equals(uuid).toArray()
            let c = a[0]
            if (c.isDone) {
                cb("splitDownload", i, file.len)
                continue
            }

            let b = await this.postFile(baseDir, dirUrl, name, c.start, c.end)
            c.b64 = await this.blobToBase64(b)
            c.isDone = 1

            await this.db.splitData.put(c)
            cb("splitDownload", i, file.len)
        }
        // 合并
        cb("merge", -1, file.len)
        let blobList: Blob[] = []
        for (let i = 0; i < uuidList.length; i++) {
            let uuid = uuidList[i]
            let a = await this.db.splitData.where("uuid").equals(uuid).toArray()
            let c = a[0]
            cb("merge", i, file.len)
            let b = this.base64ToBlob(c.b64)
            blobList.push(b)
        }
        let b = new Blob(blobList)
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(b);
        link.download = name;

        // Trigger the download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        cb("delSplit", 0, file.len)
        let list = await this.db.splitFile.where('dirUrl').equals(dirUrl).and(c => c.name == name).toArray()
        for (let i = 0; i < list.length; i++) {
            let c = list[i]
            //删除缓存切片
            let uuidList = c.uuid_content.split(',')
            for (let j = 0; j < uuidList.length; j++) {
                let cc = uuidList[j]
                await this.db.splitData.where('uuid').equals(cc).delete()
            }
        }
        //删除缓存文件指针
        cb("delFile", 0, file.len)
        await this.db.splitFile.where('dirUrl').equals(dirUrl).and(c => c.name == name).delete()
        return
    }

    private async postFile(baseDir: string, dirUrl: string, name: string, start: number, end: number) {
        let body: PostDownloadSplitFileType = {
            baseDir: baseDir,
            dirUrl: dirUrl,
            name: name,
            start: start,
            end: end
        }
        let f = await $fetch("/api/downSplitFile", {
            method: "post",
            body
        })
        const blob = new Blob([(<any>f)]);
        return blob
    }


    private async blobToBase64(blob: Blob): Promise<string> {
        return new Promise(res => {
            const reader = new FileReader();
            reader.onload = function (e) {
                res(<any>(e?.target?.result))
            };
            reader.readAsDataURL(blob);
        })
    }

    private base64ToBlob(base64: string) {
        const parts = base64.split(';base64,');
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array]);
    }

    async hasOther(): Promise<-1 | 1 | 0> {
        let fileList = await this.db.splitFile.toArray()
        if (fileList.length > 0) {
            return 1
        }
        let splitList = await this.db.splitData.toArray()
        if (splitList.length > 0) {
            return -1
        }
        return 0
    }

    async clearFile() {
        await this.db.splitFile.clear()
    }

    async clearSplit() {
        await this.db.splitData.clear()
    }

}