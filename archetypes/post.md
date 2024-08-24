---
title: "{{ replace .Name "-" " " | title }}" # Title of the blog post.
date: {{ .Date }}
description: "תיאור הפוסט למנועי חיפוש"
author: נמרוד איזנברג
type: post
url: {{ $t := time.AsTime .Date }}/{{ $t.Year }}/{{ $t.Month | int }}/{{ $t.Day }}/{{ .Name }}/
featureImage: /images/{{ $t.Year }}/{{ $t.Month | int }}/XXXXX.png
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
