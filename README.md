# quakeParser
This is an application developed as a code challenge for CloudWalk.

## Technology and Tools
For this application, I used:
- Node.js
- Typescript (transpile with ts-node)
- Jest for unit testings
- Yarn for package managment
- ESLint for static checks

## How to run
First we need to install node: https://nodejs.org/en/download/package-manager/

Since we are using yarn, we need to install yarn too:
````
npm install yarn --global
yarn --version // verify installation
````
Then go to the project root directory. To install all packages run:
```
yarn
```
Now we can run the project with:
```
yarn report
````
You can also run all tests with:
```
yarn test
```
After run all the tests, a directory called ```coverage``` will be create with a .html file if you want to see the report on your browser.

## Assumptions
- All log files will have the same format and the one provided on the challange
- Players cannot have special characters on their names
- If a player kills themself (not by <world>) it will NOT award kill score
- A game is created with a InitGame and ends at the next InitGame or end of file
