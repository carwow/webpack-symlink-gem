const execSync = require("child_process").execSync;
const fs = require("fs");
const path = require("path");
const copydir = require('copy-dir');

const localRoot = "vendor/gems/";

function makeError(err) {
  return new Error("GemSymlink failed: " + err);
}

function localPath(rootPath, gem) {
  return path.join(rootPath, gem);
}

function gemShowCmd(gem) {
  return "bundle show " + gem;
}

function clean(rootPath, gem) {
  const path = localPath(rootPath, gem);

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

function linkGem(rootPath, config) {
  console.log('LINKING GEM: ', config.name);

  // let gemPath = execSync(gemShowCmd(config.name)).toString().trim();
  // console.log('gemPath: ', gemPath);
  // let version = path.parse(gemPath).base.match(/-(\d+\.\d+\.\d+)/i)[1];

  // var cmd = "git clone -b 'v" + version + "' --single-branch --depth 1 " + config.gitrepo + " ./vendor/gems/" + config.name;
  // console.log('Command: ', cmd);
  // execSync(cmd);

  console.log('CWD: ', execSync('pwd').toString().trim());
  // console.log('ls ~/vendor/bundle/ruby/2.4.0/gems/ ', execSync('ls ./vendor/bundle/ruby/2.4.0/gems/').toString().trim());
  let gemPathRoot;
  const gem = config.name;
  const gemPath = config.gemPath || "";

  clean(rootPath, gem);

  try {
    gemPathRoot = execSync(gemShowCmd(gem)).toString().trim();
    console.log('bundle show ', gem, ': ', gemPathRoot);
  } catch (err) {
    console.log('ERROR getting gemPathRoot!');
    // compilation.errors.push(makeError(err.message));
    return;
  }

  let dir = path.parse(gemPathRoot).dir;
  console.log('dir: ', dir);
  console.log('ls dir ', execSync('ls -lah ' + dir).toString().trim());

  console.log('ls gemPathRoot ', execSync('ls -lah ' + dir + '/' + 'carwow_theme-4.7.2').toString().trim());
  console.log('ls gemPathRoot ', execSync('ls -lah ' + gemPathRoot + '/').toString().trim());

  if (!fs.existsSync(gemPathRoot)) {
    console.log('ERROR - gemPathRoot does not exist! ', gemPathRoot);
  }

  const fullGemPath = path.join(gemPathRoot, gemPath);
  console.log('fullGemPath: ', fullGemPath);
  console.log('COPYING DIR OVER ', fullGemPath, ' to ', localPath(rootPath, gem));
  copydir.sync(fullGemPath, localPath(rootPath, gem));
  // if (!fs.existsSync(fullGemPath)) {
  //   // compilation.errors.push(makeError("Path for gem was invalid: " + fullGemPath));
  //   // return;
  //   console.log("WARNING: Path for gem was invalid, webpack may not compile: " + fullGemPath);
  // }

  // fs.symlinkSync(fullGemPath, localPath(rootPath, gem));

  console.log('ls -lah ~/vendor/gems/ ', execSync('ls -lah ./vendor/gems/').toString().trim());
  console.log('ls -lah ~/vendor/gems/carwow_theme/ ', execSync('ls -lah ./vendor/gems/carwow_theme/').toString().trim());
}

class WebpackSymlinkGem {
  constructor(options = {}) {
    if (!options.hasOwnProperty("gems")) {
      throw new Error("Missing option gems");
    }
    if (!options.hasOwnProperty("rootPath")) {
      throw new Error("Missing option rootPath");
    }
    this.gems = options.gems;
    this.rootPath = options.rootPath;
  }

  link() {
    if (!fs.existsSync(this.rootPath)) {
      fs.mkdirSync(this.rootPath);
    }

    this.gems.forEach(linkGem.bind(this, this.rootPath));
  }

  // apply(compiler) {
  //   // compiler.plugin("compilation", (compilation) => {
  //   compiler.plugin("environment", (compilation) => {
  //     if (!fs.existsSync(this.rootPath)) {
  //       fs.mkdirSync(this.rootPath);
  //     }
  //     this.gems.forEach(linkGem.bind(this, compilation, this.rootPath));
  //   });
  // }
}

module.exports = WebpackSymlinkGem;
