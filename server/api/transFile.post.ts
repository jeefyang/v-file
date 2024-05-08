import type { EditorTransDataType, editorTransDataResType } from "~/typings/transData"
import { transData } from '../transData'

export default defineEventHandler(async (e) => {
    const body: EditorTransDataType = await readBody(e)
    const res: editorTransDataResType = {
        type: body.type
    }
    if (body.type == "stop") {
        transData.isRunning = false
    }
    if (body.type == "start") {
        transData.isRunning = true
    }
    if (body.type == "limitSpeed") {
        transData.config.limitSpeed = body.limitSpeed || 0
    }
    if (body.type == "clear") {
        transData.isRunning = false
        transData.config.list.splice(0, transData.config.list.length)
    }
    if (body.type == "add") {
        (body.addList || []).forEach((c) => {
            res.addListErr = transData.add(c)
        })
    }
    if (body.type == "editor") {
        let index = transData.findIndex(body.editorData)
        if (index != -1) {
            transData.config.list[index].status = "stop"
            let c = transData.config.list[index]
            transData.config.list.splice(index, 1)
            if (body.editorType == "delay") {
                transData.config.list.push(c)
            }
            if (body.editorType == "urgent") {
                transData.config.list.splice(0, 0, c)
            }
            if (body.editorType == "delete") {

            }
        }
    }
    return res
})