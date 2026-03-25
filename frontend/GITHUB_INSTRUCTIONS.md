# How to Push Your Project to GitHub

Since the GitHub CLI (`gh`) is not installed on your system, you'll need to create the repository manually on GitHub's website and then connect it to your local project.

## Step 1: Create a Repository on GitHub

1.  Log in to your GitHub account.
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  Name the repository (e.g., `corehead-frontend`).
4.  **Important:** Do **NOT** initialize the repository with a README, .gitignore, or License (since you already have these locally).
5.  Click **Create repository**.

## Step 2: Connect and Push

Once the repository is created, you will see a "Quick setup" page. Copy the URL (it looks like `https://github.com/YOUR_USERNAME/corehead-frontend.git`).

Run the following commands in your terminal (I've prepared them for you, just fill in your username):

```bash
# 1. Add the remote link (replace URL with your actual repo URL)
git remote add origin https://github.com/YOUR-USERNAME/corehead-frontend.git

# 2. Rename the branch to main (if not already)
git branch -M main

# 3. Push your code
git push -u origin main
```

## Step 3: Verify

Refresh your GitHub repository page. You should see your code and the `README.md` listed there.
