# QuickStart Guide for JivIT Solutions

This guide will help you set up and run the **JivIT Solutions** project locally.

## 🚀 Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: v18 or higher (LTS recommended)
- **npm** (comes with Node.js)
- **Git** (for version control)

## 🛠️ Installation

1.  **Clone the Repository** (if not already done):
    ```bash
    git clone <repository-url>
    cd jivit-solutions
    ```

2.  **Install Dependencies**:
    Run the following command in the project root to install all required packages:
    ```bash
    npm install
    ```

## ⚙️ Environment Setup

This project uses **Supabase** as its backend. You need to configure the environment variables to connect to your Supabase project.

1.  Create a `.env` file in the root directory.
2.  Add the following variables (replace with your actual Supabase credentials):

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

    > **Note**: You can find these keys in your Supabase project settings under **Project Settings > API**.

## 🗄️ Database Setup

To set up the database schema and tables:

1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Go to the **SQL Editor**.
3.  Open the `MASTER_DATABASE_SYNC.sql` file located in the root directory of this project.
4.  Copy the contents and run the script in the Supabase SQL Editor.
    *   This script will create all necessary tables (services, blogs, contacts, etc.) and apply initial configurations.

## ▶️ Running the Application

To start the development server:

```bash
npm run dev
```

- The application will be available at `http://localhost:5173` (or the port shown in your terminal).
- Open this URL in your browser to view the app.

## 📦 Building for Production

To create a production build:

```bash
npm run build
```

- The build artifacts will be stored in the `dist/` directory.
- You can preview the production build locally using:
    ```bash
    npm run preview
    ```

## 📂 Project Structure

- `src/pages`: Main application pages (Home, products, etc.).
- `src/components`: Reusable UI components.
- `src/lib`: Helper functions and Supabase client configuration.
- `src/assets`: Images and static assets.
- `src/index.css`: Global styles and theme variables.

---

**Happy Coding! 🚀**
