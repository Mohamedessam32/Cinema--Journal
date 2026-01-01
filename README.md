# Steps to Install the Webapp and Run it

### Overview

This guide explains how to download the project from GitHub and run it locally.

### 1) Clone the repository

1. Copy the repository link from GitHub:
    - [Repository link](https://github.com/Mohamedessam32/Cinema--Journal)
2. Create (or open) a folder where you want to store the project.
3. Click the folder path/address bar in File Explorer.
4. Delete the current path and type `CMD`, then press **Enter**.

### 2) Run the required commands

In the Command Prompt window, run the following commands in order:

1. Clone the repository:
    - `git clone <repo-link>`
2. Move into the project folder:
    - `cd Cinema—Journal`
3. Open the project in VS Code:
    - `code .`

### 3) Install dependencies and start the app

In **VS Code** (Terminal), run:

1. Install dependencies:
    - `npm.cmd i`
2. Build the project:
    - `npm.cmd run build`
3. Start the preview server:
    - `npm.cmd run preview`

> If you are not using PowerShell, remove `.cmd` from the commands (for example, use `npm i` instead of `npm.cmd i`).
> 

### 4) Open the website

After the preview server starts, hold **CTRL** and click the [**localhost**](http://localhost) link shown in the terminal to open the web app in your browser (for example: [`http://localhost:4173/`](http://localhost:4173/)).
