module.exports = {
    copyObject: obj => {
        return JSON.parse(JSON.stringify(obj))
    }
}
