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