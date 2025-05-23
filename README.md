## Sunglasses.io Server - Express API

A simple RESTful API built with [Express.js](https://expressjs.com/).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone https://github.com/tomwinskell/sunglasses-io.git
cd sunglasses-io
npm install
```

Rename .env.example to .env and change JWT string to secret string.

### Running the Server

```bash
npm run start
```

### Running the Tests

```bash
npm run test
```

### Project Structure

```
.
├── ai/
├── app/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── data/
│   ├── server.js
│   └── authMiddleware.js
├── test/
│   ├── setup.js/
│   ├── brands.test.js/
│   ├── cart.test.js/
│   └── login.test.js
├── .env.example
├── swagger.yaml
└── README.md
```

### API Endpoints

API documentation is provided using Swagger Express. Defined in `swagger.yaml`.
To view API documentation `npm run start` then navigate to `http://localhost:3000/api-docs`.

### Authentication

This API uses JWT-based authentication. Include the token in the Authorization header:
Authorization: Bearer <token>

### AI Analysis

An analysis of the codebase was conducted with Claude using the prompt at `ai/prompt.md`.
Claude provided `analysis.md` and `fixes.md` for review.
