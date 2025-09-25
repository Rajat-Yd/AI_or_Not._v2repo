# AI_or_Not._v2repo

## Description
This is a Next.js application, primarily written in TypeScript, that integrates AI capabilities using Genkit with Google AI. It serves as a robust platform leveraging a comprehensive set of UI components from Radix UI, styled efficiently with Tailwind CSS. The project also incorporates functionalities for PDF parsing, document processing (Mammoth), and converting HTML content to images (html2canvas).

## Features
*   **AI Integration**: Powered by Genkit and Google AI for intelligent functionalities.
*   **Modern Web UI**: Built with Next.js and React, offering a highly responsive and interactive user experience.
*   **Extensive UI Components**: Utilizes Radix UI for accessible and customizable UI components, enhanced with Tailwind CSS for styling.
*   **Form Management**: Robust form handling with React Hook Form and Zod for schema validation.
*   **Document Processing**: Capabilities for parsing PDFs, converting HTML to images, and processing `.docx` files.
*   **State Management**: Efficient state management within the React ecosystem.
*   **Data Visualization**: Includes Recharts for dynamic and interactive data representation.
*   **Firebase Integration**: Potential for backend services, authentication, or database solutions.

## Installation
To get this project up and running on your local machine, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/AI_or_Not._v2repo.git
    cd AI_or_Not._v2repo
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or yarn install
    ```

3.  **Apply patches (if any)**:
    This project uses `patch-package`. After installing dependencies, run:
    ```bash
    npx patch-package
    ```

4.  **Environment Variables**:
    Create a `.env` file in the root directory and add necessary environment variables, such as API keys for Genkit/Google AI. Refer to `.env.example` if available.

## Usage
Once the project is set up, you can run the application and its AI backend:

1.  **Start the Next.js development server**:
    This will run the frontend application on `http://localhost:9002`.
    ```bash
    npm run dev
    # or yarn dev
    ```

2.  **Start the Genkit AI backend (in a separate terminal)**:
    This will start the Genkit development server, allowing the frontend to interact with AI services.
    ```bash
    npm run genkit:dev
    # or yarn genkit:dev
    ```

After both services are running, open your web browser and navigate to `http://localhost:9002` to access the application.

## Tech Stack
*   **Frontend**: Next.js, React, TypeScript
*   **Styling**: Tailwind CSS, Radix UI (headless components), `class-variance-authority`
*   **AI Backend**: Genkit, Google AI
*   **Form Management**: React Hook Form, Zod
*   **Utilities**: `clsx`, `date-fns`, `lucide-react`, `embla-carousel-react`
*   **Document Handling**: `pdf-parse`, `jspdf`, `html2canvas`, `mammoth`
*   **Database/Auth**: Firebase (as a dependency, specific usage details may vary)
*   **Development Tools**: PostCSS, TypeScript, `genkit-cli`

## Contributing
We welcome contributions to improve this project! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Make your changes and commit them (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
