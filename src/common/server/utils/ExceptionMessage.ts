
export enum ExceptionType {
    NORMAL,
    WARNING,
    ERROR,
}

export const exceptionMessages = {
    USER_NOT_FOUND: {
        type: ExceptionType.NORMAL,
        message: "User not found",
    },
    PASSWORD_ERROR: {
        type: ExceptionType.NORMAL,
        message: "Password error",
    },
    SERVER_ERROR: {
        type: ExceptionType.NORMAL,
        message: "Server error",
    }
}

export class ErrorMessage implements Error{
    type: ExceptionType;
    message: string;
    name: string;

    constructor(type: ExceptionType = ExceptionType.NORMAL, exceptionMessage: any = exceptionMessages.SERVER_ERROR) {
        this.type = type;
        this.message = exceptionMessage.message;
        this.name = type.toString();
    }

}