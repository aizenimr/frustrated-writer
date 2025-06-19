---
{{- $name := replaceRE "([0-9]{4}-[0-9]{2}-[0-9]{2}-)(.)" "$2" .Name -}}
{{ $url := printf "%s%s/" (now.Format "2006/01/02/") $name }}
title: "{{ replace $name "-" " " | title }}" # Title of the blog post.
date: {{ .Date }}
description: "תיאור הפוסט למנועי חיפוש"
author: נמרוד איזנברג
type: post
url: /{{ $url }}
guid: {{ absURL "" }}{{ $url | urlize }}
year: {{ now.Format "2006" }}
month: {{ now.Format "2006/01" }}
featureImage: /images/{{ now.Format "2006/01" }}/XXXXX.png
featureImageAlt: תיאור של התמונה
category:
  - כללי
tags:
  - כתיבה
keywords: 
draft: false
toc: false
comment: true
---
תוכן הפוסט
