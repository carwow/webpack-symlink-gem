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
  console.log('CWD: ', execSync('pwd'));
  let gemPathRoot;
  const gem = config.name;
  const gemPath = config.gemPath || "";

  clean(rootPath, gem);

  try {
    gemPathRoot = execSync(gemShowCmd(gem)).toString().trim();
    console.log('bundle show ', gem, ': ', gemPathRoot);
  } catch (err) {
    console.log('ERROR getting gemPathRoot!');
    compilation.errors.push(makeError(err.message));
    return;
  }

  const fullGemPath = path.join(gemPathRoot, gemPath);
  console.log('fullGemPath: ', fullGemPath);
  if (!fs.existsSync(fullGemPath)) {
    compilation.errors.push(makeError("Path for gem was invalid: " + fullGemPath));
    console.log('ls /tmp/ ', execSync('ls /tmp/'));
    return;
  }

  fs.symlinkSync(fullGemPath, localPath(rootPath, gem));
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
