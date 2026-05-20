# Documentation: https://docs.lomi.africa/docs/cli/install

class Lomi < Formula
  desc "CLI for lomi.'s payment infrastructure"
  homepage "https://lomi.africa"
  version "3.0.0"
  license "MIT"

  on_macos do
    on_intel do
      url "https://github.com/lomiafrica/lomi./releases/download/cli-v3.0.0/lomi-x86_64-apple-darwin"
      sha256 "REPLACE_ON_RELEASE"
    end
    on_arm do
      url "https://github.com/lomiafrica/lomi./releases/download/cli-v3.0.0/lomi-aarch64-apple-darwin"
      sha256 "REPLACE_ON_RELEASE"
    end
  end

  on_linux do
    on_intel do
      url "https://github.com/lomiafrica/lomi./releases/download/cli-v3.0.0/lomi-x86_64-unknown-linux-gnu"
      sha256 "REPLACE_ON_RELEASE"
    end
  end

  def install
    bin.install "lomi-aarch64-apple-darwin" => "lomi" if Hardware::CPU.arm?
    bin.install "lomi-x86_64-apple-darwin" => "lomi" if Hardware::CPU.intel? && OS.mac?
    bin.install "lomi-x86_64-unknown-linux-gnu" => "lomi" if OS.linux?
  end

  test do
    assert_match "lomi", shell_output("#{bin}/lomi --version")
  end
end
