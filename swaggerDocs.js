/**
 * Swagger баримтжуулалтын тохиргоо
 * - API-н ерөнхий мэдээлэл
 * - Серверийн тохиргоо
 * - Өгөгдлийн загварууд (Book, Error)
 * - UI тохиргоо
 */

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger-н үндсэн тохиргоо
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API баримт',
            version: '1.0.0',
            description: 'Онлайн номын дэлгүүрийн номын удирдлагын RESTful API',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Хөгжүүлэлтийн сервер'
            }
        ],
        components: {
            schemas: {
                Book: {
                    type: 'object',
                    required: ['title', 'author', 'price'],
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Номын автоматаар үүсгэгдсэн ID'
                        },
                        title: {
                            type: 'string',
                            description: 'Номын гарчиг'
                        },
                        author: {
                            type: 'string',
                            description: 'Номын зохиолч'
                        },
                        price: {
                            type: 'number',
                            format: 'float',
                            description: 'Номын үнэ'
                        },
                        category: {
                            type: 'string',
                            description: 'Номын ангилал/төрөл'
                        },
                        isbn: {
                            type: 'string',
                            description: 'Номын ISBN'
                        },
                        publish_date: {
                            type: 'string',
                            format: 'date',
                            description: 'Номын хэвлэгдсэн огноо'
                        },
                        publisher: {
                            type: 'string',
                            description: 'Номын хэвлэлийн газар'
                        },
                        language: {
                            type: 'string',
                            description: 'Номын хэл'
                        },
                        pages: {
                            type: 'integer',
                            description: 'Номын хуудасны тоо'
                        },
                        format: {
                            type: 'string',
                            description: 'Номын формат (жишээ нь, Хатуу хавтастай, Зөөлөн хавтастай)'
                        },
                        description: {
                            type: 'string',
                            description: 'Номын тайлбар'
                        },
                        cover_image: {
                            type: 'string',
                            description: 'Номын хавтасны зургийн URL'
                        },
                        rating: {
                            type: 'number',
                            format: 'float',
                            description: 'Номын дундаж үнэлгээ'
                        },
                        reviews: {
                            type: 'integer',
                            description: 'Үнэлгээний тоо'
                        },
                        in_stock: {
                            type: 'boolean',
                            description: 'Номын нөөцөд байгаа эсэх'
                        }
                    },
                    example: {
                        id: 1,
                        title: 'The Great Gatsby',
                        author: 'F. Scott Fitzgerald',
                        price: 9.99,
                        category: 'fiction',
                        isbn: '978-0743273565',
                        publish_date: '2004-09-30',
                        publisher: 'Scribner',
                        language: 'English',
                        pages: 180,
                        format: 'Paperback',
                        description: 'The Great Gatsby, F. Scott Fitzgeralds third book',
                        cover_image: 'https://example.com/images/great-gatsby.jpg',
                        rating: 4.5,
                        reviews: 2584,
                        in_stock: true
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Алдааны мессеж'
                        }
                    },
                    example: {
                        error: 'Нөөц олдсонгүй'
                    }
                }
            },
            responses: {
                NotFound: {
                    description: 'Тодорхойлсон нөөц олдсонгүй',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            },
                            example: {
                                error: 'Нөөц олдсонгүй'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./server/routes/*.js', './server/controllers/*.js']
};

// Swagger UI-н нэмэлт тохиргоо
export const swaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Номын API баримт бичиг",
    customfavIcon: "/favicon.ico",
    swaggerOptions: {
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showCommonExtensions: true,
        syntaxHighlight: {
            activate: true,
            theme: "monokai"
        },
        tryItOutEnabled: true,
        persistAuthorization: true
    }
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);
export { swaggerUi };