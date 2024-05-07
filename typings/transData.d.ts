export type TransType = {
    from: string
    to: string
    index: number
}

export type TransingType = {
    status: "done" | "stop" | "ready" | "transing"
    /** 已经传送的状态 */
    translatedCount: number
    /** 失误传送 */
    errList: { url: string }[]
} & TransType

export type TransDataType = {
    list:TransingType[]
    
}