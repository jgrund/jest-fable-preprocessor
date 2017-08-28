# jest-fable-preprocessor

[![Greenkeeper badge](https://badges.greenkeeper.io/jgrund/jest-fable-preprocessor.svg)](https://greenkeeper.io/)

Transpiles [Fable](fable.io) to JS for Jest testing.

Does so without the need for Webpack.

This approach is useful for Fable libraries, I.E. dependencies that are not the root node in a project tree.

## Setup

At a minimum, your `package.json` should include these entries (version numbers not important):

```
{
  "scripts": {
    "jest": "jest",
    "test": "dotnet fable npm-run jest"
  },
  "jest": {
    "moduleFileExtensions": [
      "js",
      "fs",
      "fsx"
    ],
    "transform": {
      "^.+\\.(fs|fsx)$": "jest-fable-preprocessor",
      "^.+\\.js$": "babel-jest"
    },
    "testMatch": [
      "**/test/**/*.(fs|fsx)"
    ],
    "transformIgnorePatterns": [
      "node_modules/(?!fable.+)/"
    ]
  },
  "devDependencies": {
    "babel-core": "6.24.0",
    "jest": "19.0.2",
    "jest-fable-preprocessor": "1.0.0"
  }
}
```

You will also need a `Test.fsproj` file under a `test` directory.
The `Test.fsproj` file should contain your tests and a link to the source. Example:

```
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <DotNetCliToolReference Include="dotnet-fable" Version="1.2.0-beta-003" />
  </ItemGroup>
  <ItemGroup>
    <ProjectReference Include="../Shell.fsproj" />
    <Compile Include="unit/ShellTest.fs" />
    <Compile Include="integration/ShellTest.fs" />
  </ItemGroup>
  <Import Project=".paket\Paket.Restore.targets" />
</Project>
```

## Running

```npm run test``` will parse your tests and run them.
