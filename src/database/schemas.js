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

const Address = {
    type       : 'object',
    properties : {
        address1 : { type: 'string' },
        address2 : { type: 'string', nullable: true },
        zip      : { type: 'string' },
        city     : { type: 'string' },
    },
    required: [ 'address1', 'zip', 'city' ],
}

const Phone = {
    type       : 'object',
    properties : {
        country            : { type: 'string', nullable: true },
        countryCallingCode : { type: 'string', nullable: true },
        countryCode        : { type: 'string', nullable: true },
        formatted          : { type: 'string', nullable: true },
        nationalNumber     : { type: 'string', nullable: true },
        number             : { type: 'string', nullable: true },
        type               : { type: 'string', nullable: true },
        valid              : { type: 'boolean', nullable: true },
    },
    required: [],
}

const Emergency = {
    type       : 'object',
    properties : {
        name  : { type: 'string', nullable: true },
        phone : { type: 'object', properties: { Phone }, nullable: true },
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

const SelectOption = {
    type       : 'object',
    properties : {
        value : { type: 'string' },
        name  : { type: 'string' },
    },
    required: [ 'value', 'name' ],
}

export const Appointment = {
    type       : 'object',
    properties : {
        type : { type: 'object', properties: { SelectOption } },
        date : { type: 'string', nullable: true },
    },
    required: [ 'type' ],
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
        contact         : { type: 'object', properties: { SelectOption }, nullable: true },
        address         : Address,
        phone           : { type: 'object', properties: { Phone }, nullable: true },
        cell            : { type: 'object', properties: { Phone }, nullable: true },
        email           : { type: 'string', nullable: true },
        serviceGroup    : { type: 'object', properties: { SelectOption }, nullable: true },
        status          : { type: 'object', properties: { SelectOption }, nullable: false },
        information     : { type: 'string', nullable: true },
        emergency       : Emergency,
        children        : { type: 'array', items: Child },
        appointments    : { type: 'array', items: Appointment },
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
        'status',
    ],
    additionalProperties: false,
}
