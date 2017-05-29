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
    "prejest": "sendProjFile",
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
    "fable-core": "1.0.0-narumi-906",
    "fable-jest": "2.0.0",
    "jest": "19.0.2",
    "jest-fable-preprocessor": "1.0.0"
  }
}
```

You will also need a `Test.fsproj` file under a `test` directory.
The `Test.fsproj` file should contain your tests and a link to the source. Example:

```
<Project Sdk="FSharp.NET.Sdk;Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netstandard1.6</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="FSharp.NET.Sdk" Version="1.0.*" PrivateAssets="All" />
    <PackageReference Include="FSharp.Core" Version="4.1.*" />
    <PackageReference Include="Fable.Core" Version="1.0.0-narumi-*" />
    <ProjectReference Include="../Shell.fsproj" />
    <ProjectReference Include="../node_modules/fable-jest/fable-jest.fsproj" />
  </ItemGroup>
  <ItemGroup>
    <Compile Include="unit/ShellTest.fs" />
    <Compile Include="integration/ShellTest.fs" />
  </ItemGroup>
</Project>
```

## Running

```npm run test``` will send the fsproj file to the fable server. It will then parse your tests and run them. Webpack is not needed.
