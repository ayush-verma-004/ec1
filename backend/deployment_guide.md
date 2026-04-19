# 🚀 Render Deployment Guide (Spring Boot + Docker)

Since you don't have Docker installed locally, we've set up a **containerized environment** that Render will build automatically from your GitHub repository.

## 1. Prepare your GitHub Repository

1.  **Commit and Push**: Ensure all changes (Dockerfile, .dockerignore, and updated application.properties) are pushed to your GitHub repository.
2.  **Verify Structure**: Your repository root should contain the `backend` folder (or be the `backend` folder itself).

## 2. Create a Web Service on Render

1.  Go to the [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository.
4.  **Configuration Settings**:
    *   **Name**: `econe-backend` (or any name you like).
    *   **Language**: Select **Docker**.
    *   **Region**: Pick the one closest to your users.
    *   **Branch**: `main` (or your preferred branch).
    *   **Root Directory**: `backend` (If your Dockerfile is inside the `backend` folder). 
    *   **Instance Type**: Select **Free**.

## 3. Set Up Environment Variables

Render needs the same environment variables you have in your local `.env` file.

1.  In the Render "Web Service" creation screen (or under the **Environment** tab later), click **Add Environment Variable**.
2.  Add the following keys and copy the values from your local `.env`:
    *   `MONGO_URI`
    *   `JWT_SECRET`
    *   `MAIL_USERNAME`
    *   `MAIL_PASSWORD`
    *   `MAIL_FROM`
    *   `SPRING_DATA_MONGODB_URI` (Set this to the same value as `MONGO_URI`)

## 4. Deploy!

1.  Click **Create Web Service**.
2.  Render will start the **Build** process. You can watch the logs.
3.  Once the build is "Live", your API will be available at `https://your-app-name.onrender.com`.

---

### ⚠️ Important Notes for Free Tier

*   **Spin-down**: The app goes to sleep after 15 minutes of inactivity. The first request after a long break will be slow while the app "wakes up".
*   **Memory**: This setup is optimized to run under **512MB RAM**. If you see "Out of Memory" errors in the logs, you might need to upgrade to a paid tier or optimize the app further.
*   **CORS**: Ensure your frontend (if deployed separately) is allowed to call the Render URL.
