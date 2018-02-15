
lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "webpack_symlink/version"

Gem::Specification.new do |spec|
  spec.name          = "webpack_symlink"
  spec.version       = WebpackSymlink::VERSION
  spec.authors       = ["Mike Wagg", "Anson Kelly"]
  spec.email         = ["mike.wagg@carwow.co.uk", "anson.kelly@carwow.co.uk"]

  spec.summary       = %q{Creates local symlinks to dependent resources}
  spec.description   = %q{Use to set load path for Elm components in carwow-theme}
  spec.homepage      = "https://github.com/carwow/webpack-symlink"
  spec.license       = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  if spec.respond_to?(:metadata)
    spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"
  else
    raise "RubyGems 2.0 or newer is required to protect against " \
      "public gem pushes."
  end

  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.16"
  spec.add_development_dependency "rake", "~> 10.0"
end
