# heatmap

# 預測模型csv 上傳

這裏是把模型包裝成網頁後所需要的檔案
目前使用php作為後端語言，透過ajax去呼叫背後controller來跑r script

另外模型的code放在其他repository

- controller
  - export_model.php
  呼叫後端r model的php
  - _config.php
  存放環境變數的php

- model
  - testcases
  下載template的位置，目前使用template_v1.csv
  - rdata
  存放model輸出的rData
  - sample.csv
  資料集，拿來補齊randomForest必要的category
  - website_model.r
  把讀進來的model輸出成csv檔案，這裏要讀入環境變數

- outputs
  存放輸出csv的資料夾

- uploads
  存放上傳的csv  
