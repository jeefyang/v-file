export type TransType = {
    from: string
    to: string
    /** 是否为剪切 */
    isCut: boolean
    /** 是否包含文件夹 */
    isIncludeDir: boolean
    /** 是否加急 */
    isUrgent: boolean
    /** 新建时间 */
    ctime: number
    /** 修改时间 */
    mtime: number
}

export type TransingStatusType = "done" | "stop" | "ready" | "transing"

export type TransingType = {
    /** 当前传输的状态 */
    status: TransingStatusType
    /** 已经传输的数量 */
    translatedCount: number
    /** 失误传输列表 */
    errList: { url: string }[]
    /** 执行错误 */
    err: "none" | "noExist"
} & TransType

export type TransDataType = {
    /** 传输列表 */
    list: TransingType[]
    /** 限速,0为不限速 */
    limitSpeed: number

}

export type EditorTransDataTypeType = "add" | "editor" | "start" | "stop" | "limitSpeed" | "clear"

export type EditorTransDataTypeEditorType = "delay" | "urgent" | "delete"

export type EditorTransDataType = {
    type: EditorTransDataTypeType
    limitSpeed?: number
    addList?: TransType[]
    editorData?: TransType
    editorType?: typeEditorTransDataTypeEditorType
}

export type editorTransDataResType = {
    type: EditorTransDataTypeType
    addListErr?: "none" | "same"
}

export type GetTransMsgType = {
    data: TransDataType,
    isRuning: boolean
}

export type AddTransDataErrType = "none" | "same"

