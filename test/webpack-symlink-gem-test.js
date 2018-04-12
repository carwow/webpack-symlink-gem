const fs = require("fs");
const EventEmitter = require("events");
const assert = require("assert");
const { sep } = require("path");
const os = require("os");

const WebpackSymlinkGem = require("../");

const tmpDir = os.tmpdir();

class FakeCompiler {
  constructor() {
    this.callbacks = {};
  }

  plugin(name, callback) {
    this.callbacks[name] = callback;
  }
}

class FakeCompilation {
  constructor() {
    this.errors = [];
  }
}

describe("WebpackSymlinkGem", function () {
  it("throws an error if rootPath is not provided", function() {
    assert.throws(() => new WebpackSymlinkGem({ gems: [] }),
                  Error, "Missing option rootPath");
  });

  it("throws an error if gems is not provided", function() {
    assert.throws(() => new WebpackSymlinkGem({ rootPath: "/tmp/" }),
                  Error, "Missing option gems");
  });

  describe("in general", function () {
    let rootFolder, compiler, plugin, compilation;

    before(function(done) {
      fs.mkdtemp(`${tmpDir}${sep}`, function(err, folder) {
        if (err) { done(err); }

        rootFolder = folder;

        plugin = new WebpackSymlinkGem({
          rootPath: folder,
          gems: [ { name: "gem_one", gemPath: "lib" },
                  { name: "gem_two" },
                  { name: "gem_one", localName: "other_gem_one" },
                  { name: "gem_one", localName: "other_gem_one_with_gem_path", gemPath: "lib" }]
        });
        compiler = new FakeCompiler();

        plugin.apply(compiler);

        compilation = new FakeCompilation();
        compiler.callbacks.compilation(compilation);

        if (compilation.errors.length > 0) {
          console.error(compilation.errors);
          assert.equal(compilation.errors, [], "Expected no errors");
        }

        done();
      });
    });

    it("creates a symlink in rootPath for each gem", function () {
      [
        { link: rootFolder + "/gem_one", expected_path: "test/fake-gems/gem_one/lib"},
        { link: rootFolder + "/gem_two", expected_path: "test/fake-gems/gem_two"},
        { link: rootFolder + "/other_gem_one", expected_path: "test/fake-gems/gem_one"},
        { link: rootFolder + "/other_gem_one_with_gem_path", expected_path: "test/fake-gems/gem_one/lib"}
      ].forEach((example) => {
        assert(fs.existsSync(example.link), "Symlink '" + example.link + "' was not created");

        let fileStat = fs.lstatSync(example.link);
        assert(fileStat.isSymbolicLink());
      });
    });
  });
});
