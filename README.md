# nemjs

[![NPM Version](https://badgen.net/npm/v/nemjs)](https://www.npmjs.com/package/nemjs)

JavaScript Backend Service Library

[![NPM Downloads](https://badgen.net/npm/dt/nemjs)](https://www.npmjs.com/package/nemjs)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/philippebeck/nemjs.svg?label=Last+Commit)](https://github.com/philippebeck/nemjs/commits/master)

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/6fe8d75b9343429d9b3587e622ac79c9)](https://www.codacy.com/gh/philippebeck/nemjs/dashboard)
[![Maintainability](https://api.codeclimate.com/v1/badges/0641edca905dbe1671ea/maintainability)](https://codeclimate.com/github/philippebeck/nemjs/maintainability)

[![GitHub Top Language](https://img.shields.io/github/languages/top/philippebeck/nemjs.svg?label=JavaScript)](https://github.com/philippebeck/nemjs)
[![Code Size](https://img.shields.io/github/languages/code-size/philippebeck/nemjs.svg?label=Code+Size)](https://github.com/philippebeck/nemjs/tree/master)

## Overview

nemjs is a JavaScript Backend Service Library.  
You will find some Services about Tokens, String, Images & Mails  

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

-   **checkAuth(req, res, next)** : check JWT auth to routes  
-   **checkLogin(pass, user, res)** : compare passwords & sign JWT  
-   **checkEmail(email)** : check email validity  
-   **checkName(name)** : check name length  
-   **checkPass(pass)** : check pass validity  
-   **checkText(text)** : check text length  
-   **checkUrl(url)** : check url validity  
-   **generatePass()** : generate & return password  
-   **stringToArray(string)** : format string & return array   
-   **createImage(inputImg, outputImg)** : create image  
-   **createThumbnail(inputImg, outputImg)** : create thumbnail  
-   **createMailer()** : create mailer  
-   **createMessage(message)** : create message  

---

## Usage

1.  Copy the `.env.example` file to your project root, rename it `.env` & replace values with your own values
2.  Add `const nem = require("nemjs")` where you need (file or function top level)
3.  Then use it like these examples : 
    -  `router.get("/", nem.checkAuth, UserCtrl.list)`  
    -  `nem.checkLogin(guest.password, user, res)`  
    -  `if (nem.checkEmail(guest.email)) { ... }`  
    -  `if (nem.checkName(guest.name)) { ... }`  
    -  `if (nem.checkPass(guest.password)) { ... }`  
    -  `let pass = nem.generatePass();`  
    -  `if (nem.checkText(item.text)) { ... }`  
    -  `if (nem.checkUrl(item.url)) { ... }`  
    -  `nem.createImage(uploadImage, newImage);`  
    -  `nem.createThumbnail(uploadImage, newImage);`  
    -  `const mailer = nem.createMailer()`  
    -  `let message = nem.createMessage(req)`  
