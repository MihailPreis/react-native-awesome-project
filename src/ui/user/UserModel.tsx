export default interface UserModel {
    gender: string;
    name: UserName;
    location: UserLocation;
    email: string;
    login: UserLogin;
    dob: UserDob;
    registered: UserRegistered;
    phone: string;
    cell: string;
    id: UserId;
    picture: UserPicture;
    nat: string;
}

export interface UsersResponse {
    results: UserModel[];
    info: UsersResponseInfo;
}

export interface UsersResponseInfo {
    seed: string;
    results: number;
    page: number;
    version: string;
}

export interface UserName {
    title: string;
    first: string;
    last: string;
}

export interface UserCoordinates {
    latitude: string;
    longitude: string;
}

export interface UserTimezone {
    offset: string;
    description: string;
}

export interface UserLocation {
    country: string;
    street: UserLocationStreet;
    city: string;
    state: string;
    postcode: string;
    coordinates: UserCoordinates;
    timezone: UserTimezone;
}

export interface UserLocationStreet {
    name: string;
    number: string;
}

export interface UserLogin {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
}

export interface UserDob {
    date: Date;
    age: number;
}

export interface UserRegistered {
    date: Date;
    age: number;
}

export interface UserId {
    name: string;
    value: string;
}

export interface UserPicture {
    large: string;
    medium: string;
    thumbnail: string;
}
