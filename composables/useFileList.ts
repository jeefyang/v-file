import type { PostFileListType, PostFileListReturnType } from "~/typings";

let list: { body: PostFileListType, content: PostFileListReturnType }[] = []

export default async function (body: PostFileListType, forceRefresh?: boolean) {
    let c = list.find(c => c.body.url == body.url && c.body.baseDir == body.baseDir && c.body.ignore == body.ignore)
    if (!forceRefresh) {
        if (c) {
            c.content.isErrorUrl = false
            return c.content
        }
    }

    let o = await $fetch("/api/fileList", {
        method: "post",
        body: body,
        deep: false
    })
    if (c) {
        c.content = o
    }
    else {
        list.push({ body, content: o })
    }
    return o
}