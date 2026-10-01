export type VehiclePhoto = { src: string; alt: string; author: string; license: string; licenseUrl?: string; source: string };

// Иллюстративные фото (Wikimedia Commons, свободные лицензии). Это не снимки конкретных машин каталога.
const POOLS: Record<string, VehiclePhoto[]> = {
  "avtokran": [
    {"src": "/vehicles/avtokran-1.jpg", "alt": "Автокран на городской улице", "author": "derivative work by High Contrast (mainly cropping and colour", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/", "source": "https://commons.wikimedia.org/wiki/File:MAZ-5335_based_crane_truck.jpg"},
    {"src": "/vehicles/avtokran-2.jpg", "alt": "Автокран на городской улице", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Telescope_crane_Klintsy.jpg"},
    {"src": "/vehicles/avtokran-3.jpg", "alt": "Автокран на городской улице", "author": "Nikolai Bulykin", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%B8%D0%B5_%D0%9B%D1%83%D0%BA%D0%B8,_%D0%A3%D1%80%D0%B0%D0%BB-%D0%BA%D1%80%D0%B0%D0%BD_%D0%BD%D0%B0_%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D0%BE%D0%BC_%D0%BC%D0%BE%D1%81%D1%82%D1%83_%D0%B7%D0%B8%D0%BC%D0%BE%D0%B9_(1).jpg"},
    {"src": "/vehicles/avtokran-4.jpg", "alt": "Автокран на городской улице", "author": "Nikolai Bulykin", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B5%D0%BB%D0%B8%D0%BA%D0%B8%D0%B5_%D0%9B%D1%83%D0%BA%D0%B8,_%D0%A3%D1%80%D0%B0%D0%BB-%D0%BA%D1%80%D0%B0%D0%BD_%D0%BD%D0%B0_%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D0%BE%D0%BC_%D0%BC%D0%BE%D1%81%D1%82%D1%83_%D0%B7%D0%B8%D0%BC%D0%BE%D0%B9_(2).jpg"},
    {"src": "/vehicles/avtokran-5.jpg", "alt": "Автокран на городской улице", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Chelyabinsk_crane,_plus_series.jpg"},
    {"src": "/vehicles/avtokran-6.jpg", "alt": "Автокран на шасси Урал у здания", "author": "Ирина Алексеевна Иващенко", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0", "source": "https://commons.wikimedia.org/wiki/File:%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D1%80%D0%B0%D0%BD_%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D0%B5%D1%86_%D0%A1%D0%A2.jpg"},
    {"src": "/vehicles/avtokran-7.jpg", "alt": "Автокран МКАТ-40 на шасси КрАЗ во дворе", "author": "Aleksey Churushkin", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:%D0%90%D0%B2%D1%82%D0%BE%D0%BA%D1%80%D0%B0%D0%BD_%D0%9C%D0%9A%D0%90%D0%A2-40_%D0%9C%D0%BE%D0%BD%D1%82%D0%B0%D0%B6%D1%81%D0%BF%D0%B5%D1%86%D1%81%D1%82%D1%80%D0%BE%D1%8F_%D0%BD%D0%B0_%D0%B1%D0%B0%D0%B7%D0%B5_%D0%9A%D1%80%D0%B0%D0%B7%D0%B0_%D0%BF%D1%80%D0%B8_%D0%BF%D0%BE%D1%82%D0%B5%D1%80%D0%B8_%D1%80%D0%B0%D0%B2%D0%BD%D0%BE%D0%B2%D0%B5%D1%81%D0%B8%D1%8F_%D0%B2_%D1%85%D0%BE%D0%B4%D0%B5_%D0%B0%D0%B2%D0%B0%D1%80%D0%B8%D0%B8.jpg"},
    {"src": "/vehicles/avtokran-8.jpg", "alt": "Старый автокран на шасси ЗИЛ", "author": "kallerna", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:Truck_in_Omni_Hotel_Murmansk.jpg"},
    {"src": "/vehicles/avtokran-9.jpg", "alt": "Автокран на городской улице после дождя", "author": "Tbatb", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:A_Nissan_Diesel_Crane_Truck_in_Hsinchu_City.jpg"},
    {"src": "/vehicles/avtokran-10.jpg", "alt": "Автокраны на стоянке", "author": "Hunini", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:JGSDF_Truck_crane(FUSO)_in_ookubo_20130526.JPG"},
    {"src": "/vehicles/avtokran-11.jpg", "alt": "Автокран на строительной площадке", "author": "N509FZ", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:A_XCMG_QY25G_at_Bei%27anhe_(20161001160812).jpg"},
    {"src": "/vehicles/avtokran-12.jpg", "alt": "Автокран на обочине дороги", "author": "N509FZ", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:A_XCMG_QY25K_at_Tundian_(20161001152910).jpg"},
    {"src": "/vehicles/avtokran-13.jpg", "alt": "Автокран на городской улице", "author": "Alex Blokha", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:XCMG_QY50K_in_Dnipro_(cropped).jpg"},
    {"src": "/vehicles/avtokran-14.jpg", "alt": "Автокран у сквера", "author": "Alex Blokha", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Xcmg_crane_QY25k5d_in_Dnipro.jpg"},
    {"src": "/vehicles/avtokran-15.jpg", "alt": "Автокран на перекрёстке", "author": "Alex Blokha", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Xcmg_xct35_in_Dnipro.jpg"},
    {"src": "/vehicles/avtokran-16.jpg", "alt": "Автокран на улице вечером", "author": "Alex Blokha", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Zoomlion_crane.jpg"},
  ],
  "avtovyshka": [
    {"src": "/vehicles/avtovyshka-1.jpg", "alt": "Автовышка с люлькой на стреле", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Cherry_picker_UAZ.jpg"},
    {"src": "/vehicles/avtovyshka-2.jpg", "alt": "Автовышка с люлькой на стреле", "author": "Alex Blokha", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Man_Multitel_cherry_picker._Blokha_2.jpg"},
    {"src": "/vehicles/avtovyshka-3.jpg", "alt": "Автовышка с люлькой на стреле", "author": "Artyom Svetlov", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Moscow_overhead_contact_line_2024-09_1727172864.jpg"},
    {"src": "/vehicles/avtovyshka-4.jpg", "alt": "Автовышка с люлькой на стреле", "author": "Artyom Svetlov", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Moscow_overhead_contact_line_2024-09_1727172887.jpg"},
    {"src": "/vehicles/avtovyshka-5.jpg", "alt": "Автовышка с люлькой на стреле", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:GAZ_bucket_truck.jpg"},
    {"src": "/vehicles/avtovyshka-6.jpg", "alt": "Автовышка с люлькой на стреле", "author": "RG72", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Lavado_de_fasado_de_la_konstrua%C4%B5o_en_strato_Vorovskij_2,_Tjumeno.jpg"},
    {"src": "/vehicles/avtovyshka-7.jpg", "alt": "Автовышка на шасси грузовика на парковке", "author": "Grendelkhan", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:City_of_Campbell_work_truck_with_cherry_picker,_front_view.jpg"},
    {"src": "/vehicles/avtovyshka-8.jpg", "alt": "Автовышка на обрезке деревьев", "author": "Grendelkhan", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:Workers_trimming_a_tree_using_a_cherry_picker.jpg"},
    {"src": "/vehicles/avtovyshka-9.jpg", "alt": "Автовышка на обслуживании освещения", "author": "Captainmorlypogi1959", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Celcor_employees_in_Aerial_work_platforms_in_Cabanatuan_(10).jpg"},
    {"src": "/vehicles/avtovyshka-10.jpg", "alt": "Автовышка у столба линии связи", "author": "Captainmorlypogi1959", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Celcor_employees_in_Aerial_work_platforms_in_Cabanatuan_(12).jpg"},
    {"src": "/vehicles/avtovyshka-11.jpg", "alt": "Автовышка на шасси грузовика", "author": "Fumikas Sagisavas", "license": "общественное достояние (CC0)", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "source": "https://commons.wikimedia.org/wiki/File:Aerial_work_platform_-_%E8%8B%8FDM06S9.jpg"},
    {"src": "/vehicles/avtovyshka-12.jpg", "alt": "Автовышки на стоянке", "author": "Oleg Yunakov", "license": "общественное достояние (CC0)", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "source": "https://commons.wikimedia.org/wiki/File:Altec_bucket_trucks.jpg"},
    {"src": "/vehicles/avtovyshka-13.jpg", "alt": "Автовышка на шасси фургона", "author": "Ypsilon from Finland", "license": "общественное достояние (CC0)", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "source": "https://commons.wikimedia.org/wiki/File:Janneniska_Ruthmann_Aerial_Work_Platform.jpg"},
    {"src": "/vehicles/avtovyshka-14.jpg", "alt": "Красная автовышка на шасси грузовика", "author": "Kaspar C from Barbados", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "source": "https://commons.wikimedia.org/wiki/File:Terex_bucket_truck_-_Watertown_South_Dakota._(4230258930).jpg"},
    {"src": "/vehicles/avtovyshka-15.jpg", "alt": "Автовышка на шасси ЗИЛ", "author": "Alex Blokha", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Cherry_picker_truck_BC_22._Blokha.jpg"},
    {"src": "/vehicles/avtovyshka-16.jpg", "alt": "Автовышка на шасси малотоннажного грузовика", "author": "Sayyam.pk", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Aerial_Platform_with_Telescopic_Boom.jpg"},
    {"src": "/vehicles/avtovyshka-17.jpg", "alt": "Автовышка с поднятой люлькой у здания", "author": "Celaplatform", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Aerial_working_platform.jpg"},
    {"src": "/vehicles/avtovyshka-18.jpg", "alt": "Автовышка на шасси малого грузовика", "author": "Sarkana from Berlin, Deutschland", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "source": "https://commons.wikimedia.org/wiki/File:Multitel_MX_200_(082313).jpg"},
  ],
  "ekskavator": [
    {"src": "/vehicles/ekskavator-1.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Hitachi_Zaxis_200_(Solvychegodsk).jpg"},
    {"src": "/vehicles/ekskavator-2.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Jonathan Cutrer", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Komatsu_PC650LC-11_crawler_hydraulic_excavator.jpg"},
    {"src": "/vehicles/ekskavator-3.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Daderot", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:Komatsu_excavator_-_Arlington,_MA.jpg"},
    {"src": "/vehicles/ekskavator-4.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Tiia Monto", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/", "source": "https://commons.wikimedia.org/wiki/File:Komatsu_excavator_2.jpg"},
    {"src": "/vehicles/ekskavator-5.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Artaxerxes", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "source": "https://commons.wikimedia.org/wiki/File:Komatsu_PC50MR_excavator_Elliot_Street_downtown_Brattleboro_VT_May_2025.jpg"},
    {"src": "/vehicles/ekskavator-6.jpg", "alt": "Гусеничный экскаватор в каменном карьере", "author": "This Photo was taken by Timothy A. Gonsalves. Feel free t…", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:JCB_Excavator_Padum_Purney_Road_Tsarap_Oct22_A7C_04402.jpg"},
    {"src": "/vehicles/ekskavator-7.jpg", "alt": "Гусеничный экскаватор у дороги", "author": "Artaxerxes", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Kobelco_SK260_Excavator_Hardwick_VT_August_2017.jpg"},
    {"src": "/vehicles/ekskavator-8.jpg", "alt": "Гусеничный экскаватор на насыпи", "author": "Elmschrat", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:01-Hyundai-bagger-auf_deich.JPG"},
    {"src": "/vehicles/ekskavator-9.jpg", "alt": "Гусеничный экскаватор на вырубке", "author": "TaaviAltpuu", "license": "общественное достояние (CC0)", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "source": "https://commons.wikimedia.org/wiki/File:Dipperfox_SC_850_Pro_Stump_Auger_Excavator_Attachment.jpg"},
    {"src": "/vehicles/ekskavator-10.jpg", "alt": "Гусеничный экскаватор на площадке", "author": "Vogler", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Hyundai_180LCD-7.jpg"},
    {"src": "/vehicles/ekskavator-11.jpg", "alt": "Гусеничный экскаватор на стройке", "author": "Fumikas Sagisavas", "license": "общественное достояние (CC0)", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "source": "https://commons.wikimedia.org/wiki/File:Hyundai_excavator_215-VS.jpg"},
    {"src": "/vehicles/ekskavator-12.jpg", "alt": "Мини-экскаватор на улице", "author": "Fumikas Sagisavas", "license": "общественное достояние (CC0)", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "source": "https://commons.wikimedia.org/wiki/File:Hyundai_excavator_60-VS.jpg"},
    {"src": "/vehicles/ekskavator-13.jpg", "alt": "Гусеничный экскаватор в поле", "author": "Oscar Taylor", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "source": "https://commons.wikimedia.org/wiki/File:Fiat-Hitachi_excavator_-_geograph.org.uk_-_7693372.jpg"},
    {"src": "/vehicles/ekskavator-14.jpg", "alt": "Гусеничный экскаватор в зарослях", "author": "Adityamadhav83", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:Hitachi_Excavator_at_Pamulapalli.jpg"},
    {"src": "/vehicles/ekskavator-15.jpg", "alt": "Гусеничный экскаватор в лесу", "author": "Asurnipal", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Sonntag-Buchboden-Gadental-Hitachi_Hydraulic_Excavator_EX35-2_(19,1_kW)-01ASD.jpg"},
  ],
  "buldozer": [
    {"src": "/vehicles/buldozer-1.jpg", "alt": "Гусеничная техника с отвалом", "author": "Denis Blisch", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/", "source": "https://commons.wikimedia.org/wiki/File:%D0%96%D0%B5%D0%BB%D1%82%D1%8B%D0%B9_%D0%B1%D1%83%D0%BB%D1%8C%D0%B4%D0%BE%D0%B7%D0%B5%D1%80.jpg"},
    {"src": "/vehicles/buldozer-6.jpg", "alt": "Бульдозер на расчистке снега в горах", "author": "This Photo was taken by Timothy A. Gonsalves. Feel free t…", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Bulldozer_Snow_Clearance_Shinko_La_Lungnak_Jun24_A7CR_00326.jpg"},
    {"src": "/vehicles/buldozer-7.jpg", "alt": "Старый бульдозер на песчаной площадке", "author": "CEphoto, Uwe Aranas", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:Da-Nang_Vietnam_KOMATSU-D60A-bulldozer-01.jpg"},
    {"src": "/vehicles/buldozer-8.jpg", "alt": "Бульдозер на отсыпке грунта", "author": "Taneli Mielikäinen from Menlo Park, USA", "license": "CC BY-SA 2.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0", "source": "https://commons.wikimedia.org/wiki/File:Liebherr_bulldozer_in_Finland.jpg"},
    {"src": "/vehicles/buldozer-9.jpg", "alt": "Бульдозер на площадке зимой", "author": "Ordercrazy", "license": "общественное достояние (CC0)", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "source": "https://commons.wikimedia.org/wiki/File:Liebherr_732_L.jpg"},
    {"src": "/vehicles/buldozer-10.jpg", "alt": "Бульдозер на стройке зимой", "author": "Ordercrazy", "license": "общественное достояние (CC0)", "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "source": "https://commons.wikimedia.org/wiki/File:Liebherr_R914_und_732_L_(05).jpg"},
    {"src": "/vehicles/buldozer-11.jpg", "alt": "Бульдозер на снежной площадке", "author": "artden6@rambler.ru", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:LLC_Laukar_bulldozer_T-35.01.jpg"},
    {"src": "/vehicles/buldozer-12.jpg", "alt": "Бульдозер расчищает снег у дома", "author": "Mount Rainier National Park from Ashford, WA, United States", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "source": "https://commons.wikimedia.org/wiki/File:2018-05-31_Sunrise_snow_removal_(28625954268).jpg"},
    {"src": "/vehicles/buldozer-13.jpg", "alt": "Бульдозер в снежном завале", "author": "GlacierNPS", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "source": "https://commons.wikimedia.org/wiki/File:4-5-12-Plowing_snow_in_the_Many_Glacier_Valley_-_1_(6966734790).jpg"},
    {"src": "/vehicles/buldozer-14.jpg", "alt": "Бульдозер на расчистке снега", "author": "GlacierNPS", "license": "общественное достояние", "source": "https://commons.wikimedia.org/wiki/File:4-5-12-Plowing_snow_in_the_Many_Glacier_Valley_-_4_(6966728112).jpg"},
    {"src": "/vehicles/buldozer-15.jpg", "alt": "Бульдозер расчищает снег", "author": "Игоревич", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:DT-75_bulldozer_near_Belokurikha_2.JPG"},
    {"src": "/vehicles/buldozer-16.jpg", "alt": "Бульдозеры на зимней дороге", "author": "Yellowstone National Park", "license": "общественное достояние", "source": "https://commons.wikimedia.org/wiki/File:Plowing_operations_3.28.17_(8)_(33715229176).jpg"},
  ],
  "bus": [
    {"src": "/vehicles/bus-1.jpg", "alt": "Вахтовый автобус на шасси КАМАЗ", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:KamAZ-43502_bus_and_truck_(01).jpg"},
    {"src": "/vehicles/bus-2.jpg", "alt": "Вахтовый автобус на шасси КАМАЗ", "author": "Georg Pik", "license": "общественное достояние (CC0)", "source": "https://commons.wikimedia.org/wiki/File:KamAZ-43502_bus_and_truck_(02).jpg"},
    {"src": "/vehicles/bus-3.jpg", "alt": "Вахтовый автобус на шасси Урал", "author": "Artem Svetlov", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "source": "https://commons.wikimedia.org/wiki/File:Ural_Next_shift_bus_with_methane-diesel_engine.jpg"},
    {"src": "/vehicles/bus-4.jpg", "alt": "Вахтовый автобус на шасси Урал на стоянке", "author": "Artem Svetlov", "license": "CC BY 2.0", "licenseUrl": "https://creativecommons.org/licenses/by/2.0", "source": "https://commons.wikimedia.org/wiki/File:Ural_Next_shift_bus%E2%84%962.jpg"},
    {"src": "/vehicles/bus-5.jpg", "alt": "Синий вахтовый автобус на шасси Урал", "author": "Andshel", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B0%D1%85%D1%82%D0%BE%D0%B2%D1%8B%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%B1%D1%83%D1%81_%D0%A3%D1%80%D0%B0%D0%BB-32552-3013-59.JPG"},
    {"src": "/vehicles/bus-6.jpg", "alt": "Вахтовый автобус на шасси Урал зимой", "author": "Andshel", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B0%D1%85%D1%82%D0%BE%D0%B2%D1%8B%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%B1%D1%83%D1%81_%D0%A3%D1%80%D0%B0%D0%BB_%D0%9D%D0%B5%D0%BA%D1%81%D1%82.jpg"},
    {"src": "/vehicles/bus-7.jpg", "alt": "Вахтовый автобус на шасси Урал", "author": "Uralmir", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:%D0%92%D0%B0%D1%85%D1%82%D0%BE%D0%B2%D1%8B%D0%B9_%D0%B0%D0%B2%D1%82%D0%BE%D0%B1%D1%83%D1%81_%D0%BD%D0%B0_%D0%BA%D0%BE%D0%BC%D0%B1%D0%B8%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%BE%D0%BC_%D1%85%D0%BE%D0%B4%D1%83.jpg"},
    {"src": "/vehicles/bus-8.jpg", "alt": "Вахтовый автобус на шасси КАМАЗ", "author": "Alexey8601", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:2015.04.01_nefaz-4208.jpg"},
  ],
  "legkovye": [
    {"src": "/vehicles/legkovye-1.jpg", "alt": "Легковой внедорожник УАЗ", "author": "alex74_2011", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "source": "https://commons.wikimedia.org/wiki/File:2018_UAZ_Patriot_Expedition_front.jpg"},
    {"src": "/vehicles/legkovye-2.jpg", "alt": "Легковой внедорожник УАЗ", "author": "Sergey A. Demidov / Sergey A. Demidov", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0/", "source": "https://commons.wikimedia.org/wiki/File:20250716_UAZ_Patriot_in_Zelenograd.jpg"},
    {"src": "/vehicles/legkovye-3.jpg", "alt": "УАЗ Патриот зимой во дворе", "author": "Dogs.barking.duster.rolling", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:UAZ_Patriot_(1).jpg"},
    {"src": "/vehicles/legkovye-4.jpg", "alt": "УАЗ Патриот на парковке", "author": "Alekc2m", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:UAZ_Patriot_Sport_01.jpg"},
    {"src": "/vehicles/legkovye-5.jpg", "alt": "УАЗ Патриот на улице", "author": "Alekc2m", "license": "CC BY-SA 3.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0", "source": "https://commons.wikimedia.org/wiki/File:UAZ_Patriot_Sport_02.jpg"},
    {"src": "/vehicles/legkovye-6.jpg", "alt": "Toyota Land Cruiser 70 у здания", "author": "Alekc2m", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Toyota_Land_Cruiser_70_(2014).jpg"},
    {"src": "/vehicles/legkovye-7.jpg", "alt": "Toyota Land Cruiser 200 у здания", "author": "Сергей Михель", "license": "CC BY 4.0", "licenseUrl": "https://creativecommons.org/licenses/by/4.0", "source": "https://commons.wikimedia.org/wiki/File:Toyota_Land_Cruiser_%D0%B2_%D0%9E%D0%BC%D1%81%D0%BA%D0%B5.jpg"},
    {"src": "/vehicles/legkovye-8.jpg", "alt": "Lada Niva на стоянке", "author": "DerSporti", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:2021_AwtoWAS_21214_Lada_Niva_Legend_Urban,_Sondermodell_Black.jpg"},
    {"src": "/vehicles/legkovye-9.jpg", "alt": "Lada Niva на парковке", "author": "DerSporti", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:2021_AwtoWAS_21214_Lada_Niva_Legend_Urban_Sondermodell_Black,_Ansicht_von_schr%C3%A4g_hinten.jpg"},
    {"src": "/vehicles/legkovye-10.jpg", "alt": "Пикап Toyota Hilux на парковке", "author": "Ethan Llamas", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:2006_Toyota_Hilux_2.5_J_4x2,_06-16-2024.jpg"},
    {"src": "/vehicles/legkovye-11.jpg", "alt": "Пикап Toyota Hilux", "author": "Ethan Llamas", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:2009_Toyota_Hilux_3.0_G_4x4.jpg"},
    {"src": "/vehicles/legkovye-12.jpg", "alt": "Пикап Toyota Hilux у дома", "author": "Ethan Llamas", "license": "CC BY-SA 4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0", "source": "https://commons.wikimedia.org/wiki/File:Toyota_Hilux_2.4_E_4x2_2020.jpg"},
  ],
};

// Тип техники определяется по началу адреса карточки (так названы все машины каталога)
const POOL_BY_PREFIX: [string, string][] = [
  ["avtokran-", "avtokran"],
  ["avtovyshka-", "avtovyshka"],
  ["gusenichnyy-ekskavator", "ekskavator"],
  ["buldozer", "buldozer"],
  ["vahtovyy-avtobus", "bus"],
  ["legkovye-ts", "legkovye"],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Стартовое фото для машин каталога: подобрано так, чтобы у машин одного типа не совпадали обложки.
// Для новых машин старт считается по адресу карточки.
const START: Record<string, number> = {
  "avtokran-25t-harjaginskiy": 0,
  "avtokran-25t-naryan-mar": 1,
  "avtokran-25t-pechora": 3,
  "avtokran-25t-sosnogorsk": 5,
  "avtokran-25t-strela-22-33m": 7,
  "avtokran-25t-syktyvkar": 8,
  "avtokran-25t-uhta": 10,
  "avtokran-25t-vorkuta": 12,
  "avtokran-50t-strela-do-34m": 14,
  "avtovyshka-agp-strela-do-33m": 0,
  "avtovyshka-agp-uhta": 9,
  "buldozer-harjaginskiy": 0,
  "buldozer-kozhva": 1,
  "buldozer-naryan-mar": 3,
  "buldozer-otval-do-5m3": 5,
  "buldozer-pechora": 6,
  "buldozer-sosnogorsk": 8,
  "buldozer-usinsk": 10,
  "gusenichnyy-ekskavator-harjaginskiy": 0,
  "gusenichnyy-ekskavator-kovsh-1-2m3": 1,
  "gusenichnyy-ekskavator-kozhva": 3,
  "gusenichnyy-ekskavator-naryan-mar": 5,
  "gusenichnyy-ekskavator-sosnogorsk": 6,
  "gusenichnyy-ekskavator-syktyvkar": 8,
  "gusenichnyy-ekskavator-uhta": 10,
  "gusenichnyy-ekskavator-usinsk": 11,
  "gusenichnyy-ekskavator-vorkuta": 13,
  "legkovye-ts-do-8-mest": 0,
  "legkovye-ts-sosnogorsk": 6,
  "vahtovyy-avtobus-22-28-mest": 0,
  "vahtovyy-avtobus-harjaginskiy": 1,
  "vahtovyy-avtobus-kozhva": 2,
  "vahtovyy-avtobus-pechora": 4,
  "vahtovyy-avtobus-usinsk": 5,
  "vahtovyy-avtobus-vorkuta": 6,
};

// Несколько разных фото для карточки: стартовое фото и шаг по пулу зависят от адреса,
// поэтому у соседних машин одного типа наборы и порядок снимков различаются.
export function vehiclePhotos(slug: string, count = 4): VehiclePhoto[] {
  const pool = POOL_BY_PREFIX.find(([prefix]) => slug.startsWith(prefix));
  if (!pool) return [];
  const photos = POOLS[pool[1]];
  const n = photos.length;
  if (n === 0) return [];
  const start = (START[slug] ?? hash(slug)) % n;
  let step = n > 1 ? 1 + (hash(`${slug}#step`) % (n - 1)) : 1;
  while (gcd(step, n) !== 1) step++;
  return Array.from({ length: Math.min(count, n) }, (_, i) => photos[(start + i * step) % n]);
}

export function vehiclePhoto(slug: string): VehiclePhoto | null {
  return vehiclePhotos(slug, 1)[0] ?? null;
}
