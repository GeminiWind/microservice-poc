export default {
  $id: 'https://heligram.com/login-user+v1.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Token Schema V1',
  description: 'Token Schema',
  oneOf: [
    { $ref: '#/definitions/passwordGrantType' },
    { $ref: '#/definitions/refreshTokenGrantType' }
  ],
  required: ['data'],
  definitions: {
    passwordGrantType: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['tokens']
            },
            attributes: {
              type: 'object',
              properties: {
                grant_type: {
                  type: 'string',
                  enum: ['password']
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
                }
              },
              scopes: {
                oneOf: [
                  {
                    type: 'string'
                  },
                  {
                    type: 'array',
                    items: {
                      type: 'string'
                    }
                  }
                ]
              },
              required: ['grant_type', 'email', 'password']
            }
          },
          required: ['type', 'attributes']
        }
      }
    },
    refreshTokenGrantType: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['tokens']
            },
            attributes: {
              type: 'object',
              properties: {
                grant_type: {
                  type: 'string',
                  enum: ['refresh_token']
                },
                refresh_token: {
                  type: 'string',
                  description: 'Refresh Token'
                }
              },
              required: ['grant_type', 'refresh_token']
            }
          },
          required: ['type', 'attributes']
        }
      }
    }
  }
};
