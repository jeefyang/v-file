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

type MonacoEditorLangType = "plaintext" | "bat" | "cpp" | "html" | "ini" | "c" | "csharp" | "css" | "dart" | "go" | "java" | "javascript" | "julia" | "kotlin" | "less" | "lua" | "mysql" | "objective-c" | "pascal" | "php" | "powershell" | "python" | "r" | "rust" | "shell" | "ruby" | "scss" | "sql" | "swift" | "typescript" | "vb" | "xml" | "yaml" |
"json" | "coffeescript" | "markdown"|"perl"|"pug"