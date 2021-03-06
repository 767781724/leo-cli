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
    'leo-design-pro': 'direct:https://github.com/767781724/leo-design-pro.git#main',
    'leo-multiple-page': 'direct:https://github.com/767781724/leo-multiple-page.git#main',
    'leo-backstage': 'direct:https://github.com/767781724/react-antd-back.git#main'
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
        let str = JSON.stringify(_data, null, 4);
        fs.writeFile(`${process.cwd()}/${path}/package.json`, str, function (err) {
            if (err) throw err;
        })
    })
}

if (program.init && typeof program.init === 'string') {
    inquirer.prompt([{
        type: "list",
        name: "types",
        message: "请选择脚手架",
        choices: Object.keys(gitArr),
        pageSize: 4
    }]).then(res => {
        const spinner = ora('Pulling template...').start();
        if (gitArr.hasOwnProperty(res.types)) {
            downloadGit(gitArr[res.types], program.init, { clone: true }, (err) => {
                if (!err) {
                    spinner.succeed(success('Pull successfully'));
                    changePackage(program.init)
                } else {
                  console.log(err)
                    spinner.fail(err);
                }
            })
        }
    })
}else if(program.create && typeof program.create === 'string'){

    inquirer.prompt([{
        type: "list",
        name: "types",
        message: "请选择需要创建的项目文件",
        choices: ['sub_project', 'gulp_project', 'component_project'],
    }]).then(res=>{
    // 获取将要构建的项目根目录
        const projectPath = path.resolve(program.create);
        const cwd=path.join(__dirname,`./templates/${res.types}`);
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
            if(res.types==='sub_project'){
                changePackage(program.create)
            }
            // spinner.success("download completed")
        })
        .resume();
    })
    
}else {
    console.error((error('Please enter the name after init.')))
}



