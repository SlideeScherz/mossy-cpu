# mos-6502

![build-badge]

mos-6502 is a virtual 6502 processor written in TypeScript
and running on Node.js. This project is the practical
component of Prof. Gormanly's Computer Organization and
Architecture class. This project strives to accomplish
the following goals:

- A deep understanding of how the machine works.
There is no better way to learn how computers actually
work than to build one!
- You become a high level master of code
by using OOP to create a virtual machine
- You become a low level ninja, creating
programs in machine instructions to run on your creation!
Enriching your understanding of the world below your compiler.
- Your design and debugging skills are
pushed to solve problems that will melt your brain. You will debug machine level code you write on a machine you built!

## Credits

This software is an adaptation of a project created by
[Dr. Alan Labouseur's](http://labouseur.com/courses/os/)
for his Operating Systems (CMPT 424) course project.
That project builds a very cool operating system on top of a
rudimentary virtual 6502 CPU. This project focuses on building
a robust and complete 6502 architecture and instruction set.
You will be creating a 6502 emulator programmed using TypeScript
that will run on server-side JavaScript in Node.js. Here are
references to Dr. Labouseur's original projects:

- 2019 version: <https://github.com/AlanClasses/TSOS-2019>
- 2015-2018 version: <https://github.com/AlanClasses/TSOS>

There are plans to possibly expand this project in a way that
would allow you to continue to use it to build an adapted
version of Dr. Labouseur's OS project on top of.

## Usage

### Install Node.js

<https://nodejs.org/en/docs/guides/getting-started-guide/>

### Install TypeScript

`npm install -g typescript`

## How to run

First run `npm install` to install Node.js dependencies

Next, TypeScript must be compiled before you can run and after you make changes to TypeScript (.ts) files. There is a provided bash script called 't.bash' in the project root. You may need to add execute permission to the file before you can run.

Once you run it, you should see that a dist/ folder is created in your project home and it contains the JavaScript that your Node.js server will run.

To start the Node.js server run

```bash
npm start
```

After any changes you must re-compile `t.bash` and then `npm start` to run Node.js.

### @types/Node.js

If not present in directory, run

```bash
npm install @types/node --save-dev
```

## Fixing bugs from t.bash

Some bugs may be from a transpile error. To delete the Dist (JavaScript folder) run:

```bash
rm -rf dist/
```

Then recompile the `t.bash` script

[build-badge]: https://github.com/SlideeScherz/mos-6502/actions/workflows/build-test.yml/badge.svg?branch=main
