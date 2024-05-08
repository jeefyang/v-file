
import { transData } from '../transData'
import type { GetTransMsgType } from "~/typings/transData"

export default defineEventHandler(async (e) => {
    let r: GetTransMsgType = {
        data: JSON.parse(JSON.stringify(transData.config)),
        isRuning: transData.isRunning
    }
    return r
})