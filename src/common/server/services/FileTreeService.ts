import {fileTrees} from "@/common/server/repository/FileTrees";
import {FileTreeData} from "@/common/server/repository/Models";
import {randomUUID} from "crypto";

class FileTreeService{
    getUserFileTree = async (userEmail: string, classification: "doc" | "code"): Promise<Array<FileTreeData>> => {
        return fileTrees.getFileTreeDataByUser(userEmail, classification).then((fileTrees: Array<FileTreeData>) => {
           if(fileTrees && fileTrees.length > 0){
               return fileTrees
           }
           return []
        })
    }

    updateUserFileTree = async (userEmail: string, classification: "doc" | "code", fileTreeData: FileTreeData) => {
        if(userEmail !== fileTreeData.userEmail){
            throw new Error("userEmail not match")
        }
        if(!fileTreeData.id){
            throw new Error("fileTree id is required")
        }
        fileTrees.updateFileTreeData(fileTreeData).then()
    }

    addUserFileTree = async (userEmail: string, classification: "doc" | "code", fileTreeData: FileTreeData) => {
        if(fileTreeData.id){
            this.updateUserFileTree(userEmail, classification, fileTreeData).then()
            return
        }
        fileTreeData.userEmail = userEmail
        fileTreeData.classification = classification
        fileTreeData.id = randomUUID()
        fileTrees.addFileTreeData(fileTreeData).then()
    }

    removeUserFileTree = async (userEmail: string, classification: "doc" | "code", fileTreeId: string) => {
        await fileTrees.removeFileTreeData(userEmail, classification, fileTreeId)
    }

}

export const fileTreeService = new FileTreeService()