# Credit Card Application System

Assignment: Credit Card Application System

## Setup

1. Install everything:
```bash
npm install
```

2. Run it:
```bash
npm run dev
```

3. Open browser and go to: http://localhost:3000

## How It Works

The app has 5 steps:
1. Welcome page
2. Fill out personal details
3. Upload documents (salary certificate and ID in supported formats)
4. Review everything
5. Get confirmation with application number

## Where Data Gets Saved

- Customer information goes into `data/applications.json` (JSON file)
- Uploaded documents go into `uploads/` folder

Both folders are created automatically when you submit the first application.

## What I Used

- Next.js 14 - for the framework
- React - for the UI
- TypeScript - for type safety
- Tailwind CSS - for styling
- JSON file - for storing data

## Features

- Multi-step form that's easy to follow
- Shows warnings if salary is too low or person is unemployed/student
- Uploads files and saves them
- Everything saved locally

## Notes

- I kept the code simple and easy to understand
- Used basic validation (just checking if fields are filled)
- Stored data in JSON instead of a database 
- Added console.logs to help with debugging

## Things I Could Improve

- Add better error messages
- Maybe split the big application file into smaller components
- Add email confirmation when application is submitted
- Use a real database instead of JSON for production

## Testing

Just fill out the form with some test data:
- First name: Mevin
- Last name: Mathews
- Email: test@example.com
- Phone: 0501234567
- Job: Salaried
- Company: Test Company
- Salary: 15000

Upload any two files and submit and get an application number at the end.




