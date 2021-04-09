library(dplyr)
setwd("/home/yevheniia/git/davr/data/")

oldData = read.csv("contaminants_2017.csv", stringsAsFactors = F) %>% 
  mutate(companyID = as.character(companyID)) %>% 
  mutate(companyID = trimws(companyID)) %>% 
  select(companyID, year2017)

newData = read.csv("contaminants_2018.csv", stringsAsFactors = F) %>% 
  mutate(companyID = as.character(companyID)) %>% 
  mutate(companyID = trimws(companyID))

data = merge(oldData, newData, by='companyID', all=TRUE)
