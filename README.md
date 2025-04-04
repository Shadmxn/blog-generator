# Blog Generator

A full-stack blog generator tool that uses OpenAI to generate SEO-optimized blogs and DALL·E to generate header and inline images. It saves blogs locally and uploads them to an S3 bucket. Includes a frontend to view and test blog output.

---

## Features

- Automatically generate high-quality blog posts using OpenAI
- Generates custom header and inline images using DALL·E
- Uploads HTML and JSON files to AWS S3
- Cron job support for automated blog creation
- Frontend to test and view blog posts

---

## Prerequisites

- Node.js (v18+)
- NPM
- AWS S3 bucket (public-read enabled)
- OpenAI API Key

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:Shadmxn/blog-generator.git
cd blog-generator

```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` folder with the following content:

```
OPENAI_API_KEY=your-openai-api-key
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
```

### 3. Install Dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

---

## Running the Project

### Start the Backend

```bash
cd backend
npx nodemon server.js
```

This starts the backend server at:  
`http://localhost:5001`

### Start the Frontend

```bash
cd ../frontend
npm run dev
```

This starts the frontend at:  
`http://localhost:3000`

---

## Testing the Blog Generator

To manually generate a blog from the terminal:

```bash
curl -X POST http://localhost:5001/api/generate \
-H "Content-Type: application/json" \
-d '{"topic": "Top Tips for Budgeting Money", "reference": ""}'
```

---

## Auto-Posting with Cron

The backend includes a cron job that can auto-generate and post blogs on a schedule. For testing purposes, it's configured to run every 2 minutes. In production, update the schedule to post every Monday at 9 AM EST:

```js
cron.schedule("0 9 * * 1", async () => {
  // Cron job code
});
```

You can find this in `backend/server.js`.

---

## Viewing Blogs

Once generated, blogs are uploaded to S3. To view them locally:

- Visit: `http://localhost:3000/test-blogs`
- Click on any blog to preview it via its unique `/blogs/:slug` route

---

## Deployment

To move the blog generator to another repository or integrate with a production app:

- Clone your production app repo
- Create a `feature/blog-generator` branch
- Copy over relevant backend logic and connect it to your existing infrastructure
- Make sure your `.env` values match your deployment keys
