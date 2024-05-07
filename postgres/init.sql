--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2024-05-07 15:51:39

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
-- TOC entry 869 (class 1247 OID 19302)
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
-- TOC entry 887 (class 1247 OID 19700)
-- Name: role_user; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_user AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.role_user OWNER TO postgres;

--
-- TOC entry 884 (class 1247 OID 19648)
-- Name: staff_ruolo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.staff_ruolo_enum AS ENUM (
    'admin',
    'staff'
);


ALTER TYPE public.staff_ruolo_enum OWNER TO postgres;

--
-- TOC entry 878 (class 1247 OID 19597)
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
    role public.role_user DEFAULT 'user'::public.role_user
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
    price double precision NOT NULL
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
    pending boolean DEFAULT true NOT NULL
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
    menu_id integer NOT NULL,
    tables integer NOT NULL,
    email character varying(256) NOT NULL,
    phone_number character varying(20) NOT NULL
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
    ruolo public.staff_ruolo_enum DEFAULT 'staff'::public.staff_ruolo_enum NOT NULL,
    restaurant_id integer,
    user_id integer
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
-- TOC entry 3420 (class 0 OID 0)
-- Dependencies: 227
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- TOC entry 3225 (class 2604 OID 19633)
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- TOC entry 3400 (class 0 OID 19133)
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
-- TOC entry 3404 (class 0 OID 19145)
-- Dependencies: 218
-- Data for Name: food; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.food (id, menu_id, name, price) OVERRIDING SYSTEM VALUE VALUES (1, 1, 'Spaghetti alla carbonara', 10);
INSERT INTO public.food (id, menu_id, name, price) OVERRIDING SYSTEM VALUE VALUES (2, 1, 'Spaghetti all''amatriciana', 9);
INSERT INTO public.food (id, menu_id, name, price) OVERRIDING SYSTEM VALUE VALUES (3, 1, 'Spaghetti al pomodoro', 8);
INSERT INTO public.food (id, menu_id, name, price) OVERRIDING SYSTEM VALUE VALUES (4, 2, 'Riso alla cantonese', 10);
INSERT INTO public.food (id, menu_id, name, price) OVERRIDING SYSTEM VALUE VALUES (5, 2, 'Riso fritto', 9);
INSERT INTO public.food (id, menu_id, name, price) OVERRIDING SYSTEM VALUE VALUES (6, 2, 'Riso saltato', 8);
INSERT INTO public.food (id, menu_id, name, price) OVERRIDING SYSTEM VALUE VALUES (7, 3, 'Pizza margherita', 10);
INSERT INTO public.food (id, menu_id, name, price) OVERRIDING SYSTEM VALUE VALUES (8, 3, 'Pizza marinara', 9);
INSERT INTO public.food (id, menu_id, name, price) OVERRIDING SYSTEM VALUE VALUES (9, 3, 'Pizza capricciosa', 8);


--
-- TOC entry 3402 (class 0 OID 19139)
-- Dependencies: 216
-- Data for Name: menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.menu (id, name) OVERRIDING SYSTEM VALUE VALUES (1, 'Menu 1');
INSERT INTO public.menu (id, name) OVERRIDING SYSTEM VALUE VALUES (2, 'Menu 2');
INSERT INTO public.menu (id, name) OVERRIDING SYSTEM VALUE VALUES (3, 'Menu 3');


--
-- TOC entry 3412 (class 0 OID 19375)
-- Dependencies: 226
-- Data for Name: order_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.order_detail (quantity, customer_id, reservation_id, food_id) VALUES (1, 1, 1, 2);
INSERT INTO public.order_detail (quantity, customer_id, reservation_id, food_id) VALUES (1, 1, 1, 3);
INSERT INTO public.order_detail (quantity, customer_id, reservation_id, food_id) VALUES (20, 1, 1, 1);


--
-- TOC entry 3410 (class 0 OID 19173)
-- Dependencies: 224
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reservation (id, date, number_people, restaurant_id, pending) OVERRIDING SYSTEM VALUE VALUES (1, '2023-05-05 00:00:00', 1, 1, true);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, pending) OVERRIDING SYSTEM VALUE VALUES (2, '2024-03-26 20:20:00', 20, 1, true);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, pending) OVERRIDING SYSTEM VALUE VALUES (3, '2024-03-26 20:20:00', 20, 1, true);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, pending) OVERRIDING SYSTEM VALUE VALUES (4, '2024-04-03 20:20:00', 20, 1, true);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, pending) OVERRIDING SYSTEM VALUE VALUES (5, '2024-04-03 20:20:00', 20, 1, true);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, pending) OVERRIDING SYSTEM VALUE VALUES (6, '2024-04-03 20:20:00', 20, 1, true);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, pending) OVERRIDING SYSTEM VALUE VALUES (7, '2024-04-09 20:20:00', 20, 1, true);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, pending) OVERRIDING SYSTEM VALUE VALUES (8, '2024-04-18 20:20:00', 20, 1, true);
INSERT INTO public.reservation (id, date, number_people, restaurant_id, pending) OVERRIDING SYSTEM VALUE VALUES (9, '2220-02-10 20:20:00', 1000000, 1, true);


--
-- TOC entry 3411 (class 0 OID 19183)
-- Dependencies: 225
-- Data for Name: reservation_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (4, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (5, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (6, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (7, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (8, 1);
INSERT INTO public.reservation_group (reservation_id, customer_id) VALUES (9, 1);


--
-- TOC entry 3406 (class 0 OID 19156)
-- Dependencies: 220
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.restaurant (id, name, address, city, cuisine, menu_id, tables, email, phone_number) OVERRIDING SYSTEM VALUE VALUES (1, 'Ristorante 1', 'Via Roma', 'Roma', 'italiana', 1, 100, 'test1', 'test1');
INSERT INTO public.restaurant (id, name, address, city, cuisine, menu_id, tables, email, phone_number) OVERRIDING SYSTEM VALUE VALUES (2, 'Ristorante 2', 'Via Milano', 'Milano', 'cinese', 2, 100, 'test2', 'test2');
INSERT INTO public.restaurant (id, name, address, city, cuisine, menu_id, tables, email, phone_number) OVERRIDING SYSTEM VALUE VALUES (3, 'Ristorante 3', 'Via Napoli', 'Napoli', 'pizza', 3, 100, 'test3', 'test3');


--
-- TOC entry 3414 (class 0 OID 19630)
-- Dependencies: 228
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3408 (class 0 OID 19167)
-- Dependencies: 222
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" (id, name, surname, email, password, role) OVERRIDING SYSTEM VALUE VALUES (1, 'user', 'user', 'user', '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb', 'user');


--
-- TOC entry 3421 (class 0 OID 0)
-- Dependencies: 221
-- Name: customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_id_seq', 1, true);


--
-- TOC entry 3422 (class 0 OID 0)
-- Dependencies: 217
-- Name: food_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.food_id_seq', 9, true);


--
-- TOC entry 3423 (class 0 OID 0)
-- Dependencies: 215
-- Name: menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_id_seq', 3, true);


--
-- TOC entry 3424 (class 0 OID 0)
-- Dependencies: 223
-- Name: reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservation_id_seq', 9, true);


--
-- TOC entry 3425 (class 0 OID 0)
-- Dependencies: 219
-- Name: restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.restaurant_id_seq', 3, true);


--
-- TOC entry 3426 (class 0 OID 0)
-- Dependencies: 227
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_id_seq', 1, false);


--
-- TOC entry 3234 (class 2606 OID 19226)
-- Name: restaurant UQ_5a6420c3086d9d50d001cc01713; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT "UQ_5a6420c3086d9d50d001cc01713" UNIQUE (menu_id);


--
-- TOC entry 3238 (class 2606 OID 19171)
-- Name: user customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- TOC entry 3228 (class 2606 OID 19318)
-- Name: daysopen daysopen_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daysopen
    ADD CONSTRAINT daysopen_pkey PRIMARY KEY (restaurant_id, day_open, opening);


--
-- TOC entry 3232 (class 2606 OID 19254)
-- Name: food food_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_pkey PRIMARY KEY (id);


--
-- TOC entry 3230 (class 2606 OID 19143)
-- Name: menu menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);


--
-- TOC entry 3244 (class 2606 OID 19380)
-- Name: order_detail order_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT order_detail_pkey PRIMARY KEY (customer_id, reservation_id, food_id);


--
-- TOC entry 3242 (class 2606 OID 19187)
-- Name: reservation_group reservation_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_group
    ADD CONSTRAINT reservation_group_pkey PRIMARY KEY (reservation_id, customer_id);


--
-- TOC entry 3240 (class 2606 OID 19177)
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (id);


--
-- TOC entry 3236 (class 2606 OID 19160)
-- Name: restaurant restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);


--
-- TOC entry 3246 (class 2606 OID 19636)
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- TOC entry 3247 (class 2606 OID 19323)
-- Name: daysopen FK_0a42a99a85bac74cdc4154d38a1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daysopen
    ADD CONSTRAINT "FK_0a42a99a85bac74cdc4154d38a1" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3253 (class 2606 OID 19402)
-- Name: order_detail FK_176c75e9405cb6cb95a6377af00; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_176c75e9405cb6cb95a6377af00" FOREIGN KEY (food_id) REFERENCES public.food(id);


--
-- TOC entry 3256 (class 2606 OID 19658)
-- Name: staff FK_1b1658ba3bb205874b325403b08; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT "FK_1b1658ba3bb205874b325403b08" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3248 (class 2606 OID 19213)
-- Name: food FK_5149a648c96d6c3c7c670b500d6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food
    ADD CONSTRAINT "FK_5149a648c96d6c3c7c670b500d6" FOREIGN KEY (menu_id) REFERENCES public.menu(id);


--
-- TOC entry 3249 (class 2606 OID 19227)
-- Name: restaurant FK_5a6420c3086d9d50d001cc01713; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT "FK_5a6420c3086d9d50d001cc01713" FOREIGN KEY (menu_id) REFERENCES public.menu(id);


--
-- TOC entry 3251 (class 2606 OID 19328)
-- Name: reservation_group FK_5e20008280cf4827cab610088b9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_group
    ADD CONSTRAINT "FK_5e20008280cf4827cab610088b9" FOREIGN KEY (reservation_id) REFERENCES public.reservation(id);


--
-- TOC entry 3252 (class 2606 OID 19333)
-- Name: reservation_group FK_6c218069a2d6f54685067c744fc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_group
    ADD CONSTRAINT "FK_6c218069a2d6f54685067c744fc" FOREIGN KEY (customer_id) REFERENCES public."user"(id);


--
-- TOC entry 3254 (class 2606 OID 19412)
-- Name: order_detail FK_73c5df246d4307f6abb1071be42; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_73c5df246d4307f6abb1071be42" FOREIGN KEY (reservation_id) REFERENCES public.reservation(id);


--
-- TOC entry 3250 (class 2606 OID 19428)
-- Name: reservation FK_b8e66a59e3500c7a85cde4fb020; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "FK_b8e66a59e3500c7a85cde4fb020" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);


--
-- TOC entry 3255 (class 2606 OID 19407)
-- Name: order_detail FK_c2a7f2de6b58c7c5ccf4303e1aa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_c2a7f2de6b58c7c5ccf4303e1aa" FOREIGN KEY (customer_id) REFERENCES public."user"(id);


--
-- TOC entry 3257 (class 2606 OID 19663)
-- Name: staff FK_cec9365d9fc3a3409158b645f2e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e" FOREIGN KEY (user_id) REFERENCES public."user"(id);


-- Completed on 2024-05-07 15:51:39

--
-- PostgreSQL database dump complete
--

