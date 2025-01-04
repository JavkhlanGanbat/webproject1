import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './server/config/config.js';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Books API Documentation',
            version: '1.0.0',
            description: 'RESTful API for managing books in an online bookstore',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server'
            }
        ],
        tags: [
            {
                name: 'Books',
                description: 'API endpoints for book operations'
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
                            description: 'The auto-generated id of the book'
                        },
                        title: {
                            type: 'string',
                            description: 'The title of the book'
                        },
                        author: {
                            type: 'string',
                            description: 'The author of the book'
                        },
                        price: {
                            type: 'number',
                            format: 'float',
                            description: 'The price of the book'
                        },
                        category: {
                            type: 'string',
                            description: 'The category/genre of the book'
                        },
                        isbn: {
                            type: 'string',
                            description: 'ISBN of the book'
                        },
                        publish_date: {
                            type: 'string',
                            format: 'date',
                            description: 'Publication date of the book'
                        },
                        publisher: {
                            type: 'string',
                            description: 'Publisher of the book'
                        },
                        language: {
                            type: 'string',
                            description: 'Language of the book'
                        },
                        pages: {
                            type: 'integer',
                            description: 'Number of pages in the book'
                        },
                        format: {
                            type: 'string',
                            description: 'Format of the book (e.g., Hardcover, Paperback)'
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the book'
                        },
                        cover_image: {
                            type: 'string',
                            description: 'URL to the book cover image'
                        },
                        rating: {
                            type: 'number',
                            format: 'float',
                            description: 'Average rating of the book'
                        },
                        reviews: {
                            type: 'integer',
                            description: 'Number of reviews'
                        },
                        in_stock: {
                            type: 'boolean',
                            description: 'Whether the book is in stock'
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
                        description: 'The Great Gatsby is a novel by F. Scott Fitzgerald...',
                        cover_image: 'https://example.com/images/great-gatsby.jpg',
                        rating: 4.5,
                        reviews: 2584,
                        in_stock: true
                    }
                },
                BookUpdate: {
                    type: 'object',
                    required: ['title', 'author', 'price'],
                    properties: {
                        title: {
                            type: 'string',
                            description: 'The title of the book'
                        },
                        author: {
                            type: 'string',
                            description: 'The author of the book'
                        },
                        price: {
                            type: 'number',
                            format: 'float',
                            description: 'The price of the book'
                        },
                        category: {
                            type: 'string',
                            enum: ['fiction', 'non-fiction', 'science', 'technology'],
                            description: 'The category/genre of the book'
                        },
                        isbn: {
                            type: 'string',
                            description: 'ISBN of the book'
                        },
                        publish_date: {
                            type: 'string',
                            format: 'date',
                            description: 'Publication date of the book'
                        },
                        publisher: {
                            type: 'string',
                            description: 'Publisher of the book'
                        },
                        language: {
                            type: 'string',
                            description: 'Language of the book'
                        },
                        pages: {
                            type: 'integer',
                            description: 'Number of pages in the book'
                        },
                        format: {
                            type: 'string',
                            enum: ['hardcover', 'paperback', 'ebook', 'audiobook'],
                            description: 'Format of the book'
                        },
                        description: {
                            type: 'string',
                            description: 'Description of the book'
                        },
                        cover_image: {
                            type: 'string',
                            format: 'uri',
                            description: 'URL to the book cover image'
                        },
                        rating: {
                            type: 'number',
                            format: 'float',
                            minimum: 0,
                            maximum: 5,
                            description: 'Average rating of the book'
                        },
                        reviews: {
                            type: 'integer',
                            minimum: 0,
                            description: 'Number of reviews'
                        },
                        in_stock: {
                            type: 'boolean',
                            description: 'Whether the book is in stock'
                        }
                    },
                    example: {
                        title: "Updated Book Title",
                        author: "Updated Author Name",
                        price: 19.99,
                        category: "fiction",
                        isbn: "978-1234567890",
                        publish_date: "2023-01-01",
                        publisher: "Updated Publisher",
                        language: "English",
                        pages: 300,
                        format: "hardcover",
                        description: "Updated book description",
                        cover_image: "https://example.com/updated-cover.jpg",
                        rating: 4.5,
                        reviews: 100,
                        in_stock: true
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error message'
                        }
                    }
                }
            },
            responses: {
                NotFound: {
                    description: 'The specified resource was not found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                Updated: {
                    description: 'The resource was updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Book'
                            }
                        }
                    }
                }
            }
        }
    },
    apis: ['./server/routes/*.js', './server/controllers/*.js']
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Custom options for Swagger UI
export const swaggerUiOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Books API Documentation",
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

export { swaggerUi };