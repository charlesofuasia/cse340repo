-- TASK #1 insert Tony Stark
--
INSERT INTO public.account(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES(
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--
-- TASK #2 change account_type to 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;
--
-- TASK #3 delete Tony Stark from database
DELETE FROM public.account
WHERE account_id = 1;
--
-- TASK #4 Replace part of a string in a column
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_id = 10;
--
-- TASK #5 table showing make, model and classification of `Sport` vehicles in database
SELECT inv_make,
    inv_model,
    classification_name
FROM public.inventory
    INNER JOIN public.classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';
--
-- Task #6 insert /vehicles into file paths
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, 'images', 'images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, 'images', 'images/vehicles');