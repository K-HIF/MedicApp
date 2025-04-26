# MedicApp Frontend

The frontend of MedicApp is built with React and Vite, providing a modern and responsive user interface for healthcare management.

## Features

- **Dashboard**
  - Overview of key statistics
  - Recent patient activities
  - Program distribution charts

- **Patient Management Interface**
  - Patient registration form
  - Patient list with search and filter
  - Program assignment interface
  - Patient detail views

- **Doctor Management Interface**
  - Doctor registration and verification
  - Doctor list with status indicators
  - Program specialization management
  - Credential management

- **Program Management**
  - Program creation and editing
  - Patient assignment to programs
  - Program statistics

## Tech Stack

- React 18+
- Vite for build tooling
- Tailwind CSS for styling
- Headless UI for accessible components
- Axios for API communication
- React Router for navigation
- Context API for state management

## Development

### Prerequisites

- Node.js 14+ and npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

### Project Structure

```
src/
├── assets/        # Static assets
├── components/    # Reusable UI components
├── pages/         # Page components
│   ├── @Dashboard/  # Dashboard related pages
│   └── Auth/        # Authentication pages
├── utils/         # Utility functions and configs
├── App.jsx        # Main application component
└── main.jsx      # Application entry point
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Follow the project's coding style
2. Write meaningful commit messages
3. Update documentation as needed
4. Test your changes thoroughly

## Additional Information

For backend API documentation and full project setup, see the main README in the project root.
