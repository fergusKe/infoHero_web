#!/usr/bin/env Rscript
library(rpart)
library(randomForest)
library(randomForestSRC)


args <- commandArgs(trailingOnly=TRUE)
if( length(args) == 0 ){
	stop( "必須輸入處理的檔案名稱!", call.=FALSE )
}
filename <- args[1]
# "/Users/brianpan/Desktop/infoHero_heatmap/model/"
current_path <- args[2]

# random forest 
rf_feature_rdata <- paste(current_path, "rdata/rf_features.RData", sep="")
load(rf_feature_rdata)
rf_model_rdata <- paste(current_path, "rdata/rf_model.RData", sep="")
load(rf_model_rdata)
rf_src_model_rdata <- paste(current_path, "rdata/rf_src_model.RData", sep="")
load(rf_src_model_rdata)

# decision tree
dt_model_rdata <- paste(current_path, "rdata/dt_model.RData", sep="")
load(dt_model_rdata)

# data preprocess
# test
target_file <- paste(current_path, "../uploads/", filename, ".csv", sep="")

dataframe <- read.csv(target_file)
original <- dataframe

# preprocess
dataframe <- transform( dataframe, OCCUPATION.無工作=(OCCUPATION == "無工作") )
dataframe <- transform( dataframe, OCCUPATION.不詳=(OCCUPATION == "不詳") )
dataframe <- transform( dataframe, X1.4.5.6=(X1+X4+X5+X6))

# edu hash
edu_hash_file <- paste(current_path, "rdata/edu.RData", sep="")
load(edu_hash_file)
# MAIMED hash
maimed_hash_file <- paste(current_path, "rdata/maimed.RData", sep="")
load(maimed_hash_file)

edu_match <- function(x){
	if(x=="" || x=="不詳"){
		NA
	}
	else{
		edu_hash[[x]]
	}
}

maimed_match <- function(x){
	if(x==""){
		NA
	}
	else{
		maimed_hash[[x]]
	}
}

train_data <- read.csv( paste(current_path, "sample.csv", sep="") )
train_data <- na.omit(train_data)
train_data <- transform(train_data, OCCUPATION.無工作=(OCCUPATION=="無工作"))
train_data <- transform(train_data, OCCUPATION.不詳=(OCCUPATION=="不詳"))
train_data$EDUCATION <- factor(train_data$EDUCATION)
train_data$MAIMED <- factor(train_data$MAIMED)
train_data <- subset(train_data, select=rf_predictors)

levels(dataframe$EDUCATION) <- sapply( levels(dataframe$EDUCATION), edu_match )
dataframe$EDUCATION <- factor(dataframe$EDUCATION)

levels(dataframe$MAIMED) <- sapply( levels(dataframe$MAIMED), maimed_match )
dataframe$MAIMED <- factor(dataframe$MAIMED)

dataframe <- subset(dataframe, select=rf_predictors)

# output result
# 先用資料合併讓factor在test data裏都有
new <- rbind( dataframe, train_data )
full_result <- predict( model_rf, new )

# 抓真實測試資料 
test_dim <- dim(dataframe)[1]
rf_test_predict <- round( full_result[1:test_dim] )

rf_src_predict <- round( predict(model_rf_src, new)$predicted )
rf_src_predict <- rf_src_predict[1:test_dim]

original$風險指數 <- rf_src_predict

# save
dist_file <- paste( current_path, "../outputs/", filename, "-predicted", ".csv", sep="" )
write.csv(original, dist_file)
