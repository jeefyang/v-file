import fs from "fs"

type ConfigType = {
    baseDir: string
    ignore: string[]
}

type PostFileListType = {
    baseDir: string
    url: string
    ignore: string
}

type PostFileListReturnType = {
    url: string,
    baseDir: string
    list: FileStatusType[]
}

type PostFileContentType = {
    baseDir: string
    url: string
    name: string
    type?: "utf-8" | "base64" | "ascii" | "base64url"
}

type PostFileContentReturnType = {
    content?: string
    isExist: boolean
    url: string
}

type FileStatusType = {
    name: string
    atimeMs: number
    birthtimeMs: number
    blksize: number
    blocks: number
    ctimeMs: number
    mode: number
    mtimeMs: number
    nlink: number
    size: number
    gid: number
    uid: number
    isDir: boolean
}

type PostCreateFileType = {
    isDir: boolean
    url: string,
    baseDir: string
    name: string
}

type PostCreateFileReturnType = {
    status: boolean
    err: "none" | "exist"
}


type PostUploadFileType = {
    url: string,
    baseDir: string
    files: FileList
    isOverride?: boolean
}

type PostUploadFileReturnType = {
    statusList: { name: string, isWrite: boolean }[]
    status: boolean
    err: "none"
}


type PostEditorFileType = {
    url: string,
    baseDir: string
    name: string
    content: string
    type?: "utf-8" | "base64" | "ascii" | "base64url"
}

type PostEditorFileReturnType = {
    status: boolean
    err: "none" | "noExist" | "isDir"
}

type PostRenameFileType = {
    url: string,
    baseDir: string
    name: string
    rename: string
    isDir: boolean
}

type PostRenameFileReturnType = {
    status: boolean
    err: "none" | "isDir" | "isFile" | "noExist"
}

type MonacoEditorLangType = "plaintext" | "bat" | "cpp" | "html" | "ini" | "c" | "csharp" | "css" | "dart" | "go" | "java" | "javascript" | "julia" | "kotlin" | "less" | "lua" | "mysql" | "objective-c" | "pascal" | "php" | "powershell" | "python" | "r" | "rust" | "shell" | "ruby" | "scss" | "sql" | "swift" | "typescript" | "vb" | "xml" | "yaml" |
    "json" | "coffeescript" | "markdown" | "perl" | "pug"
