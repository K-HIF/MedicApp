# MedicApp

MedicApp is a comprehensive healthcare management system designed to streamline patient and doctor management. The system allows healthcare administrators to efficiently manage patient records, doctor registrations, and program assignments.
## Deployed site url

## Features

- **Patient Management**
  - Register and manage patient information
  - Track patient programs and categories
  - Update patient details and program assignments
  - Search and filter patient records

- **Doctor Management**
  - Register new doctors with automated credential management
  - Email-based verification system
  - Track doctor specializations and status
  - Manage doctor verification and activation

- **Program/Category Management**
  - Create and manage healthcare programs
  - Assign patients to multiple programs
  - Track program participation

- **Administrative Features**
  - Secure authentication system
  - Role-based access control
  - Dashboard with key statistics
  - Email notifications for important actions

## Technology Stack

### Backend
- Django REST Framework
- Python 3.x
- JWT Authentication
- PostgresQL Database

### Frontend
- React.js with Vite
- Tailwind CSS
- Headless UI Components
- Axios for API integration

## Installation

### Prerequisites
- Python 3.x
- Node.js and npm
- Git

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend_n_apis/MedicApp
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv myenv
   source myenv/bin/activate  # On Windows: myenv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the MedicApp directory with:
   ```
   SECRET_KEY=your_secret_key
   DEBUG=True
   AdminCreds=your_admin_credentials
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd Frontend/MAFrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

The backend provides RESTful APIs for:

### Authentication Endpoints
- POST `/backendapi/login/` - User login
- POST `/backendapi/register/` - User registration
- POST `/backendapi/register-doc/` - Doctor registration

### Patient Endpoints
- GET, POST `/backendapi/patient/` - List/Create patients
- GET `/backendapi/patient/<id>/` - Get patient details
- POST `/backendapi/patient/<id>/credentials/` - Update patient details

### Doctor Endpoints
- GET, POST `/backendapi/doctors/` - List/Create doctors
- POST `/backendapi/doctors/<id>/verify/` - Verify doctor account
- GET `/backendapi/doctors/stats/` - Get doctor statistics

### Program/Category Endpoints
- GET, POST `/backendapi/categories/` - List/Create categories
- PUT, DELETE `/backendapi/categories/<id>/` - Update/Delete category

## Security

- JWT-based authentication
- Password hashing
- Role-based access control
- Secure email notifications
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request


## Acknowledgments

- Created by FranFreezy
- Built with Django REST Framework and React
- UI components from Headless UI and Tailwind CSS
