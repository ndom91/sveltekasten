{
  inputs.pkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.prisma-utils.url = "github:VanCoding/nix-prisma-utils";

  outputs =
    { pkgs, prisma-utils, ... }:
    let
      nixpkgs = import pkgs { system = "x86_64-linux"; };
      prisma =
        (prisma-utils.lib.prisma-factory {
          inherit nixpkgs;
          prisma-fmt-hash = "sha256-4zsJv0PW8FkGfiiv/9g0y5xWNjmRWD8Q2l2blSSBY3s="; # just copy these hashes for now, and then change them when nix complains about the mismatch
          query-engine-hash = "sha256-6ILWB6ZmK4ac6SgAtqCkZKHbQANmcqpWO92U8CfkFzw=";
          libquery-engine-hash = "sha256-n9IimBruqpDJStlEbCJ8nsk8L9dDW95ug+gz9DHS1Lc=";
          schema-engine-hash = "sha256-j38xSXOBwAjIdIpbSTkFJijby6OGWCoAx+xZyms/34Q=";
        }).fromPnpmLock
          ./pnpm-lock.yaml; # <--- path to our pnpm-lock.yaml file that contains the version of prisma-engines
    in
    {
      devShells.x86_64-linux.default = nixpkgs.mkShell { shellHook = prisma.shellHook; };
    };
}

