# jest-fable-preprocessor

[![Build Status](https://travis-ci.org/jgrund/jest-fable-preprocessor.svg?branch=master)](https://travis-ci.org/jgrund/jest-fable-preprocessor)
[![Greenkeeper badge](https://badges.greenkeeper.io/jgrund/jest-fable-preprocessor.svg)](https://greenkeeper.io/)

Compiles [Fable](fable.io) to JS on the fly for Jest testing.

## Setup

At a minimum, your `package.json` should include these entries (version numbers not important):

```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "preset": "jest-fable-preprocessor"
  },
  "devDependencies": {
    "babel-core": "6.26.0",
    "jest": "22.1.4",
    "jest-fable-preprocessor": "1.3.3"
  }
}
```

You will also need a `Test.fsproj` file under a `test` directory.
The `Test.fsproj` file should contain your tests and a link to the source. Example:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
  </PropertyGroup>
  <ItemGroup>
    <ProjectReference Include="../Shell.fsproj" />
    <Compile Include="unit/ShellTest.fs" />
    <Compile Include="integration/ShellTest.fs" />
  </ItemGroup>
  <Import Project="../paket/Paket.Restore.targets" />
</Project>
```

## Running

`dotnet fable npm-test` will parse your tests and run them.
