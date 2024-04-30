export const useTest = () => {
    return useState("test", () => false)
}

export const useEditorFilter = () => {
    return useState("editorFilter", () => "")
}

export const useEidtorFileUrl = () => {
    return useState("editorFileUrl", () => "")
}

export const useLoading = () => {
    return useState("loading", () => false)
}

export const useManageLoading = () => {
    return useState("manageLoading", () => false)
}

export const useFileContentLoading = () => {
    return useState("fileContentLoading", () => false)
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