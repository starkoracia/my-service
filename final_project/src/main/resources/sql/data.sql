INSERT INTO clients
    (name, email, mobile, is_supplier, recommendation, annotation)
VALUES ('Геральд Ривийский', 'witcher@gmail.com', '380980001112', false, 'Рекомендация', 'Заметка');
INSERT INTO clients
    (name, email, mobile, is_supplier, recommendation, annotation)
VALUES ('Дин Джарин', 'mando@gmail.com', '380981110003', true, 'Рекомендация', 'Заметка');
INSERT INTO clients
    (name, email, mobile, is_supplier, recommendation, annotation)
VALUES ('Питер Паркер', 'spidey@gmail.com', '380981230303', false, 'Рекомендация', 'Заметка');

INSERT INTO employees (name, email, mobile, position)
VALUES ('Джони Аксельрод', 'axecap@gmai.com', '38679999999', 2);
INSERT INTO employees (name, email, mobile, position)
VALUES ('Лекс Лютер', 'lutercorp@gmai.com', '38677774444', 1);

INSERT job (name, price, warranty)
VALUES ('Замена модуля', 450, null);
INSERT job (name, price, warranty)
VALUES ('Диагностика', 150, null);
INSERT job (name, price, warranty)
VALUES ('Чистка ноутбука', 350, null);
INSERT INTO job (name, price, warranty)
VALUES ('Замена разьема', '300', null);
INSERT INTO job (name, price, warranty)
VALUES ('Поклейка пленки', '100', null);

INSERT INTO product_categories (name)
VALUES ('Все товары');
INSERT INTO product_categories (name)
VALUES ('Запчасти');

INSERT INTO product_materials
(product_category_id, name, description, code, vendor_code, is_warranty,
 warranty_days, zero_cost, repair_cost, trade_cost, number_of, in_stock)
VALUES (1, 'Защитная пленка', null, null, null, false, 0, 20, 100, 100, 0, false);
INSERT INTO product_materials
(product_category_id, name, description, code, vendor_code, is_warranty,
 warranty_days, zero_cost, repair_cost, trade_cost, number_of, in_stock)
VALUES (2, 'Разьем micro-usb', null, null, null, false, 0, 2, 50, 50, 0, false);

INSERT INTO payment_item (name, income)
VALUES ('Расчет с поставщиком', false);
INSERT INTO payment_item (name, income)
VALUES ('Оплата за заказ', true);

INSERT INTO relocatable_products
    (product_material_id, number_of)
VALUES (1, 10);
INSERT INTO relocatable_products
    (product_material_id, number_of)
VALUES (2, 5);

INSERT INTO payments
(payment_item_id, amount, income, date_time,
 balance_before, balance_after, comment,
 employee_id, client_id, order_id)
VALUES (1, 300, false, '2022-02-15 13:00:02', 0, -300, 'Оплата за заказ', 1, 2, null);

INSERT INTO warehouse_posting
    (supplier_id, description, employee_id, date_time, payment_id)
VALUES (2, null, 1, '2022-02-15 12:45:53', 1);

INSERT INTO warehouse_posting_relocatable_products
    (warehouse_posting_id, relocatable_products_id)
VALUES (1, 1);
INSERT INTO warehouse_posting_relocatable_products
    (warehouse_posting_id, relocatable_products_id)
VALUES (1, 2);

UPDATE product_materials t
SET t.number_of = 10,
    t.in_stock  = true
WHERE t.id = 1;
UPDATE product_materials t
SET t.number_of = 5,
    t.in_stock  = true
WHERE t.id = 2;

INSERT INTO orders
(status, paid, client_id, product_type, brand_name, model, malfunction, appearance,
 equipment, acceptor_note, estimated_price, quickly, deadline, prepayment, manager_id,
 doer_id, doer_note, recommendation)
VALUES (0, false, 3, 'Мобила', 'Xiaomi', 'Redmi 10', 'Замена разьема, Поклейка пленки', 'нет', 'чехол',
        'Перепаять разьем, наклеить пленку', '500', false, '2022-02-26 12:40:34', 150, 1, 2, null, null);

INSERT INTO job_and_materials
(name, price, is_warranty, warranty_days, zero_cost, discount, doer,
 comment, number_of, is_job, job_id, product_material_id)
VALUES ('Защитная пленка', '100', false, 0, '20', null, 2, null, 1, false, null, 1);
INSERT INTO job_and_materials
(name, price, is_warranty, warranty_days, zero_cost, discount, doer,
 comment, number_of, is_job, job_id, product_material_id)
VALUES ('Разьем micro-usb', '50', false, 0, '2', null, 2, null, 1, false, null, 2);
INSERT INTO job_and_materials
(name, price, is_warranty, warranty_days, zero_cost, discount, doer,
 comment, number_of, is_job, job_id, product_material_id)
VALUES ('Замена разьема', '300', false, 0, null, null, 2, 'Слабые дорожки', 1, true, 4, null);
INSERT INTO job_and_materials
(name, price, is_warranty, warranty_days, zero_cost, discount, doer,
 comment, number_of, is_job, job_id, product_material_id)
VALUES ('Поклейка пленки', '100', false, 0, null, null, 2, 'Проклейка крышки', 1, true, 5, null);

INSERT INTO orders_job_and_materials (order_id, job_and_materials_id)
VALUES (1, 1);
INSERT INTO orders_job_and_materials (order_id, job_and_materials_id)
VALUES (1, 2);
INSERT INTO orders_job_and_materials (order_id, job_and_materials_id)
VALUES (1, 3);
INSERT INTO orders_job_and_materials (order_id, job_and_materials_id)
VALUES (1, 4);

INSERT INTO relocatable_products
    (product_material_id, number_of)
VALUES (1, 1);
INSERT INTO relocatable_products
    (product_material_id, number_of)
VALUES (2, 1);

INSERT INTO warehouse_write_off (description, employee_id, date_time, order_id, payment_id)
VALUES ('Списание товара в заказ', 1, '2022-02-23 12:34:07', 1, null);

INSERT INTO warehouse_write_off_relocatable_products (warehouse_write_off_id, relocatable_products_id)
VALUES (1, 3);
INSERT INTO warehouse_write_off_relocatable_products (warehouse_write_off_id, relocatable_products_id)
VALUES (1, 4);










