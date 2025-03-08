module Jekyll
  module Commands
    class Build
      class << self
        def watch(_site, _options)
          # 覆盖或干脆什么都不做，从而避免调用 bash_on_windows?
          Jekyll.logger.info "Auto-regeneration:", "manually disabled by no_watch_patch.rb"
        end
      end
    end
  end
end
