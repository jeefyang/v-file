import type { FileStatusType } from "~/typings"

export const formatSize = (s: number) => {
    let sizeKeys = ["字节", "KB", "MB", "GB"]
    let key = sizeKeys.find(c => {
        if (s >= 1024) {
            s /= 1024
            return false
        }
        return true
    })
    key = key || sizeKeys[sizeKeys.length - 1]
    s = (Number(s.toFixed(2)) * 100) / 100
    return `${s}${key}`
}

export const formatDate = (t: number) => {
    let d = new Date(t)
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // 月份是从0开始的
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}\n${hours}:${minutes}:${seconds}`;
    // return day
}

export const sortFileListByName = (a: FileStatusType, b: FileStatusType) => {
    if (a.isDir && !b.isDir) {
        return -1
    }
    if (!a.isDir && b.isDir) {
        return 1
    }
    return a.name > b.name ? 1 : -1
}

export const sortFileListByDate = (a: FileStatusType, b: FileStatusType) => {
    if (a.isDir && !b.isDir) {
        return -1
    }
    if (!a.isDir && b.isDir) {
        return 1
    }
    return a.mtimeMs > b.mtimeMs ? 1 : -1
}

export const sortFileListBySize = (a: FileStatusType, b: FileStatusType) => {
    if (a.isDir && !b.isDir) {
        return -1
    }
    if (!a.isDir && b.isDir) {
        return 1
    }
    return a.size > b.size ? 1 : -1
}

export const filterFileListByName = (list: FileStatusType[], s: string) => {
    return list.filter((c) => {
        return c.name.includes(s)
    })
}