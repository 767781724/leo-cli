#! /usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const downloadGit = require('download-git-repo');
const chalk = require('chalk');
const fs = require('fs');


const success = chalk.blueBright;
const error = chalk.bold.red;

const gitArr = {
    'leo-multiple-page': 'direct:https://github.com/767781724/leo-multiple-page.git',
    'leo-backstage': 'direct:https://github.com/767781724/react-antd-back.git'
}
program.version('0.0.1').option('-i,--init [name]', 'initialize the platform').parse(process.argv);

const changePackage = () => {
    fs.readFile(`${process.cwd()}/${program.init}/package.json`, (err, data) => {
        if (err) throw err;
        let _data = JSON.parse(data.toString());
        _data.name = program.init;
        _data.version = '1.0.0';
        let str = JSON.stringify(_data, null, 4);
        fs.writeFile(`${process.cwd()}/${program.init}/package.json`, str, function (err) {
            if (err) throw err;
        })
    })
}

if (program.init && typeof program.init === 'string') {
    inquirer.prompt([{
        type: "list",
        name: "types",
        message: "Please choose a scaffold",
        choices: ['leo-multiple-page', 'leo-backstage'],
        pageSize: 4
    }]).then(res => {
        const spinner = ora('Pulling template...').start();
        if (gitArr.hasOwnProperty(res.types)) {
            downloadGit(gitArr[res.types], program.init, { clone: true }, (err) => {
                if (!err) {
                    spinner.succeed(success('Pull successfully'));
                    changePackage()
                } else {
                    spinner.fail('Pull failed');
                }
            })
        }
    })
} else {
    console.error((error('Please enter the name after init.')))
}