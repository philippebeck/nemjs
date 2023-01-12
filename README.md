# nemjs

A JavaScript Backend Service Library

[![NPM Version](https://badgen.net/npm/v/nemjs)](https://www.npmjs.com/package/nemjs)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/philippebeck/nemjs.svg?label=Last+Commit)](https://github.com/philippebeck/nemjs/commits/master)
[![NPM Downloads](https://badgen.net/npm/dt/nemjs)](https://www.npmjs.com/package/nemjs)
[![GitHub License](https://img.shields.io/github/license/philippebeck/nemjs.svg?label=License)](https://github.com/philippebeck/nemjs/blob/master/LICENSE.md)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6fe8d75b9343429d9b3587e622ac79c9)](https://www.codacy.com/gh/philippebeck/nemjs/dashboard)
[![Maintainability](https://api.codeclimate.com/v1/badges/0641edca905dbe1671ea/maintainability)](https://codeclimate.com/github/philippebeck/nemjs/maintainability)
[![GitHub Top Language](https://img.shields.io/github/languages/top/philippebeck/nemjs.svg?label=JavaScript)](https://github.com/philippebeck/nemjs)
[![Code Size](https://img.shields.io/github/languages/code-size/philippebeck/nemjs.svg?label=Code+Size)](https://github.com/philippebeck/nemjs/tree/master)

## Overview

nemjs is a JavaScript Backend Service Library.  
You will find Checking Services & Mailer Setting for the moment.  
Checking Services are useful for login, signup & routing about email & password.  

## Summary

- [nemjs](#nemjs)
  - [Overview](#overview)
  - [Summary](#summary)
  - [Package](#package)
  - [Download](#download)
  - [Content](#content)
  - [Usage](#usage)

---

## Package

NPM : `npm i nemjs`  
Yarn : `yarn add nemjs`  

---

## Download

[Latest Release](https://github.com/philippebeck/nemjs/releases)  

`git clone https://github.com/philippebeck/nemjs.git`  
  
---

## Content

-   **checkAuth(req, res, next)** : check route authentication  
-   **checkLogin(req, res, user)** : check user login  
-   **checkEmail(email, res)** : check user email  
-   **checkPass(pass, res)** : check user pass  
-   **createMailer()** : create contact mailer  

---

## Usage

1.  Copie the `.env.example` file to your project root, rename it `.env` & replace values with your own values
2.  Add `const nem = require("nemjs")` where you need (file or function top level)
3.  Then use it like these examples : 
    -  `router.get("/", nem.checkAuth, UserCtrl.list)`  
    -  `nem.checkLogin(req, res, user)`  
    -  `nem.checkEmail(email, res)`  
    -  `nem.checkPass(pass, res)`  
    -  `const mailer = nem.createMailer()`  
