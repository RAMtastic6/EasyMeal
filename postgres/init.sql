--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2024-05-09 18:21:02

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
-- TOC entry 894 (class 1247 OID 19876)
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
-- TOC entry 873 (class 1247 OID 19302)
-- Name: daysopen_day_open_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.daysopen_day_open_enum AS ENUM (
    'domenica',
    'lunedì',
    'martedì',
    'mercoledì',
    'giovedì',
    'venerdì',
    'sabato'
);


ALTER TYPE public.daysopen_day_open_enum OWNER TO postgres;

--
-- TOC entry 900 (class 1247 OID 19920)
-- Name: food_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.food_type_enum AS ENUM (
    'apertivo',
    'primo',
    'secondo',
    'contorno',
    'dolce',
    'bevanda',
    'caffè',
    'pizza'
);


ALTER TYPE public.food_type_enum OWNER TO postgres;

--
-- TOC entry 882 (class 1247 OID 19597)
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
-- TOC entry 222 (class 1259 OID 19167)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    surname character varying(30) NOT NULL,
    email character varying(256) NOT NULL,
    password character varying(256) NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 19166)
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
-- TOC entry 232 (class 1259 OID 19891)
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
-- TOC entry 214 (class 1259 OID 19133)
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
-- TOC entry 218 (class 1259 OID 19145)
-- Name: food; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food (
    id integer NOT NULL,
    menu_id integer NOT NULL,
    name character varying(100) NOT NULL,
    price double precision NOT NULL,
    path_image character varying(255) DEFAULT ''::character varying NOT NULL,
    type public.food_type_enum DEFAULT 'apertivo'::public.food_type_enum NOT NULL
);


ALTER TABLE public.food OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 19144)
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
-- TOC entry 231 (class 1259 OID 19742)
-- Name: food_ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food_ingredient (
    id_food integer NOT NULL,
    id_ingredient integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE public.food_ingredient OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 19732)
-- Name: ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredient (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.ingredient OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 19731)
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
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 229
-- Name: ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredient_id_seq OWNED BY public.ingredient.id;


--
-- TOC entry 216 (class 1259 OID 19139)
-- Name: menu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.menu OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 19138)
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
-- TOC entry 226 (class 1259 OID 19375)
-- Name: order_detail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_detail (
    quantity integer DEFAULT 1 NOT NULL,
    customer_id integer NOT NULL,
    reservation_id integer NOT NULL,
    food_id integer NOT NULL
);


ALTER TABLE public.order_detail OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 19173)
-- Name: reservation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation (
    id integer NOT NULL,
    date timestamp without time zone NOT NULL,
    number_people integer NOT NULL,
    restaurant_id integer NOT NULL,
    state character varying DEFAULT 'pending'::character varying NOT NULL
);


ALTER TABLE public.reservation OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 19183)
-- Name: reservation_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_group (
    reservation_id integer NOT NULL,
    customer_id integer NOT NULL
);


ALTER TABLE public.reservation_group OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 19172)
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
-- TOC entry 220 (class 1259 OID 19156)
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
-- TOC entry 219 (class 1259 OID 19155)
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
-- TOC entry 228 (class 1259 OID 19630)
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
-- TOC entry 227 (class 1259 OID 19629)
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
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 227
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- TOC entry 3242 (class 2604 OID 19735)
-- Name: ingredient id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient ALTER COLUMN id SET DEFAULT nextval('public.ingredient_id_seq'::regclass);


--
-- TOC entry 3240 (class 2604 OID 19633)
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- TOC entry 3443 (class 0 OID 19891)
-- Dependencies: 232
-- Data for Name: day; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3425 (class 0 OID 19133)
-- Dependencies: 214
-- Data for Name: daysopen; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, 'lunedì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, 'martedì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, 'mercoledì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, 'giovedì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, 'venerdì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, 'lunedì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, 'martedì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, 'mercoledì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, 'giovedì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (1, 'venerdì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, 'lunedì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, 'martedì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, 'mercoledì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, 'giovedì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, 'venerdì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, 'lunedì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, 'martedì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, 'mercoledì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, 'giovedì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (2, 'venerdì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, 'lunedì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, 'martedì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, 'mercoledì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, 'giovedì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, 'venerdì', '12:00:00', '15:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, 'lunedì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, 'martedì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, 'mercoledì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, 'giovedì', '19:00:00', '23:00:00');
INSERT INTO public.daysopen (restaurant_id, day_open, opening, closing) VALUES (3, 'venerdì', '19:00:00', '23:00:00');


--
-- TOC entry 3429 (class 0 OID 19145)
-- Dependencies: 218
-- Data for Name: food; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (2, 1, 'Spaghetti all''amatriciana', 9, '', 'apertivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (3, 1, 'Spaghetti al pomodoro', 8, '', 'apertivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (4, 2, 'Riso alla cantonese', 10, '', 'apertivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (5, 2, 'Riso fritto', 9, '', 'apertivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (7, 3, 'Pizza margherita', 10, '', 'apertivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (8, 3, 'Pizza marinara', 9, '', 'apertivo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (9, 3, 'Pizza capricciosa', 8, '', 'pizza');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (6, 2, 'Riso saltato', 8, '', 'primo');
INSERT INTO public.food (id, menu_id, name, price, path_image, type) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'Spaghetti alla carbonara', 10, '', 'secondo');


--
-- TOC entry 3442 (class 0 OID 19742)
-- Dependencies: 231
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
-- TOC entry 3441 (class 0 OID 19732)
-- Dependencies: 230
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
-- TOC entry 3427 (class 0 OID 19139)
-- Dependencies: 216
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.menu (id, name) OVERRIDING SYSTEM VALUE VALUES (1, 'Menu 1');
INSERT INTO public.menu (id, name) OVERRIDING SYSTEM VALUE VALUES (2, 'Menu 2');
INSERT INTO public.menu (id, name) OVERRIDING SYSTEM VALUE VALUES (3, 'Menu 3');


--
-- TOC entry 3437 (class 0 OID 19375)
-- Dependencies: 226
-- Data for Name: order_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_detail (quantity, customer_id, reservation_id, food_id) VALUES (1, 1, 1, 2);
INSERT INTO public.order_detail (quantity, customer_id, reservation_id, food_id) VALUES (1, 1, 1, 3);
INSERT INTO public.order_detail (quantity, customer_id, reservation_id, food_id) VALUES (20, 1, 1, 1);
INSERT INTO public.order_detail (quantity, customer_id, reservation_id, food_id) VALUES (30, 4, 11, 6);
INSERT INTO public.order_detail (quantity, customer_id, reservation_id, food_id) VALUES (3, 4, 11, 5);
INSERT INTO public.order_detail (quantity, customer_id, reservation_id, food_id) VALUES (7, 4, 11, 4);


--
-- TOC entry 3435 (class 0 OID 19173)
-- Dependencies: 224
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (1, '2023-05-05 00:00:00', 1, 1, 'pending');
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (2, '2024-03-26 20:20:00', 20, 1, 'pending');
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (3, '2024-03-26 20:20:00', 20, 1, 'pending');
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (4, '2024-04-03 20:20:00', 20, 1, 'pending');
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (5, '2024-04-03 20:20:00', 20, 1, 'pending');
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (6, '2024-04-03 20:20:00', 20, 1, 'pending');
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (7, '2024-04-09 20:20:00', 20, 1, 'pending');
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (8, '2024-04-18 20:20:00', 20, 1, 'pending');
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (9, '2220-02-10 20:20:00', 1000000, 1, 'pending');
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (10, '2222-02-20 20:20:00', 20, 1, 'pending');
INSERT INTO public.reservation (id, date, number_people, restaurant_id, state) OVERRIDING SYSTEM VALUE VALUES (11, '2222-02-20 20:20:00', 20000, 2, 'pending');


--
-- TOC entry 3436 (class 0 OID 19183)
-- Dependencies: 225
-- Data for Name: reservation_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (4, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (5, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (6, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (7, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (8, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (9, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (10, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (11, 1);


--
-- TOC entry 3431 (class 0 OID 19156)
-- Dependencies: 220
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.restaurant (id, name, address, city, cuisine, menu_id, tables, email, phone_number, image, description) OVERRIDING SYSTEM VALUE VALUES (1, 'Ristorante 1', 'Via Roma', 'Roma', 'italiana', 1, 100, 'test1', 'test1', NULL, NULL);
INSERT INTO public.restaurant (id, name, address, city, cuisine, menu_id, tables, email, phone_number, image, description) OVERRIDING SYSTEM VALUE VALUES (2, 'Ristorante 2', 'Via Milano', 'Milano', 'cinese', 2, 100, 'test2', 'test2', NULL, NULL);
INSERT INTO public.restaurant (id, name, address, city, cuisine, menu_id, tables, email, phone_number, image, description) OVERRIDING SYSTEM VALUE VALUES (3, 'Ristorante 3', 'Via Napoli', 'Napoli', 'pizza', 3, 100, 'test3', 'test3', NULL, NULL);


--
-- TOC entry 3439 (class 0 OID 19630)
-- Dependencies: 228
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3433 (class 0 OID 19167)
-- Dependencies: 222
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" (id, name, surname, email, password, role) OVERRIDING SYSTEM VALUE VALUES (2, 'test', 'test', 'test@', '$2b$13$2Lq3jwxdtHBt2JEFPPp7defEUHaFy2LJMjRW.bpqeV6Nt01efkCVS', 'user');
INSERT INTO public."user" (id, name, surname, email, password, role) OVERRIDING SYSTEM VALUE VALUES (1, 'user', 'user', 'user', '$2a$13$NW44gn3XjLD1FjWz9egcluOVhjYWn7dX/nCM4awO2JpjmLwAyYB46', 'user');
INSERT INTO public."user" (id, name, surname, email, password, role) OVERRIDING SYSTEM VALUE VALUES (3, 'test', 'test', 'dc@dc', '$2b$13$zeeUkesLTm2PuYjK0HMpbO6Ior.9ODKWzaQYurI4Lm9sstu8R7jPq', 'user');
INSERT INTO public."user" (id, name, surname, email, password, role) OVERRIDING SYSTEM VALUE VALUES (4, 'dc', 'dc', 'dc@', '$2b$13$sOqnpSq4PnqCEPhA9Zj1leHA1VV3lQ5fm3Z9eYtnFY3617/jbtkfG', 'user');


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 221
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_id_seq', 4, true);


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 217
-- Name: food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.food_id_seq', 9, true);


--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 229
-- Name: ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ingredient_id_seq', 89, true);


--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 215
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_id_seq', 3, true);


--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 223
-- Name: reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_id_seq', 11, true);


--
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 219
-- Name: restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurant_id_seq', 3, true);


--
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 227
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_id_seq', 1, false);


--
-- TOC entry 3268 (class 2606 OID 19895)
-- Name: day PK_85468867ae69ba9a668eb33c184; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.day
    ADD CONSTRAINT "PK_85468867ae69ba9a668eb33c184" PRIMARY KEY (restaurant_id, day_open, opening);


--
-- TOC entry 3250 (class 2606 OID 19226)
-- Name: restaurant UQ_5a6420c3086d9d50d001cc01713; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT "UQ_5a6420c3086d9d50d001cc01713" UNIQUE (menu_id);


--
-- TOC entry 3254 (class 2606 OID 19171)
-- Name: user customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- TOC entry 3244 (class 2606 OID 19318)
-- Name: daysopen daysopen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daysopen
    ADD CONSTRAINT daysopen_pkey PRIMARY KEY (restaurant_id, day_open, opening);


--
-- TOC entry 3266 (class 2606 OID 19747)
-- Name: food_ingredient food_ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_ingredient
    ADD CONSTRAINT food_ingredient_pkey PRIMARY KEY (id_food, id_ingredient);


--
-- TOC entry 3248 (class 2606 OID 19254)
-- Name: food food_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_pkey PRIMARY KEY (id);


--
-- TOC entry 3264 (class 2606 OID 19737)
-- Name: ingredient ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_pkey PRIMARY KEY (id);


--
-- TOC entry 3246 (class 2606 OID 19143)
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 19380)
-- Name: order_detail order_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT order_detail_pkey PRIMARY KEY (customer_id, reservation_id, food_id);


--
-- TOC entry 3258 (class 2606 OID 19187)
-- Name: reservation_group reservation_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_group
    ADD CONSTRAINT reservation_group_pkey PRIMARY KEY (reservation_id, customer_id);


--
-- TOC entry 3256 (class 2606 OID 19177)
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (id);


--
-- TOC entry 3252 (class 2606 OID 19160)
-- Name: restaurant restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);


--
-- TOC entry 3262 (class 2606 OID 19636)
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- TOC entry 3269 (class 2606 OID 19323)
-- Name: daysopen FK_0a42a99a85bac74cdc4154d38a1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daysopen
    ADD CONSTRAINT "FK_0a42a99a85bac74cdc4154d38a1" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3275 (class 2606 OID 19402)
-- Name: order_detail FK_176c75e9405cb6cb95a6377af00; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_176c75e9405cb6cb95a6377af00" FOREIGN KEY (food_id) REFERENCES public.food(id);


--
-- TOC entry 3278 (class 2606 OID 19710)
-- Name: staff FK_1b1658ba3bb205874b325403b08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT "FK_1b1658ba3bb205874b325403b08" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3270 (class 2606 OID 19213)
-- Name: food FK_5149a648c96d6c3c7c670b500d6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT "FK_5149a648c96d6c3c7c670b500d6" FOREIGN KEY (menu_id) REFERENCES public.menu(id);


--
-- TOC entry 3271 (class 2606 OID 19227)
-- Name: restaurant FK_5a6420c3086d9d50d001cc01713; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT "FK_5a6420c3086d9d50d001cc01713" FOREIGN KEY (menu_id) REFERENCES public.menu(id);


--
-- TOC entry 3273 (class 2606 OID 19328)
-- Name: reservation_group FK_5e20008280cf4827cab610088b9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_group
    ADD CONSTRAINT "FK_5e20008280cf4827cab610088b9" FOREIGN KEY (reservation_id) REFERENCES public.reservation(id);


--
-- TOC entry 3280 (class 2606 OID 19780)
-- Name: food_ingredient FK_635a1bc3d64baddf1a2a29359f7; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_ingredient
    ADD CONSTRAINT "FK_635a1bc3d64baddf1a2a29359f7" FOREIGN KEY (id_ingredient) REFERENCES public.ingredient(id);


--
-- TOC entry 3274 (class 2606 OID 19333)
-- Name: reservation_group FK_6c218069a2d6f54685067c744fc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_group
    ADD CONSTRAINT "FK_6c218069a2d6f54685067c744fc" FOREIGN KEY (customer_id) REFERENCES public."user"(id);


--
-- TOC entry 3276 (class 2606 OID 19412)
-- Name: order_detail FK_73c5df246d4307f6abb1071be42; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_73c5df246d4307f6abb1071be42" FOREIGN KEY (reservation_id) REFERENCES public.reservation(id);


--
-- TOC entry 3272 (class 2606 OID 19428)
-- Name: reservation FK_b8e66a59e3500c7a85cde4fb020; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "FK_b8e66a59e3500c7a85cde4fb020" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3277 (class 2606 OID 19407)
-- Name: order_detail FK_c2a7f2de6b58c7c5ccf4303e1aa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_c2a7f2de6b58c7c5ccf4303e1aa" FOREIGN KEY (customer_id) REFERENCES public."user"(id);


--
-- TOC entry 3279 (class 2606 OID 19715)
-- Name: staff FK_cec9365d9fc3a3409158b645f2e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- TOC entry 3282 (class 2606 OID 19914)
-- Name: day FK_d12113dbb319e40a89b0989a006; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.day
    ADD CONSTRAINT "FK_d12113dbb319e40a89b0989a006" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3281 (class 2606 OID 19775)
-- Name: food_ingredient FK_f9553e6a77da903d8c6915a336a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_ingredient
    ADD CONSTRAINT "FK_f9553e6a77da903d8c6915a336a" FOREIGN KEY (id_food) REFERENCES public.food(id);


-- Completed on 2024-05-09 18:21:02

--
-- PostgreSQL database dump complete
--

