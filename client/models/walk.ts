export class Walk {
    CreatorUserID: string
    StartLatitude: string
    StartLongitude: string
    EndLatitude: string
    EndLongitude: string
    DepartureTime: Date
    DepartureTimeString: string
    Description: string
    StartAddress: string
    EndAddress: string
    UsersInGroup: string[]
    HasJoined: boolean = false
}
