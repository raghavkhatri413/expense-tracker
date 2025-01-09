# Expense Tracker using React.js and Firebase

## Overview

The **Expense Tracker** is a comprehensive financial management tool built with React.js and Firebase. It revolutionizes how users manage their finances by offering a seamless, feature-rich experience. With this app, users can securely track income, expenses, and maintain financial records with ease.

## Features

### 1. Streamlined Authentication
- Secure sign-up and log-in functionality using email.
- Password reset via email for easy account recovery.

### 2. Effortless Expense Tracking
- Add, edit, and delete income and expense entries effortlessly.
- Securely store financial data in the Firebase database for persistent records.

### 3. At-a-Glance Overview
- Dashboard displays key financial metrics:
  - Current Balance
  - Total Income
  - Total Expenses

### 4. Transaction Transparency
- View recent transactions on the main page with details like date, description, amount, and type.
- Access a full list of transactions in a detailed table view.
- Export transaction history to PDF for easy record-keeping.

## Project Demo
- [Live Demo](https://your-expense-tracker-url.com) *(Replace with the actual deployed link)*

## Technologies Used

- **React.js**: Front-end framework for building dynamic and responsive user interfaces.
- **Firebase**: Backend as a Service (BaaS) for database, authentication, and hosting.
- **CSS**: For styling and responsive design.
- **React-PDF**: For exporting transaction history as PDFs.

## Screenshots

1. **Authentication Page:**
   ![Authentication Page](https://i.postimg.cc/KcP242ZW/Screenshot-2025-01-09-202549.png)

2. **Dashboard Overview:**
   ![Dashboard Overview](https://i.postimg.cc/vHGdVNTZ/Screenshot-2025-01-09-202616.png)

3. **Transaction Table:**
   ![Transaction Table](https://i.postimg.cc/zXpYSFHS/Screenshot-2025-01-09-202655.png)

## Installation

### Prerequisites
- Node.js and npm installed on your system.

### Steps to Run Locally

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   ```

2. **Navigate to the Project Directory:**
   ```bash
   cd expense-tracker
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Set Up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password).
   - Create a Firestore Database.
   - Obtain your Firebase configuration object and replace the placeholders in the `firebaseConfig.js` file.

5. **Start the Development Server:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000/`.

## Usage

1. Sign up or log in to access your account.
2. Add income and expense entries with descriptions and amounts.
3. View an overview of your financial health on the dashboard.
4. Export your transaction history to PDF for offline record-keeping.

## Deployment

1. **Build the Project:**
   ```bash
   npm run build
   ```
2. **Deploy to Firebase Hosting:**
   - Install Firebase CLI:
     ```bash
     npm install -g firebase-tools
     ```
   - Log in to Firebase:
     ```bash
     firebase login
     ```
   - Initialize Firebase Hosting:
     ```bash
     firebase init hosting
     ```
   - Deploy:
     ```bash
     firebase deploy
     ```


## Lessons Learned

Through building this project, I gained:
- A deeper understanding of React.js for front-end development.
- Hands-on experience with Firebase for authentication and database management.
- Improved skills in integrating third-party libraries like React-PDF.

## Contributing

Contributions are welcome! If you have ideas for improving the Expense Tracker, feel free to:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.



## Acknowledgments

- Thanks to Firebase for providing powerful tools for authentication and database management.
- Special thanks to the React.js community for their extensive documentation and support.
