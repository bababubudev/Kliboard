# Kliboard

Kliboard is a simple text-saving application that allows users to create and manage text spaces with a specified duration for automatic removal. The application is built using Vite, React, and TypeScript for the frontend, while the backend utilizes Express.js and MongoDB for data storage. Visit this website [here](https://bababubudev.github.io/Kliboard/)

---
![image](https://github.com/bababubudev/Kliboard/assets/51091892/3c9be8af-6c0d-402d-8bee-86dcaec9e466)
***

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Project Structure](#project-structure)
* [Backend](#backend-1)
  * [Routes](#routes)
  * [Models](#models)
  * [Rate Limiting](#rate-limiting)
* [Frontend](#frontend)
  * [Presentation](#presentation)
* [Environment Variables](#environment-variables)
* [Contributing](#contributing)
* [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bababubudev/kliboard.git

2. Navigate to the project directory:
   ```bash
   cd kliboard
   ```
3. For **BACKEND**:
     ```bash
     cd ./backend
     npm i
     ```
    * Create a `.env` file in the root directory and set the required environment variables (see [Environment Variables](#environment-variables))
    * Start the application
       ```bash
       npm start
       ```
       The application will be accessible at `http://localhost:5001`
  4. For **FRONTEND**:
      ```bash
      cd ./frontend
      npm i
      ```
      * Create a `.env.development` file inside ./frontend/ folder and set the required environment variables (see [Environment Variables](#environment-variables))
      * Start the application
         ```bash
         NODE_ENV=development npm start
         ```
       The application will be accessible at `http://localhost:5173`

## Usage

### **BACKEND**
  1. Access the home page at `http://localhost:5001` to view the latest saved space names.
  2. Use the `/inbox/:name` route to view or create a space. If the space does not exist, a message will guide you to press the "➤" button to save the space.
  3. Use the `/inbox route` with a POST request to create a new space. Provide the `space_name`, `space_text`, and `removal duration` in the request body.
  4. Use the `/inbox/:name` route with a PATCH request to update an existing space. Provide the updated information in the request body.

## Project Structure

The project is structured as follows:

* `frontend/` - Frontend source code
  * `./src` - All components and pages
* `backend/` - Backend source code
  * `./routes/` - Express.js route definitions
  * `./models/` - MongoDB data models
  * `./controllers/` - Express.js controllers definitions
  * `server.js` - Main server file
* `README.md` - Project documentation

# Backend

Simple but robust endpoints serving for frontend.

## Routes

* **HTTP GET** `/` 
  * Returns the names of the latest saved spaces
  * Response: Array of space names or an error message.
* **HTTP GET** `/inbox/:name`
  * Returns information about a specific space by its name.
  * Response: Space details or a message to guide space creation.
* **HTTP POST** `/inbox`
  * Creates a new space with the provided information.
  * Request body:
     ```json
     {
      "space_name": "example_space",
      "space_text": "This is an example space.",
      "removal": 10
     }
     ```
  * Allowed removal integers: <0, 1, 10, 24, 240>
  * Response: Created space details or an error message.
* **HTTP PATCH** `/inbox/:name`
  * Updates an existing space with the provided information.
  * Request Body:
    ```json
    {
      "space_text": "Updated space text",
      "removal": 24
    }
    ```
  * Response: Updated space details or an error message.

## Models

The MongoDB data model defines the structure of the saved spaces:

* `space_name` (String): Name of the space.
* `space_text` (String): Text content of the space.
* `removal` (Number): Duration for automatic removal (in hours).
* `expireAt` (Date): Timestamp indicating when the space will be automatically removed.

## Rate Limiting

The application includes a simple rate-limiting mechanism to control the number of requests per IP address.

* Max requests per IP: 10 per day
* Duration: 24 hours

# Frontend

The frontend of Kliboard is built using React with TypeScript and relies on the `react-router-dom` library for routing. The application consists of two main pages: `Home` and `Inbox`, along with various components.

## Presentation

### 1. Navbar

The `Navbar` component is a simple navigation bar that is included in the `App` component. It provides links to navigate to the `Home` page from other pages as well as to change device theme from dark to light and vice versa.

![image](https://github.com/bababubudev/Kliboard/assets/51091892/4b9765f2-e5ad-4e5e-85fe-caa0e5efe814)

![image](https://github.com/bababubudev/Kliboard/assets/51091892/fd8e8bbf-62c5-481c-8f96-1d0732eaa253)

### 2. Home

The `Home` page component allows user to enter or view existing space names. It displays the name of the latest saved spaces and provides a form for creating or navigating to a space. Form displays few validation prompts

![image](https://github.com/bababubudev/Kliboard/assets/51091892/6fee3daa-c2b9-46fe-9ebf-b9f350f409de)
![image](https://github.com/bababubudev/Kliboard/assets/51091892/fb6f4a55-2393-4c14-bf07-5119f65f664a)
![image](https://github.com/bababubudev/Kliboard/assets/51091892/8284da7e-ab52-4597-9d73-36219f6ed7e4)

### 3. Inbox

The Inbox page displays the details of a space, either saved or unsaved, and allows users to update the space's content and removal duration. User can refresh and get a clickable link from the text. 

![image](https://github.com/bababubudev/Kliboard/assets/51091892/3d5ee6b3-717a-415e-b649-475db2f30caa)

![image](https://github.com/bababubudev/Kliboard/assets/51091892/48557ce5-8586-4729-990d-83dfe239f20a)

---
## Environment Variables

### **BACKEND**:

  * `DBURI`: MongoDB connection URI
  * `PORT`: Port for the server to listen on
  
### **FRONTEND**:
  * Add this code inside `.env.development` file:

    ```bash
      VITE_REACT_APP_DEBUG=true
      VITE_REACT_APP_API_BASE_URL=http://localhost:5000
    ```

## Contributing

Feel free to contribute by opening issues or pull requests. Ensure to follow the code of conduct.

## License

This project is licensed under the MIT License.
