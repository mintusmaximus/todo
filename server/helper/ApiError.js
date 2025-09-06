class ApiError extends Error {
    constructor(message, status) {
        super(message) // call error class with errormsg
        this.status = status // set html code for status
    }
}

export { ApiError }