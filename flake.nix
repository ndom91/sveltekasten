{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { nixpkgs, ... }:
    let
      genSystems = nixpkgs.lib.genAttrs [ "x86_64-linux" ];
      pkgsFor = nixpkgs.legacyPackages;
    in
    {
      devShells = genSystems (system: {
        default = pkgsFor.${system}.mkShell {
          packages = with pkgsFor.${system}; [
            nodejs_20
            nodePackages.pnpm
            bun
            openssl
            vips # for sharp
            pkg-config
            prisma-engines
            stdenv.cc.cc
          ];
        };
      });
    };
}
