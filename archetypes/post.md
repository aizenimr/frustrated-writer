---
title: "{{ replace .Name "-" " " | title }}" # Title of the blog post.
date: {{ .Date }}
description: "תיאור הפוסט למנועי חיפוש"
author: נמרוד איזנברג
type: post
url: {{ now.Format "2006/01/01" }}/{{ .Name }}/
year: {{ now.Format "2006" }}
month: {{ now.Format "2006/01" }}
featureImage: /images/{{ now.Format "2006/01" }}/XXXXX.png
featureImageAlt: תיאור של התמונה
category:
  - כללי
tags:
  - כתיבה
keywords: 
draft: true
toc: false
comment: true
---

**כתבו כאן את הפוסט**
