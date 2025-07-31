{
  description = "A development shell with Python 3.13, fish shell, and gnumake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.python313
            pkgs.fish
            pkgs.gnumake
          ];
          shellHook = ''
            export SHELL=${pkgs.fish}/bin/fish
            exec ${pkgs.fish}/bin/fish
          '';
        };
      }
    );
}
