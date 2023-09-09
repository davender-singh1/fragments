# fragments

Lab 1
This is a lab with various utility scripts for development and debugging.

Prerequisites
Ensure you have Node.js and npm (which comes with Node) installed.

Installation
To install all project dependencies:

npm install

Below are the instructions for the various scripts that have been set up in this project:

Lint
To check for linting errors, run:

npm run lint
This will run the linter across all JS files in the project and flag any styling or syntax issues.

Start
To start the server in production mode:

npm start
This will run the server using Node, and it will be accessible at http://localhost:8080/.

Dev
For development purposes, use:

npm run dev
This uses nodemon to automatically restart the server whenever files are changed, making development faster and more efficient.

Debug
To start the server in debug mode, use:

npm run debug
With this command, the server will start in debug mode, allowing you to set breakpoints, inspect variables, and more in tools like Visual Studio Code.

Debugging with Visual Studio Code
To debug the server using VS Code:

Set a breakpoint in your code by clicking to the left of a line number in the VS Code editor.
Start the server in debug mode with npm run debug.
In VS Code, go to the Run and Debug sidebar (it looks like a play button inside a bug). Press the green play button at the top.
Access the server (e.g., by navigating to http://localhost:8080/ in a browser). Execution will pause at any breakpoints you've set, and you can inspect the current state in VS Code.
Remember
Always check for linting errors before committing.
Use the development mode when working on changes to automatically reload the server.
Debugging is your friend! When in doubt, set a breakpoint and inspect what's happening.
