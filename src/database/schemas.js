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

const Settings = {
    type       : 'object',
    properties : {
        online: { type: 'boolean' },
    },
    required: [],
}

export const DatesSchema = {
    type       : 'object',
    properties : {
        _id       : { type: 'string', nullable: true },
        type      : { type: 'string', nullable: false },
        date      : { type: 'object', format: 'custom-date-time', false: true, required: [] },
        createdAt : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
        updatedAt : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    },
    required             : [ 'type', 'date' ],
    additionalProperties : false,
}

export const SettingsSchema = {
    type       : 'object',
    properties : {
        _id          : { type: 'string', nullable: true },
        identifier   : { type: 'string' },
        congregation : Congregation,
        user         : User,
        settings     : Settings,
        createdAt    : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
        updatedAt    : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    },
    required             : [],
    additionalProperties : false,
}
