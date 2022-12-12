library(tidyverse)

df <- read.csv("data/mdc_hospital_price.csv")

head(df)

df$Year

df <- df %>%
  filter(Year == 2016)

print(df %>%
  group_by(Facility.Name, Facility.Id, dmc) %>%
  summarize(mean_cost=mean(Mean.Cost), mean_charge=mean(Mean.Charge)) %>%
  filter(dmc == 15))

df_new2 <- df %>%
  group_by(Facility.Name, Facility.Id) %>%
  summarize(mean_cost=mean(Mean.Cost), mean_charge=mean(Mean.Charge)) %>%
  ungroup() %>%
  mutate(avg_mdc_cost=mean(mean_cost),
         avg_mdc_charge=mean(mean_charge)) %>%
  ungroup() %>%
  mutate(cost_dif=mean_cost-avg_mdc_cost,
         charge_dif=mean_charge-avg_mdc_charge,
         cost_dif_rel=cost_dif/avg_mdc_cost,
         charge_dif_rel=charge_dif/avg_mdc_charge)

mean(df_new2$mean_cost)

write.csv(df_new2, "data/hospital_cost_analysis")

df_new <- df %>%
  group_by(Facility.Name, Facility.Id, dmc) %>%
  summarize(mean_cost=mean(Mean.Cost), mean_charge=mean(Mean.Charge)) %>%
  ungroup() %>%
  group_by(dmc) %>%
  mutate(avg_mdc_cost=mean(mean_cost),
         avg_mdc_charge=mean(mean_charge)) %>%
  ungroup() %>%
  mutate(cost_dif=mean_cost-avg_mdc_cost,
         charge_dif=mean_charge-avg_mdc_charge,
         cost_dif_rel=cost_dif/avg_mdc_cost,
         charge_dif_rel=charge_dif/avg_mdc_charge) 

write.csv(df_new, "data/type_charge_cost.csv")
