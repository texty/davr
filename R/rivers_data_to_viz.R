library(dplyr)
library(stringr)
library(rlist)
library(tidyr)
library(tidyverse)
library(lubridate) 

standart <- data.frame(
  key = c("Перманганатна.окислюваність..мгО.дм3",
          "Синтетичні.поверхнево.активні.речовини..аніонні...мг.дм3",
          "БСК5..МгО.дм3", 
          "Завислі..суспендовані..речовини..мг.дм3", 
          "Кисень.розчинений.МгО2.дм3", 
          "Сульфат.іони..мг.дм3", 
          "Хлорид.іони..мг.дм3", 
          "Амоній.іони..мг.дм3", 
          "Фітопланктон..тис.клітин.дм3",
          "Нітрат.іони..мг.дм3", 
          "Нітрит.іони..мг.дм3",
          "Атразин..мкг.дм3",
          "Хімічне.споживання.кисню..мгО.дм3"),
  norm = c(3,
           10, 
           3, 
           15, 
           4, 
           100, 
           300, 
           0.5, 
           10,
           40, 
           0.08,
           5,
           9),
  doc = c("ДСТУ",
          "ДСТУ",
          "ОБУВ",
          "ОБУВ",
          "ОБУВ",
          "ОБУВ",
          "ОБУВ",
          "ОБУВ",
          "ДСТУ",
          "ОБУВ",
          "ОБУВ",
          "ОБУВ",
          "ДСТУ")
)

origin_keys = c("Azot",
                "BSK5",
                "Zavisli",
                "Kisen",
                "Sulfat",
                "Hlorid",
                "Amoniy",
                "Nitrat",
                "Nitrit",
                "Fosfat",
                "SPAR",
                "Permanganat",
                "HSK",
                "Fitoplan",
                "Atrazin",
                "Simazin"
)
translated_keys = c("Азот.загальний..мг.дм3", 
                    "БСК5..МгО.дм3", 
                    "Завислі..суспендовані..речовини..мг.дм3",
                    "Кисень.розчинений.МгО2.дм3",
                    "Сульфат.іони..мг.дм3",
                    "Хлорид.іони..мг.дм3",
                    "Амоній.іони..мг.дм3",
                    "Нітрат.іони..мг.дм3",
                    "Нітрит.іони..мг.дм3",
                    "Фосфат.іони..поліфосфати...мг.дм3",
                    "Синтетичні.поверхнево.активні.речовини..аніонні...мг.дм3", 
                    "Перманганатна.окислюваність..мгО.дм3",
                    "Хімічне.споживання.кисню..мгО.дм3", 
                    "Фітопланктон..тис.клітин.дм3", 
                    "Атразин..мкг.дм3",
                    "Симазин..мкг.дм3"
)


#читаємо файл з даними держводагенства
setwd("/home/yevheniia/R/rivers")
init_data <- read.csv('/home/yevheniia/git/davr/origin_data/init_data.csv', header = T, sep=";", fileEncoding = 'utf-8') %>%
  mutate_all(as.character) %>%
  mutate(Дата.спостережень = as.Date(Дата.спостережень, format="%d.%m.%Y")) %>%
  gather(key, value, Азот.загальний..мг.дм3:Симазин..мкг.дм3) %>% 
  mutate(Широта = gsub(",", ".", Широта),
         Довгота = gsub(",", ".", Довгота),
         value = gsub(",", ".", value)
  ) %>% 
  rename(id = Ідентифікатор.ПС,
          name = Назва.ПС,
          lat = Широта,
          lon = Довгота,
          date =  Дата.спостережень,
          river = Район.річкового.басейну
          ) %>% 
  select(-Відомчий.код.ПС, -Назва.лабораторіҝ) %>% 
  mutate(date = as.character(date))

# на порталі відкритих даних є всі дані, 
# але старі чомусь містять менше інфи, ніж ті, що були в нас у 2018 році.
# Тому до наших старих приєднуємо нові дані після травня 2018 року.
setwd("/home/yevheniia/git/davr/origin_data/updates/")
files = list.files(pattern="*.csv")
updates = data.frame()
for(i in 1:length(files)){
  print(files[i])
  temp = read.csv(files[i], sep=";", stringsAsFactors = F) %>% 
    mutate_all(as.character) %>% 
    filter(Post_ID != "0") %>% 
    mutate(Controle_Date = parse_date_time(Controle_Date, orders = c('dmy', 'ymd'))) %>% 
    filter(Controle_Date > as.Date("2018-05-10"))
  
  updates = updates %>% bind_rows(temp)
}


getTranslatedKey = function(key) {
  myval = translated_keys[which(origin_keys == key)]
  return(myval)
}
vectorize_getTranslatedKey = Vectorize(getTranslatedKey)

updates = updates %>% 
  select(-X) %>% 
  gather(key, value, Azot:Simazin) %>% 
  mutate(key = vectorize_getTranslatedKey(key)) %>% 
  rename(id=Post_ID,
         name = Post_Name,
         river = Riverbas_Name,
         lat = Latitude,
         lon = Longitude,
         date = Controle_Date
  ) %>% 
  select(-Post_Code, -WaterLab_Name) %>% 
  mutate(date = as.character(date))

data = init_data %>% 
  bind_rows(updates) %>% 
  left_join(standart %>% mutate(key=as.character(key)), by="key") %>% 
  mutate(value = round(as.numeric(value), 2)) %>% 
  filter(value > 0) %>% 
  group_by(id, key)%>%
  mutate(mean = mean(value),
         norm = as.numeric(norm),
         lat = as.numeric(lat),
         lon = as.numeric(lon))%>%
  ungroup() %>% 
  mutate(dev = ifelse(norm > 0, (mean - norm), NA),
         size = ifelse(norm > 0, (mean/norm), NA)
         )  


unique_id =  data %>% select(id) %>% unique()

for(i in 1:length(unique_id$id)){
  nested <- data %>% 
    filter(id == unique_id$id[i]) %>% 
    group_by(id)  %>% 
    nest() %>% 
    ungroup() 
  
  filename = paste0("/home/yevheniia/git/davr/data/data_samples/", unique_id$id[i], ".json")
  nested %>% jsonlite::toJSON(na="null", pretty = TRUE) %>% writeLines(filename)
}

# дані для квіток на карті, за останній день
points_data <- data%>%
  group_by(id, key)%>%
  mutate(last_date = last(date))%>%
  filter(date == last_date)%>%
  ungroup()

write.csv(points_data, "/home/yevheniia/git/davr/data/lastDayMeanValue_2020_4.csv", fileEncoding = 'utf-8', row.names = F)


# #додаємо до файлу норми
# 
# 
# #переводимо в довгий формат
# draft_data <- file%>%
#   gather(key, value, Азот.загальний..мг.дм3:Симазин..мкг.дм3)

#додаємо показники норми
# standart$key <- as.character(standart$key)
# draft_data <- left_join(draft_data, standart, by="key")
# draft_data$value <- as.numeric(gsub(",", ".", gsub("\\.", "", draft_data$value)))
# 
# #рахуємо чи перевишує реальний показник норму
# draft_data$value <- as.numeric(draft_data$value)
# draft_data$norm <- as.numeric(draft_data$norm)
# 
# #залишаємо лише ті рядки, де є значення показника
# draft_data <- draft_data%>%
#   filter(value > 0)
# 
# #вираховуємо середній показник
# names(draft_data)[names(draft_data)=="Ідентифікатор.ПС"] <- "id"
# names(draft_data)[names(draft_data)=="Назва.ПС"] <- "name"
# 
# 
# draft_data <- draft_data %>%
#   group_by(id, key)%>%
#   mutate(mean = mean(value))%>%
#   ungroup()
# 
# draft_data$mean <- round(draft_data$mean, 2)
# 
# #рахуємо відхилення від норми
# draft_data$dev <- ifelse(draft_data$norm > 0, (draft_data$mean - draft_data$norm), NA)
# draft_data$dev_amount <- ifelse(draft_data$norm > 0, (draft_data$mean/draft_data$norm), NA)
# 
# 
# #фікисмо коми в координатах
# draft_data$Широта <- as.numeric(gsub(",", ".", gsub("\\.", "", draft_data$Широта)))
# draft_data$Довгота <- as.numeric(gsub(",", ".", gsub("\\.", "", draft_data$Довгота)))
# 
# 
# 
# names(draft_data)[names(draft_data)=="Широта"] <- "lat"
# names(draft_data)[names(draft_data)=="Довгота"] <- "lon"
# names(draft_data)[names(draft_data)=="Дата.спостережень"] <- "date"
# names(draft_data)[names(draft_data)=="dev_amount"] <- "size"
# names(draft_data)[names(draft_data)=="Район.річкового.басейну"] <- "river"
# 
# 
# draft_data$date <- as.Date(draft_data$date, format="%d.%m.%Y")
