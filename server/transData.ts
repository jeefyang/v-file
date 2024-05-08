import Trans from '~/components/trans.vue';
import type { AddTransDataErrType, TransDataType, TransType, TransingStatusType, TransingType } from '~/typings/transData';
import fs from 'fs'
import path from "path"
import Throttle from "throttle"



class TransData {

    /** 运行信息 */
    config: TransDataType = { list: [], limitSpeed: 10 }
    /** 是否正在运行 */
    isRunning: boolean = false
    /** 当前传输的子链接 */
    curChild: TransingType | undefined = undefined

    constructor() {

    }

    loadFile(url: string) {
        if (!fs.existsSync(url)) {
            return
        }
        let s = fs.readFileSync(url, "utf-8")
        this.config = JSON.parse(s)
    }

    saveFile(url: string) {
        let s = JSON.stringify(this.config)
        fs.writeFileSync(url, s, "utf-8")
    }

    async copyFile(from: string, to: string) {
        return new Promise((res, rej) => {
            const readStream = fs.createReadStream(from)
            const writeStream = fs.createWriteStream(to)

            if (this.config.limitSpeed) {
                let throttle = new Throttle(1024 * this.config.limitSpeed)
                readStream.pipe(throttle).pipe(writeStream)
            }
            else {
                readStream.pipe(writeStream)
            }
            writeStream.on("finish", () => {
                res(undefined)
            })
        })
    }


    async cutFile(from: string, to: string) {
        await this.copyFile(from, to)
        return new Promise((res, rej) => {
            fs.rm(from, () => {
                res(undefined)
            })
        })
    }

    async rmDir(url: string) {
        return new Promise((res, rej) => {
            fs.rmdir(url, (err) => {
                res(undefined)
            })
        })
    }

    add(child: TransType) {
        let s: AddTransDataErrType = "none"
        for (let i = 0; i < this.config.list.length; i++) {
            let c = this.config.list[i]

            if (c.from == child.from && c.to == child.to) {
                s = "same"
                return s
            }
        }
        let obj: TransingType = {
            from: child.from,
            to: child.to,
            errList: [],
            isCut: child.isCut,
            isUrgent: child.isUrgent,
            isIncludeDir: child.isIncludeDir,
            status: "ready",
            translatedCount: 0,
            err: "none",
            ctime: child.ctime,
            mtime: child.mtime
        }
        if (child.isUrgent) {
            this.config.list.splice(0, 0, obj)
        }
        else {
            this.config.list.push(obj)
        }
        return s
    }

    find(child?: TransType) {
        if (!child) {
            return undefined
        }
        return this.config.list.find(c => {
            return child.from == c.from && child.to == c.to
        })
    }

    findIndex(child?: TransType) {
        if (!child) {
            return -1
        }
        return this.config.list.findIndex(c => {
            return child.from == c.from && child.to == c.to
        })
    }

    async readDir(url: string): Promise<string[]> {
        return new Promise((res, rej) => {
            fs.readdir(url, (err, files) => {
                res(files)
            })
        })
    }

    async mkDir(url: string): Promise<boolean> {
        return new Promise((res, rej) => {
            fs.mkdir(url, { recursive: true }, (err) => {
                if (err) {
                    res(false)
                    return
                }
                res(true)
                return
            })
        })
    }



    async fsstat(url: string): Promise<fs.Stats> {
        return new Promise((res, rej) => {
            fs.stat(url, (err, stat) => {
                if (err) {
                    rej(err)
                    return
                }
                res(stat)
                return
            })
        })
    }

    checkTransingStatus(): TransingStatusType {
        let first = this.config.list[0]
        if (!first) {
            return "stop"
        }
        if (first.isUrgent && (first.status == "ready" || first.status == "stop")) {
            return "stop"
        }
        if (this.curChild && this.curChild.status == "stop") {
            return "stop"
        }
        return "transing"
    }

    async copyDir(from: string, to: string, isCut: boolean, isIncludeDir: boolean): Promise<TransingStatusType> {
        let files = await this.readDir(from)
        if (this.checkTransingStatus() == "stop") {
            return "stop"
        }
        let newTo = to
        if (isIncludeDir) {
            let baseName = path.basename(from)
            newTo = path.join(to, baseName)
            if (!fs.existsSync(newTo)) {
                await this.mkDir(newTo)
                if (this.checkTransingStatus() == "stop") {
                    return "stop"
                }
            }
        }
        for (let i = 0; i < files.length; i++) {
            let f = files[i]
            let newFromFile = path.join(from, f)
            let newToFile = path.join(newTo, f)
            let stat = await this.fsstat(newFromFile)
            if (this.checkTransingStatus() == "stop") {
                return "stop"
            }
            if (stat.isDirectory()) {
                await this.copyDir(newFromFile, newToFile, isCut, true)
            }
            else {
                if (isCut) {
                    await this.cutFile(newFromFile, newToFile)
                }
                else {
                    console.log(newFromFile, newToFile)
                    await this.copyFile(newFromFile, newToFile)
                }
                if (this.curChild) {
                    this.curChild.translatedCount++
                }
            }
            if (this.checkTransingStatus() == "stop") {
                return "stop"
            }
        }
        if (isIncludeDir) {
            await this.rmDir(from)
        }
        return "done"
    }



    async setChildTrans(child: TransingType): Promise<TransingStatusType> {
        if (!fs.existsSync(child.from)) {
            child.err = "noExist"
            child.status = "done"
            child.mtime = (new Date()).getTime()
            return "stop"
        }
        let stat = await this.copyDir(child.from, child.to, child.isCut, child.isIncludeDir)
        if (stat == "stop") {
            child.status = "stop"
            child.mtime = (new Date()).getTime()
            return "stop"
        }
        child.isUrgent = false
        child.status = 'done'
        child.mtime = (new Date()).getTime()
        return "done"
    }

    private async _loopRun(): Promise<TransingStatusType> {
        for (let i = 0; i < this.config.list.length; i++) {
            let l = this.config.list[i]
            this.curChild = l
            l.status = "transing"
            l.mtime = (new Date()).getTime()
            let s = await this.setChildTrans(l)
            if (s == "stop") {
                if (this.isRunning) {
                    return await this._loopRun()
                }
                else {
                    return "stop"
                }
            }
        }
        return "done"
    }

    async run() {
        if (this.isRunning) {
            return
        }
        if (this.config.list.length == 0) {
            return
        }
        this.isRunning = true
        let stat = await this._loopRun()
        if (stat == "done") {
            this.config.list = []
            this.isRunning = false
        }
        return
    }

}

export const transData = new TransData()