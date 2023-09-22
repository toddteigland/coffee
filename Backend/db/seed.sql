-- Function to seed orders and associated items
DO $$ 
DECLARE 
  order_id INTEGER;
  counter INTEGER := 1;
  item_count INTEGER;
  order_date TIMESTAMP;
BEGIN
  WHILE counter <= 50 LOOP
    -- Calculate random number of items between 1 and 7
    item_count := 1 + floor(random() * 7);
    
    -- Generate a random date within the last 11 months
    order_date := current_date - interval '11 months' + (random() * (330 * interval '1 day'));

    -- Insert into orders
    INSERT INTO orders (user_id, created_at, store_id, storeInfo)
    VALUES (
      (counter % 2) + 1, 
      order_date,
      1,
      '{"name": "Some Store", "location": "Some Location"}'
    ) RETURNING id INTO order_id;

    -- Loop to insert multiple items for each order
    FOR i IN 1..item_count LOOP
      INSERT INTO order_items (order_id, coffee_type, size, price, extras)
      VALUES (
        order_id,
        CASE 
          WHEN i % 3 = 0 THEN 'Latte'
          WHEN i % 3 = 1 THEN 'London Fog'
          ELSE 'Mocha'
        END,
        CASE
          WHEN i % 2 = 0 THEN 'S'
          ELSE 'L'
        END,
        CASE 
          WHEN i % 3 = 0 THEN 4.50
          WHEN i % 3 = 1 THEN 3.50
          ELSE 5.00
        END,
        '{"sugar": 1, "milk": "Whole"}'
      );
    END LOOP;

    counter := counter + 1;
  END LOOP;
END $$;
