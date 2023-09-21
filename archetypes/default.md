+++
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
date = {{ .Date }}
month = {{ .Date | dateFormat "2006-01" }}
draft = true
+++
