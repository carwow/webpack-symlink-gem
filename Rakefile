require "bundler/gem_tasks"

desc "Upload to fury repository"
task :upload => :build do
  # Check if tag with v#{WebpackSymlink::VERSION} version exists, if so, return with error

  if tag_exists?(current_tag_name)
    puts "Tag exists, did you run rake increase_revision_number after merging with master?"
    exit 1
  end

  create_tag(current_tag_name)
  upload_gem
end

desc "Increase the revision number"
task :increase_revision_number do
  version_file = "lib/webpack_symlink/version.rb"
  file_content = File.read(version_file)
  rule = /(\d+\.\d+\.)(\d+)/
  new_revision_number = rule.match(file_content)[2].to_i + 1
  new_file_content = file_content.sub(rule, '\1' + new_revision_number.to_s)

  File.open(version_file, 'w') { |file| file.write(new_file_content) }
end

def tag_exists?(tag_name)
  result = `git tag | grep #{tag_name}`.strip
  result == tag_name
end

def create_tag(tag_name)
  sh "git tag -a #{tag_name} -m \"Released version #{tag_name}\""
  sh "git push origin #{tag_name}"
end

def current_tag_name
  "v#{WebpackSymlink::VERSION}"
end

def upload_gem
  gem = "pkg/webpack_symlink-#{WebpackSymlink::VERSION}.gem"
  sh "curl -F package=@#{gem} https://push.fury.io/VWhHjDDR6hZfd6krhgVB/app3297841_heroku_com/"
end
