---
{{- $name := replace .File.ContentBaseName `-` ` ` -}}
{{- $url := printf "%s/" $name }}
title: "{{- $name -}}"
date: {{ .Date }}
description: "תיאור הפוסט למנועי חיפוש"
author: נמרוד איזנברג
type: page
guid: {{ absURL "" }}{{ $url | urlize }}
draft: true
toc: false
comments: true
showdate: false
---
תוכן הפוסט
