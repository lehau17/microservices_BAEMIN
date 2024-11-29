DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'baemin_cart_service'
    ) THEN
        CREATE DATABASE baemin_cart_service; 
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'baemin_order_service'
    ) THEN
        CREATE DATABASE baemin_order_service;
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'baemin_product_service'
    ) THEN
        CREATE DATABASE baemin_product_service;
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'baemin_restaurant_service'
    ) THEN
        CREATE DATABASE baemin_restaurant_service;
    END IF;

    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'baemin_user_service'
    ) THEN
        CREATE DATABASE baemin_user_service;
    END IF;
END
$$;
