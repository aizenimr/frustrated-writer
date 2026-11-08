---
{{- $name := replaceRE "([0-9]{4}-[0-9]{2}-[0-9]{2}-)(.)" "$2" .Name -}}
{{- $date := replaceRE "^([0-9]{4}-[0-9]{2}-[0-9]{2})-.*$" "$1" .Name -}}
{{- $url := printf "%s/%s/" (replace $date "-" "/") $name }}
title: "{{ replace $name "-" " " | title }}"
date: {{ $date }}
summary: "תיאור הפוסט למנועי חיפוש"
author: נמרוד איזנברג
type: post
guid: {{ absURL "" }}{{ $url | urlize }}
year: {{ substr $date 0 4 }}
month: {{ substr $date 0 7 }}
cover:
  image: /images/{{- replace (substr $date 0 7) "-" "/" -}}/XXXXX.png
  alt: תיאור של התמונה
categories:
  - כללי
tags:
  - כתיבה
draft: false
showtoc: false
comments: true
---
תוכן הפוסט
