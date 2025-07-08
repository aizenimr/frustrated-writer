---
{{- $name := replace .File.ContentBaseName `-` ` ` -}}
{{- $url := printf "%s/" $name }}
title: "{{- $name -}}"
date: {{ .Date }}
description: "תיאור הפוסט למנועי חיפוש"
author: נמרוד איזנברג
type: page
url: /{{- .File.ContentBaseName }}
guid: {{ absURL "" }}{{ $url | urlize }}
draft: true
toc: false
comment: true
showdate: false
---
תוכן הפוסט
