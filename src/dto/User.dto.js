// src/dto/User.dto.js

export default class UserDTO {
    static getUserTokenFrom = (user) => ({
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        email: user.email
    })

    static getPublicUserFrom = (user) => ({
        id: user._id,
        fullName: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
        pets: user.pets
    })

    static getPrivateUserFrom = (user) => ({
        ...this.getPublicUserFrom(user),
        last_login: user.last_login,
        created_at: user.created_at
    })
}