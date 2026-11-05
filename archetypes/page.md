---
{{- $name := replace .File.ContentBaseName `-` ` ` -}}
{{- $url := printf "%s/" $name }}
title: "{{- $name -}}"
date: {{ .Date }}
summary: "תיאור הפוסט למנועי חיפוש"
author: נמרוד איזנברג
type: page
guid: {{ absURL "" }}{{ $url | urlize }}
draft: false
showtoc: false
comments: true
hidemeta: true
hiddenInRss: true
---
תוכן הפוסט
