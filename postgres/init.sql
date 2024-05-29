--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2024-05-29 12:58:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 864 (class 1247 OID 20194)
-- Name: day_day_open_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.day_day_open_enum AS ENUM (
    'domenica',
    'lunedì',
    'martedì',
    'mercoledì',
    'giovedì',
    'venerdì',
    'sabato'
);


ALTER TYPE public.day_day_open_enum OWNER TO postgres;

--
-- TOC entry 930 (class 1247 OID 20681)
-- Name: daysopen_day_open_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.daysopen_day_open_enum AS ENUM (
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6'
);


ALTER TYPE public.daysopen_day_open_enum OWNER TO postgres;

--
-- TOC entry 867 (class 1247 OID 20226)
-- Name: food_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.food_type_enum AS ENUM (
    'Aperitivo',
    'Primo',
    'Secondo',
    'Contorno',
    'Dolce',
    'Bevanda',
    'Caffè',
    'Pizza'
);


ALTER TYPE public.food_type_enum OWNER TO postgres;

--
-- TOC entry 870 (class 1247 OID 20244)
-- Name: notification_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_status_enum AS ENUM (
    'read',
    'unread'
);


ALTER TYPE public.notification_status_enum OWNER TO postgres;

--
-- TOC entry 873 (class 1247 OID 20250)
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'admin',
    'customer',
    'staff',
    'user'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 20259)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    surname character varying(30) NOT NULL,
    email character varying(256) NOT NULL,
    password character varying(256) NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 20264)
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public."user" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 216 (class 1259 OID 20265)
-- Name: day; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.day (
    restaurant_id integer NOT NULL,
    day_open public.day_day_open_enum NOT NULL,
    opening time without time zone NOT NULL,
    closing time without time zone NOT NULL
);


ALTER TABLE public.day OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 20268)
-- Name: daysopen; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.daysopen (
    restaurant_id integer NOT NULL,
    day_open public.daysopen_day_open_enum NOT NULL,
    opening time without time zone NOT NULL,
    closing time without time zone NOT NULL
);


ALTER TABLE public.daysopen OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 20271)
-- Name: food; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food (
    id integer NOT NULL,
    menu_id integer NOT NULL,
    name character varying(100) NOT NULL,
    price double precision NOT NULL,
    path_image character varying(255) DEFAULT ''::character varying NOT NULL,
    type public.food_type_enum DEFAULT 'Aperitivo'::public.food_type_enum NOT NULL
);


ALTER TABLE public.food OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 20276)
-- Name: food_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.food ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.food_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 20277)
-- Name: food_ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food_ingredient (
    id_food integer NOT NULL,
    id_ingredient integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.food_ingredient OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 20280)
-- Name: food_ingredients_ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food_ingredients_ingredient (
    "foodId" integer NOT NULL,
    "ingredientId" integer NOT NULL
);


ALTER TABLE public.food_ingredients_ingredient OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 20283)
-- Name: ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredient (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.ingredient OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 20286)
-- Name: ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ingredient_id_seq OWNER TO postgres;

--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 223
-- Name: ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredient_id_seq OWNED BY public.ingredient.id;


--
-- TOC entry 224 (class 1259 OID 20287)
-- Name: menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.menu OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 20290)
-- Name: menu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.menu ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 20291)
-- Name: notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification (
    id integer NOT NULL,
    message character varying NOT NULL,
    status public.notification_status_enum DEFAULT 'unread'::public.notification_status_enum NOT NULL,
    title character varying NOT NULL,
    id_receiver integer NOT NULL
);


ALTER TABLE public.notification OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 20297)
-- Name: notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_id_seq OWNER TO postgres;

--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 227
-- Name: notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notification_id_seq OWNED BY public.notification.id;


--
-- TOC entry 228 (class 1259 OID 20298)
-- Name: order_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_detail (
    quantity integer DEFAULT 1 NOT NULL,
    user_id integer NOT NULL,
    reservation_id integer NOT NULL,
    food_id integer NOT NULL,
    id integer NOT NULL,
    paid boolean DEFAULT false NOT NULL
);


ALTER TABLE public.order_detail OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 20302)
-- Name: order_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_detail_id_seq OWNER TO postgres;

--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 229
-- Name: order_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_detail_id_seq OWNED BY public.order_detail.id;


--
-- TOC entry 230 (class 1259 OID 20303)
-- Name: order_detail_ingredients_ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_detail_ingredients_ingredient (
    "orderDetailId" integer NOT NULL,
    "ingredientId" integer NOT NULL
);


ALTER TABLE public.order_detail_ingredients_ingredient OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 20306)
-- Name: order_ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_ingredients (
    order_id integer NOT NULL,
    ingredient_id integer NOT NULL,
    removed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.order_ingredients OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 20310)
-- Name: reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation (
    id integer NOT NULL,
    date timestamp without time zone NOT NULL,
    number_people integer NOT NULL,
    restaurant_id integer NOT NULL,
    state character varying DEFAULT 'pending'::character varying NOT NULL,
    "isRomanBill" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reservation OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 20316)
-- Name: reservation_customers_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_customers_user (
    "reservationId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public.reservation_customers_user OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 20319)
-- Name: reservation_food; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_food (
    id integer NOT NULL,
    "reservationId" integer NOT NULL,
    "foodId" integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.reservation_food OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 20322)
-- Name: reservation_food_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservation_food_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reservation_food_id_seq OWNER TO postgres;

--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 235
-- Name: reservation_food_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservation_food_id_seq OWNED BY public.reservation_food.id;


--
-- TOC entry 236 (class 1259 OID 20323)
-- Name: reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.reservation ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reservation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 237 (class 1259 OID 20324)
-- Name: reservation_users_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_users_user (
    "reservationId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public.reservation_users_user OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 20327)
-- Name: restaurant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.restaurant (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(100) NOT NULL,
    city character varying(100) NOT NULL,
    cuisine character varying(100) NOT NULL,
    menu_id integer,
    tables integer NOT NULL,
    email character varying(256) NOT NULL,
    phone_number character varying(20) NOT NULL,
    image character varying(255),
    description character varying(255)
);


ALTER TABLE public.restaurant OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 20332)
-- Name: restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.restaurant ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.restaurant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 240 (class 1259 OID 20333)
-- Name: staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    user_id integer NOT NULL,
    ruolo character varying DEFAULT 'staff'::character varying NOT NULL
);


ALTER TABLE public.staff OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 20339)
-- Name: staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.staff_id_seq OWNER TO postgres;

--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 241
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- TOC entry 3267 (class 2604 OID 20340)
-- Name: ingredient id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient ALTER COLUMN id SET DEFAULT nextval('public.ingredient_id_seq'::regclass);


--
-- TOC entry 3268 (class 2604 OID 20341)
-- Name: notification id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification ALTER COLUMN id SET DEFAULT nextval('public.notification_id_seq'::regclass);


--
-- TOC entry 3271 (class 2604 OID 20342)
-- Name: order_detail id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail ALTER COLUMN id SET DEFAULT nextval('public.order_detail_id_seq'::regclass);


--
-- TOC entry 3276 (class 2604 OID 20343)
-- Name: reservation_food id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_food ALTER COLUMN id SET DEFAULT nextval('public.reservation_food_id_seq'::regclass);


--
-- TOC entry 3277 (class 2604 OID 20344)
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- TOC entry 3496 (class 0 OID 20265)
-- Dependencies: 216
-- Data for Name: day; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3497 (class 0 OID 20268)
-- Dependencies: 217
-- Data for Name: daysopen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, '1', '18:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, '0', '18:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, '0', '18:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, '2', '18:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, '3', '18:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, '4', '18:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, '5', '18:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, '6', '18:00:00', '23:00:00');


--
-- TOC entry 3498 (class 0 OID 20271)
-- Dependencies: 218
-- Data for Name: food; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (2, 1, 'Spaghetti all''amatriciana', 9, '', 'Aperitivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (3, 1, 'Spaghetti al pomodoro', 8, '', 'Aperitivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (4, 2, 'Riso alla cantonese', 10, '', 'Aperitivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (5, 2, 'Riso fritto', 9, '', 'Aperitivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (7, 3, 'Pizza margherita', 10, '', 'Aperitivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (8, 3, 'Pizza marinara', 9, '', 'Aperitivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (9, 3, 'Pizza capricciosa', 8, '', 'Aperitivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (6, 2, 'Riso saltato', 8, '', 'Aperitivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'Spaghetti alla carbonara', 10, '', 'Aperitivo');


--
-- TOC entry 3500 (class 0 OID 20277)
-- Dependencies: 220
-- Data for Name: food_ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (1, 2, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (1, 6, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (1, 9, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (1, 10, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (1, 11, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (2, 2, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (2, 6, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (2, 7, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (2, 10, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (2, 11, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (3, 2, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (3, 7, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (4, 13, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (4, 14, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (4, 15, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (4, 16, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (4, 17, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (5, 13, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (5, 14, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (5, 15, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (5, 18, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (6, 13, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (6, 15, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (6, 18, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (7, 19, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (7, 20, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (7, 21, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (7, 10, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (7, 11, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (8, 19, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (8, 21, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (8, 6, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (8, 22, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (9, 19, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (9, 20, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (9, 21, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (9, 23, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (9, 24, 1);
INSERT INTO public.food_ingredient (id_food, id_ingredient, quantity) VALUES (9, 25, 1);


--
-- TOC entry 3501 (class 0 OID 20280)
-- Dependencies: 221
-- Data for Name: food_ingredients_ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (1, 10);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (1, 20);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (1, 30);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (1, 72);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (2, 10);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (2, 20);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (2, 30);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (2, 72);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (3, 10);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (3, 20);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (3, 30);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (3, 72);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (4, 10);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (4, 20);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (4, 30);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (4, 72);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (5, 10);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (5, 20);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (5, 30);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (5, 72);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (6, 10);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (6, 20);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (6, 30);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (6, 72);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (7, 10);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (7, 20);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (7, 30);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (7, 72);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (8, 10);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (8, 20);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (8, 30);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (8, 72);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (9, 10);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (9, 20);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (9, 30);
INSERT INTO public.food_ingredients_ingredient ("foodId", "ingredientId") VALUES (9, 72);


--
-- TOC entry 3502 (class 0 OID 20283)
-- Dependencies: 222
-- Data for Name: ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ingredient (id, name) VALUES (1, 'Pasta');
INSERT INTO public.ingredient (id, name) VALUES (2, 'Spaghetti');
INSERT INTO public.ingredient (id, name) VALUES (3, 'Farina');
INSERT INTO public.ingredient (id, name) VALUES (4, 'Pomodoro');
INSERT INTO public.ingredient (id, name) VALUES (5, 'Basilico');
INSERT INTO public.ingredient (id, name) VALUES (6, 'Aglio');
INSERT INTO public.ingredient (id, name) VALUES (7, 'Cipolla');
INSERT INTO public.ingredient (id, name) VALUES (8, 'Mozzarella');
INSERT INTO public.ingredient (id, name) VALUES (9, 'Parmigiano');
INSERT INTO public.ingredient (id, name) VALUES (10, 'Sale');
INSERT INTO public.ingredient (id, name) VALUES (11, 'Pepe');
INSERT INTO public.ingredient (id, name) VALUES (12, 'Origano');
INSERT INTO public.ingredient (id, name) VALUES (13, 'Polvere di cipolla');
INSERT INTO public.ingredient (id, name) VALUES (14, 'Polvere di aglio');
INSERT INTO public.ingredient (id, name) VALUES (15, 'Carote');
INSERT INTO public.ingredient (id, name) VALUES (16, 'Sedano');
INSERT INTO public.ingredient (id, name) VALUES (17, 'Cipolla rossa');
INSERT INTO public.ingredient (id, name) VALUES (18, 'Cipolla bianca');
INSERT INTO public.ingredient (id, name) VALUES (19, 'Cipolla di Tropea');
INSERT INTO public.ingredient (id, name) VALUES (20, 'Zucchine');
INSERT INTO public.ingredient (id, name) VALUES (21, 'Peperoni');
INSERT INTO public.ingredient (id, name) VALUES (22, 'Funghi');
INSERT INTO public.ingredient (id, name) VALUES (23, 'Melanzane');
INSERT INTO public.ingredient (id, name) VALUES (24, 'Pomodori secchi');
INSERT INTO public.ingredient (id, name) VALUES (25, 'Pomodorini');
INSERT INTO public.ingredient (id, name) VALUES (26, 'Spinaci');
INSERT INTO public.ingredient (id, name) VALUES (27, 'Rucola');
INSERT INTO public.ingredient (id, name) VALUES (28, 'Prosciutto crudo');
INSERT INTO public.ingredient (id, name) VALUES (29, 'Prosciutto cotto');
INSERT INTO public.ingredient (id, name) VALUES (30, 'Speck');
INSERT INTO public.ingredient (id, name) VALUES (31, 'Salame');
INSERT INTO public.ingredient (id, name) VALUES (32, 'Salsiccia');
INSERT INTO public.ingredient (id, name) VALUES (33, 'Tonno');
INSERT INTO public.ingredient (id, name) VALUES (34, 'Acciughe');
INSERT INTO public.ingredient (id, name) VALUES (35, 'Salmone');
INSERT INTO public.ingredient (id, name) VALUES (36, 'Gamberetti');
INSERT INTO public.ingredient (id, name) VALUES (37, 'Polpo');
INSERT INTO public.ingredient (id, name) VALUES (38, 'Calamari');
INSERT INTO public.ingredient (id, name) VALUES (39, 'Cozze');
INSERT INTO public.ingredient (id, name) VALUES (40, 'Vongole');
INSERT INTO public.ingredient (id, name) VALUES (41, 'Frutti di mare misti');
INSERT INTO public.ingredient (id, name) VALUES (42, 'Uova');
INSERT INTO public.ingredient (id, name) VALUES (43, 'Pane grattugiato');
INSERT INTO public.ingredient (id, name) VALUES (44, 'Pan grattato');
INSERT INTO public.ingredient (id, name) VALUES (45, 'Pangrattato');
INSERT INTO public.ingredient (id, name) VALUES (46, 'Latte');
INSERT INTO public.ingredient (id, name) VALUES (47, 'Panna');
INSERT INTO public.ingredient (id, name) VALUES (48, 'Burro');
INSERT INTO public.ingredient (id, name) VALUES (49, 'Olio extravergine di oliva');
INSERT INTO public.ingredient (id, name) VALUES (50, 'Olio di semi');
INSERT INTO public.ingredient (id, name) VALUES (51, 'Aceto balsamico');
INSERT INTO public.ingredient (id, name) VALUES (52, 'Aceto di vino');
INSERT INTO public.ingredient (id, name) VALUES (53, 'Vino bianco');
INSERT INTO public.ingredient (id, name) VALUES (54, 'Vino rosso');
INSERT INTO public.ingredient (id, name) VALUES (55, 'Vino marsala');
INSERT INTO public.ingredient (id, name) VALUES (56, 'Vino da cucina');
INSERT INTO public.ingredient (id, name) VALUES (57, 'Brodo vegetale');
INSERT INTO public.ingredient (id, name) VALUES (58, 'Brodo di carne');
INSERT INTO public.ingredient (id, name) VALUES (59, 'Brodo di pesce');
INSERT INTO public.ingredient (id, name) VALUES (60, 'Sugo pronto');
INSERT INTO public.ingredient (id, name) VALUES (61, 'Passata di pomodoro');
INSERT INTO public.ingredient (id, name) VALUES (62, 'Pomodori pelati');
INSERT INTO public.ingredient (id, name) VALUES (63, 'Concentrato di pomodoro');
INSERT INTO public.ingredient (id, name) VALUES (64, 'Maionese');
INSERT INTO public.ingredient (id, name) VALUES (65, 'Senape');
INSERT INTO public.ingredient (id, name) VALUES (66, 'Ketchup');
INSERT INTO public.ingredient (id, name) VALUES (67, 'Salsa di soia');
INSERT INTO public.ingredient (id, name) VALUES (68, 'Pasta di acciughe');
INSERT INTO public.ingredient (id, name) VALUES (69, 'Pasta di peperoncino');
INSERT INTO public.ingredient (id, name) VALUES (70, 'Paprika');
INSERT INTO public.ingredient (id, name) VALUES (71, 'Curry');
INSERT INTO public.ingredient (id, name) VALUES (72, 'Zafferano');
INSERT INTO public.ingredient (id, name) VALUES (73, 'Prezzemolo');
INSERT INTO public.ingredient (id, name) VALUES (74, 'Rosmarino');
INSERT INTO public.ingredient (id, name) VALUES (75, 'Timo');
INSERT INTO public.ingredient (id, name) VALUES (76, 'Salvia');
INSERT INTO public.ingredient (id, name) VALUES (77, 'Menta');
INSERT INTO public.ingredient (id, name) VALUES (78, 'Dragoncello');
INSERT INTO public.ingredient (id, name) VALUES (79, 'Alloro');
INSERT INTO public.ingredient (id, name) VALUES (80, 'Cannella');
INSERT INTO public.ingredient (id, name) VALUES (81, 'Noce moscata');
INSERT INTO public.ingredient (id, name) VALUES (82, 'Zenzero');
INSERT INTO public.ingredient (id, name) VALUES (83, 'Chiodi di garofano');
INSERT INTO public.ingredient (id, name) VALUES (84, 'Anice stellato');
INSERT INTO public.ingredient (id, name) VALUES (85, 'Cardamomo');
INSERT INTO public.ingredient (id, name) VALUES (86, 'Cumino');
INSERT INTO public.ingredient (id, name) VALUES (87, 'Coriandolo');
INSERT INTO public.ingredient (id, name) VALUES (88, 'Peperoncino in polvere');
INSERT INTO public.ingredient (id, name) VALUES (89, 'Pepe nero in grani');


--
-- TOC entry 3504 (class 0 OID 20287)
-- Dependencies: 224
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.menu (id, name) OVERRIDING SYSTEM VALUE VALUES (1, 'Menu 1');
INSERT INTO public.menu (id, name) OVERRIDING SYSTEM VALUE VALUES (2, 'Menu 2');
INSERT INTO public.menu (id, name) OVERRIDING SYSTEM VALUE VALUES (3, 'Menu 3');


--
-- TOC entry 3506 (class 0 OID 20291)
-- Dependencies: 226
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3508 (class 0 OID 20298)
-- Dependencies: 228
-- Data for Name: order_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 1, 1, 2, 1, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 1, 1, 3, 2, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (20, 1, 1, 1, 3, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (3, 4, 14, 2, 54, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (4, 4, 14, 3, 55, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (4, 4, 14, 1, 56, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (3, 4, 15, 1, 59, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (4, 4, 11, 4, 17, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (6, 4, 15, 2, 57, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (4, 4, 11, 5, 18, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (4, 4, 11, 6, 19, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (7, 4, 12, 2, 48, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (4, 4, 12, 3, 49, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (11, 4, 15, 3, 58, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (4, 4, 12, 1, 50, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 22, 2, 60, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (3, 4, 13, 3, 52, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (4, 4, 18, 2, 61, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 23, 2, 62, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 23, 2, 63, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 23, 2, 64, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (3, 4, 13, 1, 53, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 23, 2, 65, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 24, 2, 66, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 24, 2, 67, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 24, 2, 68, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 24, 2, 69, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 25, 4, 70, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (8, 4, 13, 2, 51, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 25, 4, 71, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 25, 4, 72, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 25, 4, 73, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 25, 4, 74, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 26, 2, 75, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 26, 2, 76, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 26, 2, 77, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 26, 2, 78, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 26, 2, 79, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 27, 2, 80, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 27, 2, 81, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 27, 2, 82, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 27, 2, 83, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 27, 2, 84, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 28, 2, 85, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 28, 2, 86, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 29, 2, 87, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 29, 2, 88, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 30, 2, 101, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 30, 2, 102, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 30, 2, 103, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 30, 2, 104, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 30, 2, 105, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 30, 2, 106, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 30, 2, 107, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 30, 2, 108, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 30, 2, 109, false);
INSERT INTO public.order_detail (quantity, user_id, reservation_id, food_id, id, paid) VALUES (1, 4, 30, 2, 110, false);


--
-- TOC entry 3510 (class 0 OID 20303)
-- Dependencies: 230
-- Data for Name: order_detail_ingredients_ingredient; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (17, 10);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (17, 20);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (18, 10);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (18, 72);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (19, 10);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (19, 30);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (19, 72);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (48, 10);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (48, 20);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (48, 30);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (48, 72);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (49, 10);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (49, 20);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (49, 30);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (49, 72);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (50, 10);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (50, 20);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (50, 30);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (50, 72);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (3, 10);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (3, 20);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (2, 10);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (2, 20);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (2, 30);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (2, 72);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (1, 10);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (1, 20);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (1, 30);
INSERT INTO public.order_detail_ingredients_ingredient ("orderDetailId", "ingredientId") VALUES (1, 72);


--
-- TOC entry 3511 (class 0 OID 20306)
-- Dependencies: 231
-- Data for Name: order_ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (1, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (1, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (1, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (1, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (2, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (2, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (2, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (2, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (3, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (3, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (57, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (57, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (57, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (57, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (58, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (88, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (58, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (58, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (88, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (88, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (88, 10, true);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (59, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (58, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (59, 10, true);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (59, 20, true);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (59, 30, true);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (60, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (60, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (60, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (60, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (61, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (61, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (61, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (61, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (62, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (62, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (62, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (62, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (63, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (63, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (63, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (63, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (64, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (64, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (64, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (64, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (65, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (65, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (65, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (65, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (66, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (66, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (66, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (66, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (67, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (67, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (67, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (67, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (68, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (68, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (68, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (68, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (69, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (69, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (69, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (69, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (70, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (70, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (70, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (70, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (71, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (71, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (71, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (71, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (72, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (72, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (72, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (72, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (73, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (73, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (73, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (73, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (74, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (74, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (74, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (74, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (75, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (75, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (75, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (75, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (76, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (101, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (102, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (102, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (102, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (102, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (103, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (103, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (103, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (76, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (76, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (76, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (77, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (77, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (77, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (77, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (78, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (78, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (78, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (78, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (79, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (79, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (79, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (79, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (80, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (80, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (80, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (80, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (81, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (81, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (81, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (81, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (82, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (82, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (82, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (82, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (83, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (83, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (83, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (83, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (84, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (84, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (84, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (84, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (85, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (85, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (85, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (85, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (86, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (86, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (86, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (86, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (87, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (87, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (87, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (87, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (103, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (104, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (104, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (104, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (104, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (105, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (105, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (105, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (105, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (106, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (106, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (106, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (106, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (107, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (107, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (107, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (107, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (108, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (108, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (108, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (108, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (109, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (109, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (109, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (109, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (110, 10, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (110, 20, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (110, 30, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (110, 72, false);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (101, 10, true);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (101, 20, true);
INSERT INTO public.order_ingredients (order_id, ingredient_id, removed) VALUES (101, 30, true);


--
-- TOC entry 3512 (class 0 OID 20310)
-- Dependencies: 232
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (1, '2023-05-05 00:00:00', 1, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (2, '2024-03-26 20:20:00', 20, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (3, '2024-03-26 20:20:00', 20, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (4, '2024-04-03 20:20:00', 20, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (5, '2024-04-03 20:20:00', 20, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (6, '2024-04-03 20:20:00', 20, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (7, '2024-04-09 20:20:00', 20, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (8, '2024-04-18 20:20:00', 20, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (9, '2220-02-10 20:20:00', 1000000, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (10, '2222-02-20 20:20:00', 20, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (11, '2222-02-20 20:20:00', 20000, 2, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (12, '2222-02-20 20:20:00', 1000000, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (13, '2222-02-20 20:20:00', 222222, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (14, '2222-10-20 22:22:00', 22222, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (15, '2222-02-20 20:20:00', 222222, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (16, '2222-02-20 20:20:00', 20000, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (17, '2222-02-20 20:20:00', 2000, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (18, '2222-02-20 20:20:00', 22222, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (19, '2222-02-20 20:20:00', 222, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (20, '2222-02-20 20:20:00', 222, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (21, '2222-02-20 22:22:00', 20000, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (22, '2222-02-20 20:20:00', 222222, 1, 'pending', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (23, '2222-02-20 20:20:00', 2222, 1, 'accept', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (24, '2222-02-20 20:20:00', 222, 1, 'accept', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (25, '2222-02-20 20:20:00', 22222, 2, 'accept', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (26, '2222-02-20 20:20:00', 222222, 1, 'accept', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (27, '2222-02-20 20:20:00', 22222, 1, 'accept', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (28, '2222-02-20 20:20:00', 222, 1, 'to_pay', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (29, '2222-02-20 20:20:00', 222, 1, 'to_pay', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (30, '2222-02-20 20:02:00', 2222, 1, 'to_pay', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (31, '2222-02-20 20:20:00', 222222, 1, 'accept', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (32, '2222-02-20 20:20:00', 222222, 1, 'accept', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (33, '2222-02-20 20:20:00', 222222, 1, 'accept', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (34, '2222-02-20 20:20:00', 222222, 1, 'accept', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (35, '2222-02-20 20:20:00', 222222, 1, 'accept', false);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state, "isRomanBill") OVERRIDING SYSTEM VALUE VALUES (36, '2222-02-20 20:20:00', 222, 1, 'accept', false);


--
-- TOC entry 3513 (class 0 OID 20316)
-- Dependencies: 233
-- Data for Name: reservation_customers_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (12, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (13, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (14, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (15, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (16, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (17, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (18, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (19, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (20, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (21, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (22, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (23, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (24, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (25, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (26, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (27, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (28, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (29, 1);
INSERT INTO public.reservation_customers_user ("reservationId", "userId") VALUES (30, 1);


--
-- TOC entry 3514 (class 0 OID 20319)
-- Dependencies: 234
-- Data for Name: reservation_food; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3517 (class 0 OID 20324)
-- Dependencies: 237
-- Data for Name: reservation_users_user; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3518 (class 0 OID 20327)
-- Dependencies: 238
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.restaurant (id, name, address, city, cuisine, menu_id, tables, email, phone_number, image, description) OVERRIDING SYSTEM VALUE VALUES (1, 'Ristorante 1', 'Via Roma', 'Roma', 'italiana', 1, 100, 'test1', 'test1', NULL, NULL);
INSERT INTO public.restaurant (id, name, address, city, cuisine, menu_id, tables, email, phone_number, image, description) OVERRIDING SYSTEM VALUE VALUES (2, 'Ristorante 2', 'Via Milano', 'Milano', 'cinese', 2, 100, 'test2', 'test2', NULL, NULL);
INSERT INTO public.restaurant (id, name, address, city, cuisine, menu_id, tables, email, phone_number, image, description) OVERRIDING SYSTEM VALUE VALUES (3, 'Ristorante 3', 'Via Napoli', 'Napoli', 'pizza', 3, 100, 'test3', 'test3', NULL, NULL);
INSERT INTO public.restaurant (id, name, address, city, cuisine, menu_id, tables, email, phone_number, image, description) OVERRIDING SYSTEM VALUE VALUES (5, 'Ristorante 4', 'Via 4', 'Citta 4', 'Russia', NULL, 100, 'admin4@admin.it', '39', '', '4');


--
-- TOC entry 3520 (class 0 OID 20333)
-- Dependencies: 240
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.staff (id, restaurant_id, user_id, ruolo) VALUES (1, 1, 1, 'admin');
INSERT INTO public.staff (id, restaurant_id, user_id, ruolo) VALUES (3, 3, 3, 'admin');
INSERT INTO public.staff (id, restaurant_id, user_id, ruolo) VALUES (2, 2, 2, 'admin');
INSERT INTO public.staff (id, restaurant_id, user_id, ruolo) VALUES (4, 5, 6, 'admin');


--
-- TOC entry 3494 (class 0 OID 20259)
-- Dependencies: 214
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" (id, name, surname, email, password) OVERRIDING SYSTEM VALUE VALUES (2, 'test', 'test', 'admin2@admin.it', '$2b$13$sOqnpSq4PnqCEPhA9Zj1leHA1VV3lQ5fm3Z9eYtnFY3617/jbtkfG');
INSERT INTO public."user" (id, name, surname, email, password) OVERRIDING SYSTEM VALUE VALUES (1, 'user', 'user', 'admin1@admin.it', '$2b$13$sOqnpSq4PnqCEPhA9Zj1leHA1VV3lQ5fm3Z9eYtnFY3617/jbtkfG');
INSERT INTO public."user" (id, name, surname, email, password) OVERRIDING SYSTEM VALUE VALUES (3, 'test', 'test', 'admin3@admin.it', '$2b$13$sOqnpSq4PnqCEPhA9Zj1leHA1VV3lQ5fm3Z9eYtnFY3617/jbtkfG');
INSERT INTO public."user" (id, name, surname, email, password) OVERRIDING SYSTEM VALUE VALUES (4, 'user', 'user', 'user1@user.it', '$2b$13$sOqnpSq4PnqCEPhA9Zj1leHA1VV3lQ5fm3Z9eYtnFY3617/jbtkfG');
INSERT INTO public."user" (id, name, surname, email, password) OVERRIDING SYSTEM VALUE VALUES (5, 'user2', 'user2', 'user2@user.it', '$2b$13$sOqnpSq4PnqCEPhA9Zj1leHA1VV3lQ5fm3Z9eYtnFY3617/jbtkfG');
INSERT INTO public."user" (id, name, surname, email, password) OVERRIDING SYSTEM VALUE VALUES (6, 'Ristorante 4', '4', 'admin4@admin.it', '$2b$13$sOqnpSq4PnqCEPhA9Zj1leHA1VV3lQ5fm3Z9eYtnFY3617/jbtkfG');


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 215
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_id_seq', 6, true);


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 219
-- Name: food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.food_id_seq', 9, true);


--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 223
-- Name: ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredient_id_seq', 89, true);


--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 225
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_id_seq', 3, true);


--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 227
-- Name: notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_id_seq', 1, true);


--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 229
-- Name: order_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_detail_id_seq', 110, true);


--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 235
-- Name: reservation_food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_food_id_seq', 1, false);


--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 236
-- Name: reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_id_seq', 36, true);


--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 239
-- Name: restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurant_id_seq', 5, true);


--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 241
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_id_seq', 4, true);


--
-- TOC entry 3300 (class 2606 OID 20346)
-- Name: order_detail PK_0afbab1fa98e2fb0be8e74f6b38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "PK_0afbab1fa98e2fb0be8e74f6b38" PRIMARY KEY (id);


--
-- TOC entry 3312 (class 2606 OID 20348)
-- Name: reservation_customers_user PK_103fb00a81fd9b7f314e9e04c20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_customers_user
    ADD CONSTRAINT "PK_103fb00a81fd9b7f314e9e04c20" PRIMARY KEY ("reservationId", "userId");


--
-- TOC entry 3284 (class 2606 OID 20696)
-- Name: daysopen PK_12e7b6073e49f559814db021c40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daysopen
    ADD CONSTRAINT "PK_12e7b6073e49f559814db021c40" PRIMARY KEY (restaurant_id, day_open, opening);


--
-- TOC entry 3318 (class 2606 OID 20352)
-- Name: reservation_users_user PK_189d9015e1e8ab6fb7cb8b72bf0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_users_user
    ADD CONSTRAINT "PK_189d9015e1e8ab6fb7cb8b72bf0" PRIMARY KEY ("reservationId", "userId");


--
-- TOC entry 3292 (class 2606 OID 20354)
-- Name: food_ingredients_ingredient PK_1d68764db363359b029c43908f6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_ingredients_ingredient
    ADD CONSTRAINT "PK_1d68764db363359b029c43908f6" PRIMARY KEY ("foodId", "ingredientId");


--
-- TOC entry 3306 (class 2606 OID 20356)
-- Name: order_ingredients PK_49c56bae35cbfa735f437c67c24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_ingredients
    ADD CONSTRAINT "PK_49c56bae35cbfa735f437c67c24" PRIMARY KEY (order_id, ingredient_id);


--
-- TOC entry 3298 (class 2606 OID 20358)
-- Name: notification PK_705b6c7cdf9b2c2ff7ac7872cb7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY (id);


--
-- TOC entry 3282 (class 2606 OID 20360)
-- Name: day PK_85468867ae69ba9a668eb33c184; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.day
    ADD CONSTRAINT "PK_85468867ae69ba9a668eb33c184" PRIMARY KEY (restaurant_id, day_open, opening);


--
-- TOC entry 3314 (class 2606 OID 20362)
-- Name: reservation_food PK_9114deef20afa4a92ca78422ec8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_food
    ADD CONSTRAINT "PK_9114deef20afa4a92ca78422ec8" PRIMARY KEY (id);


--
-- TOC entry 3304 (class 2606 OID 20364)
-- Name: order_detail_ingredients_ingredient PK_927e8aa1c4dde72ef3e1c77b54e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail_ingredients_ingredient
    ADD CONSTRAINT "PK_927e8aa1c4dde72ef3e1c77b54e" PRIMARY KEY ("orderDetailId", "ingredientId");


--
-- TOC entry 3320 (class 2606 OID 20368)
-- Name: restaurant UQ_5a6420c3086d9d50d001cc01713; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT "UQ_5a6420c3086d9d50d001cc01713" UNIQUE (menu_id);


--
-- TOC entry 3324 (class 2606 OID 20370)
-- Name: staff UQ_cec9365d9fc3a3409158b645f2e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT "UQ_cec9365d9fc3a3409158b645f2e" UNIQUE (user_id);


--
-- TOC entry 3280 (class 2606 OID 20372)
-- Name: user customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- TOC entry 3288 (class 2606 OID 20374)
-- Name: food_ingredient food_ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_ingredient
    ADD CONSTRAINT food_ingredient_pkey PRIMARY KEY (id_food, id_ingredient);


--
-- TOC entry 3286 (class 2606 OID 20376)
-- Name: food food_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_pkey PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 20378)
-- Name: ingredient ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_pkey PRIMARY KEY (id);


--
-- TOC entry 3296 (class 2606 OID 20380)
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- TOC entry 3308 (class 2606 OID 20382)
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (id);


--
-- TOC entry 3322 (class 2606 OID 20384)
-- Name: restaurant restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);


--
-- TOC entry 3326 (class 2606 OID 20386)
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- TOC entry 3309 (class 1259 OID 20387)
-- Name: IDX_36f40349ae6c124fd51b0f7d98; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_36f40349ae6c124fd51b0f7d98" ON public.reservation_customers_user USING btree ("reservationId");


--
-- TOC entry 3315 (class 1259 OID 20388)
-- Name: IDX_376a3f0f6fe4a57449a91866b7; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_376a3f0f6fe4a57449a91866b7" ON public.reservation_users_user USING btree ("userId");


--
-- TOC entry 3289 (class 1259 OID 20389)
-- Name: IDX_6a541cb9fe44226bebff2972ce; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_6a541cb9fe44226bebff2972ce" ON public.food_ingredients_ingredient USING btree ("foodId");


--
-- TOC entry 3316 (class 1259 OID 20390)
-- Name: IDX_72ede4f9fe343f1bc62323e3ee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_72ede4f9fe343f1bc62323e3ee" ON public.reservation_users_user USING btree ("reservationId");


--
-- TOC entry 3290 (class 1259 OID 20391)
-- Name: IDX_7bde41301bbe525aab2cc76f63; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7bde41301bbe525aab2cc76f63" ON public.food_ingredients_ingredient USING btree ("ingredientId");


--
-- TOC entry 3301 (class 1259 OID 20392)
-- Name: IDX_7ece720c39593ae154e256117e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7ece720c39593ae154e256117e" ON public.order_detail_ingredients_ingredient USING btree ("orderDetailId");


--
-- TOC entry 3302 (class 1259 OID 20393)
-- Name: IDX_ceefd0d362ae9392a133e6631a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_ceefd0d362ae9392a133e6631a" ON public.order_detail_ingredients_ingredient USING btree ("ingredientId");


--
-- TOC entry 3310 (class 1259 OID 20394)
-- Name: IDX_e4688651cafd7be671088e5737; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e4688651cafd7be671088e5737" ON public.reservation_customers_user USING btree ("userId");


--
-- TOC entry 3335 (class 2606 OID 20706)
-- Name: order_detail FK_0427dc0aa7c61eccc132d9daab2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_0427dc0aa7c61eccc132d9daab2" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 3345 (class 2606 OID 20395)
-- Name: reservation_food FK_0980b7bbd27281c66f652d5f887; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_food
    ADD CONSTRAINT "FK_0980b7bbd27281c66f652d5f887" FOREIGN KEY ("reservationId") REFERENCES public.reservation(id);


--
-- TOC entry 3328 (class 2606 OID 20400)
-- Name: daysopen FK_0a42a99a85bac74cdc4154d38a1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daysopen
    ADD CONSTRAINT "FK_0a42a99a85bac74cdc4154d38a1" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3336 (class 2606 OID 20405)
-- Name: order_detail FK_176c75e9405cb6cb95a6377af00; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_176c75e9405cb6cb95a6377af00" FOREIGN KEY (food_id) REFERENCES public.food(id);


--
-- TOC entry 3350 (class 2606 OID 20410)
-- Name: staff FK_1b1658ba3bb205874b325403b08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT "FK_1b1658ba3bb205874b325403b08" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3343 (class 2606 OID 20415)
-- Name: reservation_customers_user FK_36f40349ae6c124fd51b0f7d98e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_customers_user
    ADD CONSTRAINT "FK_36f40349ae6c124fd51b0f7d98e" FOREIGN KEY ("reservationId") REFERENCES public.reservation(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3347 (class 2606 OID 20420)
-- Name: reservation_users_user FK_376a3f0f6fe4a57449a91866b73; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_users_user
    ADD CONSTRAINT "FK_376a3f0f6fe4a57449a91866b73" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- TOC entry 3334 (class 2606 OID 20701)
-- Name: notification FK_3c3129191b6361ccc34db617563; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "FK_3c3129191b6361ccc34db617563" FOREIGN KEY (id_receiver) REFERENCES public."user"(id);


--
-- TOC entry 3329 (class 2606 OID 20430)
-- Name: food FK_5149a648c96d6c3c7c670b500d6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT "FK_5149a648c96d6c3c7c670b500d6" FOREIGN KEY (menu_id) REFERENCES public.menu(id);


--
-- TOC entry 3349 (class 2606 OID 20435)
-- Name: restaurant FK_5a6420c3086d9d50d001cc01713; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT "FK_5a6420c3086d9d50d001cc01713" FOREIGN KEY (menu_id) REFERENCES public.menu(id);


--
-- TOC entry 3330 (class 2606 OID 20440)
-- Name: food_ingredient FK_635a1bc3d64baddf1a2a29359f7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_ingredient
    ADD CONSTRAINT "FK_635a1bc3d64baddf1a2a29359f7" FOREIGN KEY (id_ingredient) REFERENCES public.ingredient(id);


--
-- TOC entry 3332 (class 2606 OID 20445)
-- Name: food_ingredients_ingredient FK_6a541cb9fe44226bebff2972ce4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_ingredients_ingredient
    ADD CONSTRAINT "FK_6a541cb9fe44226bebff2972ce4" FOREIGN KEY ("foodId") REFERENCES public.food(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3348 (class 2606 OID 20450)
-- Name: reservation_users_user FK_72ede4f9fe343f1bc62323e3ee7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_users_user
    ADD CONSTRAINT "FK_72ede4f9fe343f1bc62323e3ee7" FOREIGN KEY ("reservationId") REFERENCES public.reservation(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3337 (class 2606 OID 20455)
-- Name: order_detail FK_73c5df246d4307f6abb1071be42; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_73c5df246d4307f6abb1071be42" FOREIGN KEY (reservation_id) REFERENCES public.reservation(id);


--
-- TOC entry 3333 (class 2606 OID 20460)
-- Name: food_ingredients_ingredient FK_7bde41301bbe525aab2cc76f638; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_ingredients_ingredient
    ADD CONSTRAINT "FK_7bde41301bbe525aab2cc76f638" FOREIGN KEY ("ingredientId") REFERENCES public.ingredient(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3340 (class 2606 OID 20465)
-- Name: order_ingredients FK_7da4442195347fd0134422a8f6d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_ingredients
    ADD CONSTRAINT "FK_7da4442195347fd0134422a8f6d" FOREIGN KEY (ingredient_id) REFERENCES public.ingredient(id);


--
-- TOC entry 3338 (class 2606 OID 20470)
-- Name: order_detail_ingredients_ingredient FK_7ece720c39593ae154e256117e3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail_ingredients_ingredient
    ADD CONSTRAINT "FK_7ece720c39593ae154e256117e3" FOREIGN KEY ("orderDetailId") REFERENCES public.order_detail(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3342 (class 2606 OID 20475)
-- Name: reservation FK_b8e66a59e3500c7a85cde4fb020; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "FK_b8e66a59e3500c7a85cde4fb020" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3351 (class 2606 OID 20485)
-- Name: staff FK_cec9365d9fc3a3409158b645f2e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 3339 (class 2606 OID 20490)
-- Name: order_detail_ingredients_ingredient FK_ceefd0d362ae9392a133e6631a3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail_ingredients_ingredient
    ADD CONSTRAINT "FK_ceefd0d362ae9392a133e6631a3" FOREIGN KEY ("ingredientId") REFERENCES public.ingredient(id);


--
-- TOC entry 3327 (class 2606 OID 20495)
-- Name: day FK_d12113dbb319e40a89b0989a006; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.day
    ADD CONSTRAINT "FK_d12113dbb319e40a89b0989a006" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3346 (class 2606 OID 20500)
-- Name: reservation_food FK_d637437b54202dd983be7d82063; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_food
    ADD CONSTRAINT "FK_d637437b54202dd983be7d82063" FOREIGN KEY ("foodId") REFERENCES public.food(id);


--
-- TOC entry 3344 (class 2606 OID 20505)
-- Name: reservation_customers_user FK_e4688651cafd7be671088e5737e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_customers_user
    ADD CONSTRAINT "FK_e4688651cafd7be671088e5737e" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- TOC entry 3341 (class 2606 OID 20510)
-- Name: order_ingredients FK_f8b1304cce6d30e5bcb7abcc08c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_ingredients
    ADD CONSTRAINT "FK_f8b1304cce6d30e5bcb7abcc08c" FOREIGN KEY (order_id) REFERENCES public.order_detail(id) ON DELETE CASCADE;


--
-- TOC entry 3331 (class 2606 OID 20515)
-- Name: food_ingredient FK_f9553e6a77da903d8c6915a336a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_ingredient
    ADD CONSTRAINT "FK_f9553e6a77da903d8c6915a336a" FOREIGN KEY (id_food) REFERENCES public.food(id);


-- Completed on 2024-05-29 12:58:22

--
-- PostgreSQL database dump complete
--

