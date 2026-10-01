-- Отдельная карточка владельца на каждый город: «Арендатра · {город}»
BEGIN;
INSERT INTO owners (id, name, description, phone, city, "isActive", "createdAt", "updatedAt")
SELECT 'c' || substr(md5(random()::text || clock_timestamp()::text || c.city), 1, 24),
       'Арендатра · ' || c.city,
       'Техника Арендатры в городе ' || c.city || '. Бронь подтверждает менеджер: звонки с 8:00 до 20:00, заявки на сайте круглосуточно. Работа по договору, наличный и безналичный расчёт.',
       '+79121263013', c.city, true, now(), now()
FROM (SELECT DISTINCT city FROM vehicles WHERE city IS NOT NULL) c
WHERE NOT EXISTS (SELECT 1 FROM owners o WHERE o.name = 'Арендатра · ' || c.city);

UPDATE vehicles v SET "ownerId" = o.id, "updatedAt" = now()
FROM owners o
WHERE o.name = 'Арендатра · ' || v.city
  AND v."ownerId" IN (SELECT id FROM owners WHERE name = 'Арендатра');
COMMIT;
SELECT o.name AS owner, count(v.id) AS machines FROM owners o LEFT JOIN vehicles v ON v."ownerId" = o.id GROUP BY o.name ORDER BY o.name;
