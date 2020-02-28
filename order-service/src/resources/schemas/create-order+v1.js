export default {
  $id: 'https://api.microservice.com/create-order+v1.json',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Create A New Order',
  description: 'An Order is bla bla',
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Order Id to identify order',
        },
        type: {
          type: 'string',
          enum: ['orders'],
        },
        attributes: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    description: 'Product ID',
                  },
                  price: {
                    type: 'number',
                    description: 'Product price',
                  },
                  quantity: {
                    type: 'number',
                    description: 'Product quantity',
                  },
                  total: {
                    type: 'number',
                    description: 'Total price of product',
                  },
                },
              },
            },
            total: {
              type: 'number',
              description: 'Total price of order',
            },
            state: {
              type: 'string',
              enum: ['created', 'processing', 'processed'],
            },
            customer: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                phone: {
                  type: 'string',
                },
              },
            },
            shippingAddress: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                countryCode: {
                  type: 'string',
                },
                street: {
                  type: 'string',
                },
                city: {
                  type: 'string',
                },
                postcode: {
                  type: 'string',
                },
              },
            },
            billingAddress: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                },
                lastName: {
                  type: 'string',
                },
                countryCode: {
                  type: 'string',
                },
                street: {
                  type: 'string',
                },
                city: {
                  type: 'string',
                },
                postcode: {
                  type: 'string',
                },
              },
            },
            currencyCode: {
              type: 'string',
              description: 'Currency code',
            },
          },
          required: ['products', 'total', 'state', 'billingAddress', 'shippingAddress', 'currencyCode', 'customer'],
        },
      },
      required: ['type', 'attributes'],
    },
  },
  required: ['data'],
};
