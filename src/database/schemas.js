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

export const ServiceGroupSchema = {
    type       : 'object',
    properties : {
        _id       : { type: 'string', nullable: true },
        name      : { type: 'string', nullable: false },
        createdAt : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
        updatedAt : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    },
    required             : [ 'name' ],
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

export const AddressSchema = {
    type       : 'object',
    properties : {
        _id       : { type: 'string', nullable: true },
        address1  : { type: 'string' },
        address2  : { type: 'string', nullable: true },
        zip       : { type: 'string' },
        city      : { type: 'string' },
        createdAt : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
        updatedAt : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    },
    required             : [ 'address1', 'zip', 'city' ],
    additionalProperties : false,
}

const Emergency = {
    type       : 'object',
    properties : {
        name  : { type: 'string', nullable: true },
        phone : { type: 'string', nullable: true },
        email : { type: 'string', nullable: true },
    },
    required: [],
}

const Child = {
    type       : 'object',
    properties : {
        firstName : { type: 'string' },
        birthday  : { type: 'string', nullable: true },
    },
    required: [ 'firstName' ],
}

export const PublisherSchema = {
    type       : 'object',
    properties : {
        _id             : { type: 'string', nullable: true },
        s290            : { type: 'boolean' },
        registerCard    : { type: 'boolean' },
        firstName       : { type: 'string' },
        lastName        : { type: 'string' },
        birthday        : { type: 'string', nullable: true },
        gender          : { type: 'string' },
        baptised        : { type: 'string', nullable: true },
        baptisedUnknown : { type: 'boolean' },
        hope            : { type: 'string' },
        contactPerson   : { type: 'boolean' },
        contactId       : { type: 'string', nullable: true },
        addressId       : { type: 'string' },
        phone           : { type: 'string', nullable: true },
        cell            : { type: 'string', nullable: true },
        email           : { type: 'string', nullable: true },
        serviceGroupId  : { type: 'string' },
        status          : { type: 'string' },
        information     : { type: 'string', nullable: true },
        emergency       : Emergency,
        createdAt       : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
        updatedAt       : { type: 'object', format: 'custom-date-time', nullable: true, required: [] },
    },
    required: [
        's290',
        'registerCard',
        'firstName',
        'lastName',
        'gender',
        'baptisedUnknown',
        'hope',
        'contactPerson',
        'serviceGroupId',
        'status',
        'addressId',
    ],
    additionalProperties: false,
}
