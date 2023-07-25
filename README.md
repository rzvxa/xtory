# Xtory
![Latest Release by date](https://img.shields.io/github/v/tag/rzvxa/xtory?color=ebdbb2) ![License](https://img.shields.io/badge/license-GPLv3-blue.svg?style=flat) [![CodeQL](https://github.com/rzvxa/xtory/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/rzvxa/xtory/actions/workflows/codeql-analysis.yml) [![Test](https://github.com/rzvxa/xtory/actions/workflows/test.yml/badge.svg)](https://github.com/rzvxa/xtory/actions/workflows/test.yml) [![Publish](https://github.com/rzvxa/xtory/actions/workflows/publish.yml/badge.svg)](https://github.com/rzvxa/xtory/actions/workflows/publish.yml)

![Xtory](https://raw.githubusercontent.com/rzvxa/xtory/master/ScreenShots/screenshot1.png)


#### Please note that Xtory is early in the development stages, and it is not recommended to use it for any actual production till it reaches the first stable version release.

## What is Xtory?
It's a tool for writing non-linear stories using flows and nodes.
Xtory can export all of its story flow files into compact binary, JSON, or with the use of plugins, any other format for you to use in your games and pipeline however you like.

## Why is Xtory?
I'm a game developer with a passion for games with good stories; Maybe you, too, always thought writing dialogue options should be done as a dialogue tree, and basically, word or traditional screenplay writing tools doesn't cut the job.

## When is Xtory?
 Near 5 years ago, I started this project as a fork of [Dialogger](https://github.com/etodd/dialogger) which I then modified with custom nodes for function calls to the engine, conditional options(based on game state), and localization. This version can be found [here](https://github.com/rzvxa/xtory/releases/tag/legacy-version). For many years I've tried to rewrite this project with extendability as a general-purpose tool, But I tend to stop everything and start from scratch. I've restarted this project many times with many stacks such as [Qt](https://www.qt.io/), [AvaloniaUI](https://avaloniaui.net/), [GTK](https://www.gtk.org/), and even good old [ImGUI](https://github.com/ocornut/imgui).
 
 ## Choice of Stack
 In the end, I've chosen the slowest option, which is a react app wrapped in an Electron layer. But to be honest, The problem with many of the greatest Open Source software is poor UI design which prevents them from appealing to a wider audience, [Blender](https://www.blender.org/) transition from 2.7x to 2.8x and [Musescore](https://musescore.org/en) version 3.xx to 4.xx shows this in practice. So With the help of react, Using a web approach to design and borrowing heavily from VSCode UI/UX (which I've wanted to make this project as an extension for it, but that wasn't feasible enough at the time), I hope it's easier to make a clean and usable UI with much more manageable development effort.

# Features

* Intuitive **Node** base approach to writing non-linear stories.
* Writing **Conversations** using nodes, With dialogue options and conditional scenarios.
* **Character creator** with back story and conversation tracking for writing better characters, NPCs, and stories.
* Xtory is **Cross-Platform**!
* It comes with `xtory-parser`, An open source **C++ story parser** for implementing xtory stories in your game engine.
* **Unity3D** Open Source Package(via `xtory-parser`)
* **Extendable** with plugins
* **Open source** and free to use for writing stories, Both in commercial and personal projects.
* Easy to **version control** project structure, Emphasizing breaking down flows into sub-flows to enable teams to work on different parts of the story simultaneously.

## Roadmap

Right now, there is a roadmap for the project describing our next few releases.
[View Roadmap](https://github.com/users/rzvxa/projects/2)

Xtory gets a new release every 2 weeks, As the project gets more mature we will extend our release windows to a month as I have to delegate time into our C++ library for using Xtory files in game engines.

Both xtory-parser and Unity3D package are non-existent at the moment And will be shipped with the first production release(version 1.0.0).

### Contribution
Feel free to make issues and/or help with the development.
