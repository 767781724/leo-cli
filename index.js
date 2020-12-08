#! /usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const downloadGit = require('download-git-repo');
const chalk = require('chalk');
const fs = require('fs');
const path=require('path');
const vfs = require('vinyl-fs');
const through = require('through2');


const success = chalk.blueBright;
const error = chalk.bold.red;

const gitArr = {
    'leo-multiple-page': 'direct:https://github.com/767781724/leo-multiple-page.git',
    'leo-backstage': 'direct:https://github.com/767781724/react-antd-back.git'
}
program.version('0.0.1')
.option('-i,--init [name]', 'initialize the platform')
.option('-c,--create [name]', 'create the project page')


program.parse(process.argv)
const changePackage = (path) => {
    fs.readFile(`${process.cwd()}/${path}/package.json`, (err, data) => {
        if (err) throw err;
        let _data = JSON.parse(data.toString());
        _data.name = path;
        _data.version = '1.0.0';
        if(program.create){
            const _script={
                'dev': `node ../../../server/start.js --project=${path} --APP_ENV=test`,
                'build:test': `node ../../../server/build.js --project=${path} --APP_ENV=test`,
                'build:beta': `node ../../../server/build.js --project=${path} --APP_ENV=beta`,
                'Ïbuild:prodÏ': `node ../../../server/build.js --project=${path} --APP_ENV=prod`
            }
            _data.scripts=_script;
        }
        let str = JSON.stringify(_data, null, 4);
        fs.writeFile(`${process.cwd()}/${path}/package.json`, str, function (err) {
            if (err) throw err;
        })
    })
    fs.readFile(`${process.cwd()}/${path}/public/manifest.json`, (err, data) => {
        if (err) throw err;
        let _data = JSON.parse(data.toString());
        _data.name = path;
        let str = JSON.stringify(_data, null, 4);
        fs.writeFile(`${process.cwd()}/${path}/public/manifest.json`, str, function (err) {
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
                    changePackage(program.init)
                } else {
                    spinner.fail('Pull failed');
                }
            })
        }
    })
}else if(program.create && typeof program.create === 'string'){
    // 获取将要构建的项目根目录
    const projectPath = path.resolve(program.create);
    const cwd=path.join(__dirname,'./templates/demo');

    // 从demo目录中读取除node_modules目录下的所有文件并筛选处理
    vfs.src(['**/*', '!node_modules/**/*'], { cwd: cwd, dot: true }).
    pipe(through.obj(function (file, enc, callback) {
    if (!file.stat.isFile()) {
      return callback();
    }

    this.push(file);
    return callback();
  }))
    // 将从demo目录下读取的文件流写入到之前创建的文件夹中
    .pipe(vfs.dest(projectPath))
    .on('end', function () {
        // spinner.success("download completed")
        changePackage(program.create)
        console.log('ok')
    })
    .resume();
}else {
    console.error((error('Please enter the name after init.')))
}



