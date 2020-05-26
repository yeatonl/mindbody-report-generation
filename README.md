# MindBody Onion
Winter-Spring TH-R Capstone Team D Project This is a tool for generating more useful reports from the Mindbody API.

## Dependencies
1. Node 13.9 or later

## Installation
1. Go to https://github.com/yeatonl/mindbody-report-generation/releases/tag/0.0.1
2. Download the first file under Assets (should be something like mindbody-onion-X-X-X.7z)
3. Extract the downloaded archive.
4. Go into the resulting directory. This is your installation directory.
5. Add `secrets.json` in the `config` directory. Use this format:
```
{
    "username":"your username",
    "password":"your passwords",
    "apikey":"your apikey"
}
```
6. Run `npm install`

## Usage
1. Go to the installation directory directory
2. Run `npm start`
3. The graphical client should open automatically in your default browser, but can also be reached at http://localhost:3000.

## Development
1. Clone this repository
2. Run `npm install` from both the /server and /client directories
3. Add `secrets.json` to `/server/config`.
4. Running `npm start` in `/server` will start the Node API server and the web server
6. Running `npm start` in `/client` will start the development web server (you'll probably want to use this one, since it has features like hot reload)

### Adding reports
Supposing that the report you want to add is called *example-report*:
1. Create a subdirectory of `/server/reports` called "example-report"
2. Add an `example-report.js` file in this subdirectory. Use functions from `/server/api-manager.js` to interface with MindBody.
3. Add the endpoint `/reports/example-report` to `/server/app.js`.
4. Add a new key:value pair to `/server/config/reports.js`. The key should be "EXAMPLE_REPORT" and the value should be a JSON object describing the metadata of the report. 
