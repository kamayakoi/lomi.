### Bruno CLI

With Bruno CLI, you can run your API collections with ease using simple command line commands.

This makes it easier to test your APIs in different environments, automate your testing process, and integrate your API tests with your continuous integration and deployment workflows.

## Installation

To install the Bruno CLI, use the node package manager of your choice, such as NPM:

npm install -g @usebruno/cli

## Getting Started

Navigate to the directory where your API collection resides, and run the following command:

bru run

This will run all the requests in your collection. If you want to run a single request, specify its filename:

bru run request.bru

## Running Requests in a Folder

To run all the requests within a folder, use:

bru run folder

## Using Environments

If you need to use a specific environment, you can pass it with the --env option:

bru run folder --env Local

## Passing Environment Variables

You can pass environment variables directly to your collection with the --env-var option:

bru run folder --env Local --env-var JWT_TOKEN=1234

## Running a Collection with a CSV File

If you need to run a collection using data from a CSV file, specify the path to the file with the --csv-file-path option:

bru run folder --csv-file-path /path/to/csv/file.csv

## Outputting Results

To save the results of your API tests to a file, use the --output option:

bru run folder --output results.json

## Generating Reports

Bruno CLI provides built-in support for generating reports in three formats: JSON, JUnit, and HTML. These reports help with analyzing test results and integrating with various CI/CD tools.

You can generate any combination of these reports and even run them simultaneously.

## JSON Report

To generate a report in JSON format, use the --reporter-json option:

bru run request.bru --reporter-json results.json

This will output the test results in a results.json file, which can be useful for further processing or programmatic analysis.

## JUnit Report

To generate a report in JUnit format, use the --reporter-junit option:

bru run request.bru --reporter-junit results.xml

The results.xml file will be in a format compatible with JUnit, making it ideal for integration with CI/CD pipelines that rely on JUnit reporting.

## HTML Report

To generate a human-readable HTML report, use the --reporter-html option:

bru run request.bru --reporter-html results.html

This will create an results.html file that provides a visual representation of the test outcomes, ideal for quick reviews.

Running Multiple Reporters Simultaneously
You can generate multiple reports at once by specifying more than one reporter option. For example, to generate JSON, JUnit, and HTML reports simultaneously, run:

bru run request.bru --reporter-json results.json --reporter-junit results.xml --reporter-html results.html

This command will create three files: results.json, results.xml, and results.html, allowing you to analyze the results in different formats as needed.

## Options

Option	Details

-h, --help	Show help
--version	Show version number
-r	Indicates a recursive run (default: false)
--cacert [string]	CA certificate to verify peer against
--env [string]	Specify environment to run with
--env-var [string]	Overwrite a single environment variable, multiple usages possible
-o, --output [string]	Path to write file results to
-f, --format [string]	Format of the file results; available formats are "json" (default) or "junit"
--reporter-json [string]	Path to generate a JSON report
--reporter-junit [string]	Path to generate a JUnit report
--reporter-html [string]	Path to generate an HTML report
--insecure	Allow insecure server connections
--tests-only	Only run requests that have tests
--bail	Stop execution after a failure of a request, test, or assertion
--csv-file-path	CSV file to run the collection with


## Using Basic authentication

Basic authentication involves sending a verified username and password with your request. In the request Auth tab, select Basic Auth from the Auth Type dropdown list.

Enter your API username and password in the Username and Password fields. For extra security, store these in variables.

In the request Headers, the Authorization header passes the API a Base64 encoded string representing your username and password values, appended to the text Basic.

## Authenticate with a Bearer token

Bearer tokens enable requests to authenticate using an access key, such as a JSON Web Token (JWT). The token is a text string, included in the request header. In the request Auth tab, select Bearer Token from the Auth Type dropdown list. In the Token field, enter your API key value. For added security, store it in a variable and reference the variable by name.

Bruno appends the token value to the text Bearer in the required format to the request Authorization header.