export const useTest = () => {
    return useState("test", () => false)
}

export const useEditorFilter = () => {
    return useState("editorFilter", () => "")
}

export const useEditorFileUrl = () => {
    return useState("editorFileUrl", () => "")
}

export const useDisplayEditorFile = () => {
    return useState("displayEditorFile", () => false)
}

export const useFileContent = () => {
    return useState("fileContent", () => "")
}

export const useToRouter = () => {
    return useState("toRouter", () => "")
}
