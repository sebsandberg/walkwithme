export class User {
    id: string
    name: number
    password: string
    points: number = 0

    constructor() {
        this.id = this.guid()
    }

    guid() {
        function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
        }
        return [s4(), s4(), s4(), s4()].join('-')
    }
}
