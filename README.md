# Compass

This project is a web application that functions similarly to Notion. It allows users to create and manage notes, link between notes, and use predefined templates. The app uses Next.js for the frontend, TailwindCSS for styling, and TypeScript for type safety. User authentication is supported via GitHub, Discord, and Google login. Data is stored in a PostgreSQL database, managed with Prisma.

## Table of Contents

- [Compass](#class-compass)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Running the Application](#running-the-application)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- Create and manage notes
- Link between notes
- Use predefined templates
- User authentication via GitHub, Discord, and Google

## Tech Stack

- **Frontend**: Next.js, TailwindCSS, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL, Prisma
- **Authentication**: GitHub, Discord, Google

## Installation

### Prerequisites

- Node.js
- PostgreSQL
- GitHub, Discord, and Google OAuth credentials

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/asterki/Compass.git
    cd Compass
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the PostgreSQL database and Prisma:

    ```bash
    npm run prisma:migrate
    ```

4. Configure environment variables:

    Create a `.env` file in the root of the project, you can use the `.env.example` file for reference

### Running the Application

1. Start the development server:

    ```bash
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

- Sign up or log in using GitHub, Discord, or Google.
- Create new notes and link them to other notes.
- Use predefined templates to quickly start new notes.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
