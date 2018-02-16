const execSync = require("child_process").execSync;
const fs = require("fs");
const path = require("path");

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

function linkGem(compilation, rootPath, config) {
  console.log('LINKING GEM: ', config.name);
  var cmd = "git clone -b 'v4.7.2' --single-branch --depth 1 git@github.com:carwow/carwow-theme.git ./"+config.gemPathRoot+"/carwow_theme-4.7.2";

  execSync(cmd);

  // console.log('CWD: ', execSync('pwd').toString().trim());
  // // console.log('ls ~/vendor/bundle/ruby/2.4.0/gems/ ', execSync('ls ./vendor/bundle/ruby/2.4.0/gems/').toString().trim());
  // let gemPathRoot;
  // const gem = config.name;
  // const gemPath = config.gemPath || "";

  // clean(rootPath, gem);

  // try {
  //   gemPathRoot = execSync(gemShowCmd(gem)).toString().trim();
  //   console.log('bundle show ', gem, ': ', gemPathRoot);
  // } catch (err) {
  //   console.log('ERROR getting gemPathRoot!');
  //   compilation.errors.push(makeError(err.message));
  //   return;
  // }

  // const fullGemPath = path.join(gemPathRoot, gemPath);
  // console.log('fullGemPath: ', fullGemPath);
  // if (!fs.existsSync(fullGemPath)) {
  //   // compilation.errors.push(makeError("Path for gem was invalid: " + fullGemPath));
  //   // return;
  //   console.log("WARNING: Path for gem was invalid, webpack may not compile: " + fullGemPath);
  // }

  // fs.symlinkSync(fullGemPath, localPath(rootPath, gem));
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

  apply(compiler) {
    compiler.plugin("compilation", (compilation) => {
      if (!fs.existsSync(this.rootPath)) {
        fs.mkdirSync(this.rootPath);
      }
      this.gems.forEach(linkGem.bind(this, compilation, this.rootPath));
    });
  }
}

module.exports = WebpackSymlinkGem;
