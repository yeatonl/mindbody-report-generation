# mindbody-report-generation
Winter-Spring TH-R Capstone Team D Project
This is a tool for generating more useful reports from the Mindbody API.

## Installation:

1. Run `npm install` from both /client and /server directories 
2. Add secrets.json in /server/config in the format: 

```json
{
    "username":"your username",
    "password":"your passwords",
    "apikey":"your apikey"
}
```

## Usage: 
1. From /server, run `npm start`. Note that node.js v13.9 or later is required. 
2. From /client, perhaps in a separate terminal, run `npm start`. The client should open automatically in your default browser, but can also be reached at http://localhost:3000
