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
You will find some Services about Checkers, Getters & Setters  
Auth services are using JWT & bcrypt  
Mail services are using nodemailer  
Image services are using sharp  

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
or  
`git clone https://github.com/philippebeck/nemjs.git`  
or  
[Master ZIP](https://github.com/philippebeck/nemjs/archive/refs/heads/master.zip)

---

## Content

Checker part :  
-   **checkAuth(req, res, next)** : check JWT auth to routes  
-   **checkEmail(email)** : check email validity  
-   **checkNumber(number, min, max)** : check number min/max  
-   **checkPass(pass)** : check password validity  
-   **checkString(string, min, max)** : check string min/max  
-   **checkUrl(url)** : check url validity  

Getter part :  
-   **getArrayFromString(string)** : get array from string  
-   **getGeneratePass()** : get generated password  
-   **getImgName(name)** : get image name
-   **getMailer()** : get mailer  
-   **getMessage(message)** : get message  

Setter part :  
-   **setAuth(pass, user, res)** : set JWT  
-   **setImage(inputImg, outputImg)** : set image  
-   **setThumbnail(inputImg, outputImg)** : set thumbnail  

---

## Usage

1.  Copy the `.env.example` file to your project root, rename it `.env` & replace values with your own values
2.  Add `const nem = require("nemjs")` where you need (file or function top level)
3.  Then use it like in these examples : 
    -  `router.get("/", nem.checkAuth, UserCtrl.list)`  
    -  `nem.setAuth(guest.password, user, res)`  
    -  `if (nem.checkEmail(guest.email)) { ... }`  
    -  `if (nem.checkString(guest.name)) { ... }`  
    -  `if (nem.checkPass(guest.password)) { ... }`  
    -  `let pass = nem.getGeneratePass();`  
    -  `if (nem.checkNumber(item.price, 1, 500)) { ... }`  
    -  `if (nem.checkUrl(item.url)) { ... }`  
    -  `nem.setImage(uploadImage, newImage);`  
    -  `nem.setThumbnail(uploadImage, newImage);`  
    -  `const mailer = nem.getMailer()`  
    -  `let message = nem.getMessage(req)`  
