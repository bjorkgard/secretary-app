const Congregation = {
    type       : 'object',
    properties : {
        name   : { type: 'string' },
        number : { type: 'string' },
    },
    required: [ 'name', 'number' ],
}

const User = {
    type       : 'object',
    properties : {
        firstname : { type: 'string' },
        lastname  : { type: 'string' },
        email     : { type: 'string' },
    },
    required: [ 'firstname', 'lastname', 'email' ],
}

export const SettingsSchema = {
    type       : 'object',
    properties : {
        _id          : { type: 'string', nullable: true },
        identifier   : { type: 'string' },
        congregation : Congregation,
        user         : User,
        createdAt    : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
        updatedAt    : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    },
    required             : [],
    additionalProperties : false,
}
