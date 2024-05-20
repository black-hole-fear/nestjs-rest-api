Here is a comprehensive `README.md` file for your NestJS project, including descriptions of all files, setup instructions, and Docker commands:

```markdown
# NestJS Backend API


# To get started this project
sudo docker compose up
pnpm start

## Project Description

This project is a RESTful API built with NestJS. It includes user management, authentication, and integration with RabbitMQ for messaging.

## Project Structure

```
.
├── src
│   ├── app.module.ts             # Root module of the application
│   ├── main.ts                   # Entry point of the application
│   ├── users
│   │   ├── users.controller.ts   # Controller for user-related routes
│   │   ├── users.service.ts      # Service for user-related business logic
│   │   ├── users.module.ts       # Module for user-related components
│   │   ├── dto                   # Data Transfer Objects for users
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   ├── schemas
│   │   ├── user.schema.ts        # Mongoose schema for User model
│   ├── rabbitmq
│   │   ├── rabbitmq.module.ts    # Module for RabbitMQ integration
│   │   ├── rabbitmq.service.ts   # Service for RabbitMQ messaging logic
│   ├── config
│   │   └── configuration.ts      # Configuration settings
├── test
│   ├── app.e2e-spec.ts           # End-to-end test for the application
│   ├── jest-e2e.json             # Jest configuration for e2e tests
├── .dockerignore                 # Files and directories to ignore in Docker build
├── Dockerfile                    # Dockerfile for building the application image
├── docker-compose.yml            # Docker Compose configuration
├── jest.config.js                # Jest configuration for unit tests
├── package.json                  # Project dependencies and scripts
└── tsconfig.json                 # TypeScript configuration
```

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Docker
- Docker Compose

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    cd your-repo-name
    ```

2. **Install dependencies**:
    ```bash
    npm install pnpm
    pnpm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root of your project and add the following:
    ```env
    MONGO_URI=mongodb://localhost:27017/nest
    RABBITMQ_URI=amqp://localhost:5672
    ```

## Running the Application

### Using Docker

1. **Build and start the containers**:
    ```bash
    sudo docker-compose up --build
    ```

2. **Access the application**:
    The API will be available at `http://localhost:3000`.

### Without Docker

1. **Start MongoDB and RabbitMQ**:
    Ensure MongoDB and RabbitMQ are running on your local machine.

2. **Start the application**:
    ```bash
    npm run start:dev
    ```

3. **Access the application**:
    The API will be available at `http://localhost:3000`.

## Running Tests

### Unit Tests

Run the unit tests using Jest:
```bash
pnpm test
```

### End-to-End Tests

Run the end-to-end tests:
```bash
pnpm test:e2e
```

## Docker Commands

- **Build and start containers**:
    ```bash
    sudo docker-compose up --build
    ```

- **Stop containers**:
    ```bash
    sudo docker-compose down
    ```

- **View logs**:
    ```bash
    sudo docker-compose logs
    ```

- **Rebuild containers**:
    ```bash
    sudo docker-compose up --build --force-recreate
    ```

## Additional Information

- **NestJS Documentation**: [https://docs.nestjs.com](https://docs.nestjs.com)
- **Docker Documentation**: [https://docs.docker.com](https://docs.docker.com)
- **Jest Documentation**: [https://jestjs.io/docs/en/getting-started](https://jestjs.io/docs/en/getting-started)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

This `README.md` provides an overview of your project structure, installation steps, instructions for running the application with and without Docker, testing commands, and Docker-specific commands for managing containers.