-- Виброкаток: категория + объявление в каждом городе (повторный запуск ничего не дублирует)

BEGIN;

-- Карточка владельца «Арендатра · город» там, где её ещё нет
INSERT INTO owners (id, name, description, phone, city, "isActive", "createdAt", "updatedAt")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || c.city), 1, 24),
       'Арендатра · ' || c.city,
       'Техника Арендатры в городе ' || c.city || '. Бронь подтверждает менеджер: звонки с 8:00 до 20:00, заявки на сайте круглосуточно. Работа по договору, наличный и безналичный расчёт.',
       '+79121263013', c.city, true, now(), now()
FROM (VALUES ($q$Усинск$q$), ($q$Нарьян-Мар$q$), ($q$Харьягинский$q$), ($q$Печора$q$), ($q$Воркута$q$), ($q$Ухта$q$), ($q$Сыктывкар$q$), ($q$Сосногорск$q$), ($q$Кожва$q$), ($q$Инта$q$), ($q$Вуктыл$q$), ($q$Емва$q$), ($q$Микунь$q$), ($q$Ижма$q$), ($q$Троицко-Печорск$q$), ($q$Визинга$q$), ($q$Усть-Цильма$q$), ($q$Койгородок$q$)) AS c(city)
WHERE NOT EXISTS (SELECT 1 FROM owners o WHERE o.name = 'Арендатра · ' || c.city);

INSERT INTO categories (id, "group", name, slug, "sortOrder")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok'), 1, 24), 'EARTHMOVING'::"CategoryGroup", 'Виброкаток грунтовый', 'vibrokatok', 3
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'vibrokatok');

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-usinsk'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-usinsk',
  $q$Сдаём в аренду грунтовый виброкаток LiuGong с машинистом. Ширина вальца 2130 мм, частота вибрации 30–33 Гц.

Подходит под отсыпку площадок и кустов, подъездные и временные дороги, основания под здания и плиты. Уплотняет песок, ПГС, щебень, суглинок.

Каток стоит на нашей базе в Парме, по Усинску и району подаём быстро. Пропуска на месторождения есть.

Заказ от 10 смен. Час работы 2200 ₽, при долгой аренде 2000 ₽. Договор, любой способ оплаты. Перед заказом скажите площадь и толщину слоёв, прикинем сколько смен нужно.$q$,
  2200, 80, $q$Усинск$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Усинск$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-naryan-mar'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-naryan-mar',
  $q$Грунтовый виброкаток LiuGong, валец 2130 мм, вибрация 30–33 Гц. Работает с нашим машинистом.

Берём работы по уплотнению отсыпки: площадки, кусты, дороги, основания под фундамент. Песок, щебень, ПГС, грунт.

До Нарьян-Мара каток идёт по зимнику или баржей в навигацию, поэтому срок подачи обговариваем заранее. Перевозку считаем отдельно.

Минимальный заказ от 10 смен, на день-два каток не даём. Цена 2200 ₽/час, на длительный срок 2000 ₽/час. Работаем по договору, наличный и безналичный расчёт. Звоните, посчитаем под ваш объём.$q$,
  2200, 80, $q$Нарьян-Мар$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Нарьян-Мар$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-harjaginskiy'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-harjaginskiy',
  $q$Есть свободный грунтовый каток LiuGong: валец 2130 мм, частота вибрации 30–33 Гц, машинист наш.

Укатываем песок, щебень и грунт под площадки, кустовые основания, временные дороги и фундаменты. Слоями, как положено по технологии.

На Харьягу везём тралом с базы в Усинске. Пропуска на месторождения оформлены, срок подачи согласуем при заявке.

Обязательное условие: от 10 смен. 2200 ₽ за час, если берёте надолго, будет 2000 ₽/час. Договор, оплата наличными или по безналу.$q$,
  2200, 80, $q$Харьягинский$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Харьягинский$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-pechora'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-pechora',
  $q$Сдаём в аренду грунтовый виброкаток LiuGong с машинистом. Ширина вальца 2130 мм, частота вибрации 30–33 Гц.

Подходит под отсыпку площадок и кустов, подъездные и временные дороги, основания под здания и плиты. Уплотняет песок, ПГС, щебень, суглинок.

Каток базируется в Усинске, в Печоре привозим тралом. Доставку считаем отдельно, сроки менеджер скажет сразу.

Заказ от 10 смен. Час работы 2200 ₽, при долгой аренде 2000 ₽. Договор, любой способ оплаты. Перед заказом скажите площадь и толщину слоёв, прикинем сколько смен нужно.$q$,
  2200, 80, $q$Печора$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Печора$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-vorkuta'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-vorkuta',
  $q$Грунтовый виброкаток LiuGong, валец 2130 мм, вибрация 30–33 Гц. Работает с нашим машинистом.

Берём работы по уплотнению отсыпки: площадки, кусты, дороги, основания под фундамент. Песок, щебень, ПГС, грунт.

В Воркуту каток отправляем с базы в Усинске, доставку и сроки считаем под конкретный объект.

Минимальный заказ от 10 смен, на день-два каток не даём. Цена 2200 ₽/час, на длительный срок 2000 ₽/час. Работаем по договору, наличный и безналичный расчёт. Звоните, посчитаем под ваш объём.$q$,
  2200, 80, $q$Воркута$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Воркута$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-uhta'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-uhta',
  $q$Есть свободный грунтовый каток LiuGong: валец 2130 мм, частота вибрации 30–33 Гц, машинист наш.

Укатываем песок, щебень и грунт под площадки, кустовые основания, временные дороги и фундаменты. Слоями, как положено по технологии.

Возим тралом из Усинска. Стоимость доставки в Ухте и срок подачи называем после звонка.

Обязательное условие: от 10 смен. 2200 ₽ за час, если берёте надолго, будет 2000 ₽/час. Договор, оплата наличными или по безналу.$q$,
  2200, 80, $q$Ухта$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Ухта$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-syktyvkar'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-syktyvkar',
  $q$Сдаём в аренду грунтовый виброкаток LiuGong с машинистом. Ширина вальца 2130 мм, частота вибрации 30–33 Гц.

Подходит под отсыпку площадок и кустов, подъездные и временные дороги, основания под здания и плиты. Уплотняет песок, ПГС, щебень, суглинок.

Каток базируется в Усинске, в Сыктывкаре привозим тралом. Доставку считаем отдельно, сроки менеджер скажет сразу.

Заказ от 10 смен. Час работы 2200 ₽, при долгой аренде 2000 ₽. Договор, любой способ оплаты. Перед заказом скажите площадь и толщину слоёв, прикинем сколько смен нужно.$q$,
  2200, 80, $q$Сыктывкар$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Сыктывкар$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-sosnogorsk'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-sosnogorsk',
  $q$Грунтовый виброкаток LiuGong, валец 2130 мм, вибрация 30–33 Гц. Работает с нашим машинистом.

Берём работы по уплотнению отсыпки: площадки, кусты, дороги, основания под фундамент. Песок, щебень, ПГС, грунт.

Техника приходит с нашей базы в Усинске. Перевозку в Сосногорске считаем отдельно и обговариваем при заявке.

Минимальный заказ от 10 смен, на день-два каток не даём. Цена 2200 ₽/час, на длительный срок 2000 ₽/час. Работаем по договору, наличный и безналичный расчёт. Звоните, посчитаем под ваш объём.$q$,
  2200, 80, $q$Сосногорск$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Сосногорск$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-kozhva'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-kozhva',
  $q$Есть свободный грунтовый каток LiuGong: валец 2130 мм, частота вибрации 30–33 Гц, машинист наш.

Укатываем песок, щебень и грунт под площадки, кустовые основания, временные дороги и фундаменты. Слоями, как положено по технологии.

Возим тралом из Усинска. Стоимость доставки в Кожве и срок подачи называем после звонка.

Обязательное условие: от 10 смен. 2200 ₽ за час, если берёте надолго, будет 2000 ₽/час. Договор, оплата наличными или по безналу.$q$,
  2200, 80, $q$Кожва$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Кожва$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-inta'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-inta',
  $q$Сдаём в аренду грунтовый виброкаток LiuGong с машинистом. Ширина вальца 2130 мм, частота вибрации 30–33 Гц.

Подходит под отсыпку площадок и кустов, подъездные и временные дороги, основания под здания и плиты. Уплотняет песок, ПГС, щебень, суглинок.

Каток базируется в Усинске, в Инте привозим тралом. Доставку считаем отдельно, сроки менеджер скажет сразу.

Заказ от 10 смен. Час работы 2200 ₽, при долгой аренде 2000 ₽. Договор, любой способ оплаты. Перед заказом скажите площадь и толщину слоёв, прикинем сколько смен нужно.$q$,
  2200, 80, $q$Инта$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Инта$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-vuktyl'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-vuktyl',
  $q$Грунтовый виброкаток LiuGong, валец 2130 мм, вибрация 30–33 Гц. Работает с нашим машинистом.

Берём работы по уплотнению отсыпки: площадки, кусты, дороги, основания под фундамент. Песок, щебень, ПГС, грунт.

Техника приходит с нашей базы в Усинске. Перевозку в Вуктыле считаем отдельно и обговариваем при заявке.

Минимальный заказ от 10 смен, на день-два каток не даём. Цена 2200 ₽/час, на длительный срок 2000 ₽/час. Работаем по договору, наличный и безналичный расчёт. Звоните, посчитаем под ваш объём.$q$,
  2200, 80, $q$Вуктыл$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Вуктыл$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-emva'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-emva',
  $q$Есть свободный грунтовый каток LiuGong: валец 2130 мм, частота вибрации 30–33 Гц, машинист наш.

Укатываем песок, щебень и грунт под площадки, кустовые основания, временные дороги и фундаменты. Слоями, как положено по технологии.

Возим тралом из Усинска. Стоимость доставки в Емве и срок подачи называем после звонка.

Обязательное условие: от 10 смен. 2200 ₽ за час, если берёте надолго, будет 2000 ₽/час. Договор, оплата наличными или по безналу.$q$,
  2200, 80, $q$Емва$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Емва$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-mikun'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-mikun',
  $q$Сдаём в аренду грунтовый виброкаток LiuGong с машинистом. Ширина вальца 2130 мм, частота вибрации 30–33 Гц.

Подходит под отсыпку площадок и кустов, подъездные и временные дороги, основания под здания и плиты. Уплотняет песок, ПГС, щебень, суглинок.

Каток базируется в Усинске, в Микуни привозим тралом. Доставку считаем отдельно, сроки менеджер скажет сразу.

Заказ от 10 смен. Час работы 2200 ₽, при долгой аренде 2000 ₽. Договор, любой способ оплаты. Перед заказом скажите площадь и толщину слоёв, прикинем сколько смен нужно.$q$,
  2200, 80, $q$Микунь$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Микунь$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-izhma'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-izhma',
  $q$Грунтовый виброкаток LiuGong, валец 2130 мм, вибрация 30–33 Гц. Работает с нашим машинистом.

Берём работы по уплотнению отсыпки: площадки, кусты, дороги, основания под фундамент. Песок, щебень, ПГС, грунт.

Техника приходит с нашей базы в Усинске. Перевозку в Ижме считаем отдельно и обговариваем при заявке.

Минимальный заказ от 10 смен, на день-два каток не даём. Цена 2200 ₽/час, на длительный срок 2000 ₽/час. Работаем по договору, наличный и безналичный расчёт. Звоните, посчитаем под ваш объём.$q$,
  2200, 80, $q$Ижма$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Ижма$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-troitsko-pechorsk'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-troitsko-pechorsk',
  $q$Есть свободный грунтовый каток LiuGong: валец 2130 мм, частота вибрации 30–33 Гц, машинист наш.

Укатываем песок, щебень и грунт под площадки, кустовые основания, временные дороги и фундаменты. Слоями, как положено по технологии.

Возим тралом из Усинска. Стоимость доставки в Троицко-Печорске и срок подачи называем после звонка.

Обязательное условие: от 10 смен. 2200 ₽ за час, если берёте надолго, будет 2000 ₽/час. Договор, оплата наличными или по безналу.$q$,
  2200, 80, $q$Троицко-Печорск$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Троицко-Печорск$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-vizinga'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-vizinga',
  $q$Сдаём в аренду грунтовый виброкаток LiuGong с машинистом. Ширина вальца 2130 мм, частота вибрации 30–33 Гц.

Подходит под отсыпку площадок и кустов, подъездные и временные дороги, основания под здания и плиты. Уплотняет песок, ПГС, щебень, суглинок.

Каток базируется в Усинске, в Визинге привозим тралом. Доставку считаем отдельно, сроки менеджер скажет сразу.

Заказ от 10 смен. Час работы 2200 ₽, при долгой аренде 2000 ₽. Договор, любой способ оплаты. Перед заказом скажите площадь и толщину слоёв, прикинем сколько смен нужно.$q$,
  2200, 80, $q$Визинга$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Визинга$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-ust-tsilma'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-ust-tsilma',
  $q$Грунтовый виброкаток LiuGong, валец 2130 мм, вибрация 30–33 Гц. Работает с нашим машинистом.

Берём работы по уплотнению отсыпки: площадки, кусты, дороги, основания под фундамент. Песок, щебень, ПГС, грунт.

Техника приходит с нашей базы в Усинске. Перевозку в Усть-Цильме считаем отдельно и обговариваем при заявке.

Минимальный заказ от 10 смен, на день-два каток не даём. Цена 2200 ₽/час, на длительный срок 2000 ₽/час. Работаем по договору, наличный и безналичный расчёт. Звоните, посчитаем под ваш объём.$q$,
  2200, 80, $q$Усть-Цильма$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Усть-Цильма$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

INSERT INTO vehicles (id, title, slug, description, "pricePerHour", "minHours", city, "isActive", "createdAt", "updatedAt", attributes, "categoryId", "ownerId")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || 'vibrokatok-koygorodok'), 1, 24),
  $q$Виброкаток грунтовый, валец 2130 мм$q$, 'vibrokatok-koygorodok',
  $q$Есть свободный грунтовый каток LiuGong: валец 2130 мм, частота вибрации 30–33 Гц, машинист наш.

Укатываем песок, щебень и грунт под площадки, кустовые основания, временные дороги и фундаменты. Слоями, как положено по технологии.

Возим тралом из Усинска. Стоимость доставки в Койгородке и срок подачи называем после звонка.

Обязательное условие: от 10 смен. 2200 ₽ за час, если берёте надолго, будет 2000 ₽/час. Договор, оплата наличными или по безналу.$q$,
  2200, 80, $q$Койгородок$q$, true, now(), now(), $q${"Ширина вальца": "2130 мм", "Частота вибрации": "30–33 Гц", "Минимальный заказ": "от 10 смен"}$q$::jsonb,
  (SELECT id FROM categories WHERE slug = 'vibrokatok'),
  COALESCE((SELECT id FROM owners WHERE name = $q$Арендатра · Койгородок$q$ LIMIT 1), (SELECT "ownerId" FROM vehicles WHERE slug = 'buldozer-usinsk'))
ON CONFLICT (slug) DO NOTHING;

COMMIT;

SELECT city, slug, "minHours" FROM vehicles WHERE slug LIKE 'vibrokatok-%' ORDER BY city;
