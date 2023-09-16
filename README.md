Guest Registration App

This is a simple Guest Registration application built with Svelte that allows you to manage guest information including their first name, last name, and ID card number. You can create, read, update, and delete guest records in this app, and the data is stored temporarily in session storage.
Table of Contents

- Installation
- Usage
- Application Flow
- Screenshots
- Contributing
- License

Installation

1. Clone the repository:
   ```
       git clone https://github.com/your-username/svelte-guest-registration.git
       cd svelte-guest-registration
   ```
3. Install dependencies:
   ```
     npm install
   ```
5. Run the application:
   ```
     npm run dev
   ```

The app will be available at http://localhost:8080
Usage

- Use the application to register and manage guest information.
- Fill in the First Name, Last Name, and ID Card Number fields and click the "Register" button to add a guest.
- Click the "Edit" button next to a guest to update their information.
- Click the "Delete" button to remove a guest from the list.
- Toggle between the registration form and the guest list view.

Application Flow

The application flow consists of the following key components:

- Registration Form: Allows users to input guest information (First Name, Last Name, ID Card Number) and register a new guest.

- Guest List: Displays a list of registered guests, including their information.

- Edit Mode: Allows users to edit guest information by clicking the "Edit" button in the Guest List.

- Delete Operation: Removes a guest from the list when the "Delete" button is clicked.

- Local Storage: The guest data is temporarily stored in local storage, allowing it to persist during the local not cleanup.

Screenshots

Registration Form
![gambar](https://github.com/epiece/greatdayhrdeveloper/assets/7742211/d1bfa5e1-15bf-4a74-ade0-0a798d5ed46d)

Guest List
![gambar](https://github.com/epiece/greatdayhrdeveloper/assets/7742211/c883f946-049c-4007-a979-5a4b4bee9430)

Contributing

Contributions are welcome! Feel free to open issues and pull requests.

License

This project is licensed under the MIT License - see the LICENSE file for details.
License
