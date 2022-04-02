// 处理命令行
const program = require("commander");
// 下载模板
const download = require("download-git-repo");
// 命令行交互
const inquirer = require("inquirer");
// 视觉美化
const ora = require("ora");
const chalk = require("chalk");
const symbols = require("log-symbols");

const fs = require("fs");
const handlebars = require("handlebars");
const pkg = require("./package.json");
console.log(pkg.version);

program
	.version(pkg.version, "-v, --version")
	.command("create <name>")
	.action(async name => {
		const answers = await inquirerFn();
		downloadTemplate(name, answers);
	});

program.parse(process.argv);

// 交互方法;
async function inquirerFn() {
	return await inquirer.prompt([
		{
			type: "input",
			name: "description",
			message: "请输入项目简介"
		},
		{
			type: "input",
			name: "author",
			message: "请输入作者名称"
		}
	]);
}

// 下载模板
async function downloadTemplate(name, answers) {
	const spinner = ora("正在下载模板...");
	spinner.start();
	download("https://github.com:dongshihao666/lowcode#dev", name, { clone: true }, err => {
		if (err) {
			spinner.fail();
			console.log(symbols.error, chalk.red("项目创建失败"));
		} else {
			const { description, author } = answers;
			const meta = {
				name,
				description,
				author
			};
			const fileName = `${name}/package.json`;
			if (fs.existsSync(fileName)) {
				const content = fs.readFileSync(fileName).toString();
				const result = handlebars.compile(content)(meta);
				fs.writeFileSync(fileName, result);
			}
			spinner.succeed();
			console.log(symbols.success, chalk.green("项目创建成功"));
		}
	});
}