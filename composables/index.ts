import type { EditorFileTypeType } from "~/typings"

export const useTest = () => {
    return useState("test", () => false)
}

export const useEditorFilter = () => {
    return useState("editorFilter", () => "")
}

export const useEditorFileUrl = () => {
    return useState("editorFileUrl", () => <string[]>[])
}

export const useDisplayEditorFile = () => {
    return useState("displayEditorFile", () => false)
}

export const useFileContent = () => {
    return useState("fileContent", () => "")
}

export const useFileContentType = () => {
    return useState("fileContentType", () => <EditorFileTypeType>"utf-8")
}

export const useToRouter = () => {
    return useState("toRouter", () => "")
}
