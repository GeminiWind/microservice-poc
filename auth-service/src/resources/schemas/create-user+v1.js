export default {
  $id: 'https://heligram.com/create-user+v1.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Create User',
  description: 'A user is to present a person consuming our app',
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['users']
        },
        attributes: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              description: 'User email',
              format: 'email'
            },
            password: {
              type: 'string',
              description: 'User password',
              minLength: 6
            },
            first_name: {
              type: 'string',
              description: 'First name'
            },
            last_name: {
              type: 'string',
              description: 'Last name'
            },
            attributes: {
              type: 'object',
              patternProperties: {
                '^.*$': {
                  anyOf: [
                    { type: 'string' },
                    { type: 'integer' },
                    { type: 'boolean' },
                    { type: 'null' }
                  ]
                }
              },
              additionalProperties: false
            }
          },
          required: ['email', 'password', 'username']
        }
      },
      required: ['type', 'attributes']
    }
  },
  required: ['data']
};
