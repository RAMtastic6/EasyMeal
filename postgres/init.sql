PGDMP     ;    .                |        	   easy-meal    15.2    15.2 ;    S           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            T           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            U           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            V           1262    19102 	   easy-meal    DATABASE     ~   CREATE DATABASE "easy-meal" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Italian_Italy.1252';
    DROP DATABASE "easy-meal";
                postgres    false            e           1247    19302    daysopen_day_open_enum    TYPE     �   CREATE TYPE public.daysopen_day_open_enum AS ENUM (
    'domenica',
    'lunedì',
    'martedì',
    'mercoledì',
    'giovedì',
    'venerdì',
    'sabato'
);
 )   DROP TYPE public.daysopen_day_open_enum;
       public          postgres    false            n           1247    19597    user_role_enum    TYPE     d   CREATE TYPE public.user_role_enum AS ENUM (
    'admin',
    'customer',
    'staff',
    'user'
);
 !   DROP TYPE public.user_role_enum;
       public          postgres    false            �            1259    19167    user    TABLE     -  CREATE TABLE public."user" (
    id integer NOT NULL,
    name character varying(30) NOT NULL,
    surname character varying(30) NOT NULL,
    email character varying(256) NOT NULL,
    password character varying(256) NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL
);
    DROP TABLE public."user";
       public         heap    postgres    false            �            1259    19166    customer_id_seq    SEQUENCE     �   ALTER TABLE public."user" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    222            �            1259    19133    daysopen    TABLE     �   CREATE TABLE public.daysopen (
    restaurant_id integer NOT NULL,
    day_open public.daysopen_day_open_enum NOT NULL,
    opening time without time zone NOT NULL,
    closing time without time zone NOT NULL
);
    DROP TABLE public.daysopen;
       public         heap    postgres    false    869            �            1259    19145    food    TABLE     �   CREATE TABLE public.food (
    id integer NOT NULL,
    menu_id integer NOT NULL,
    name character varying(100) NOT NULL,
    price double precision NOT NULL
);
    DROP TABLE public.food;
       public         heap    postgres    false            �            1259    19144    food_id_seq    SEQUENCE     �   ALTER TABLE public.food ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.food_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    218            �            1259    19139    menu    TABLE     `   CREATE TABLE public.menu (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);
    DROP TABLE public.menu;
       public         heap    postgres    false            �            1259    19138    menu_id_seq    SEQUENCE     �   ALTER TABLE public.menu ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.menu_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    216            �            1259    19375    order_detail    TABLE     �   CREATE TABLE public.order_detail (
    quantity integer DEFAULT 1 NOT NULL,
    customer_id integer NOT NULL,
    reservation_id integer NOT NULL,
    food_id integer NOT NULL
);
     DROP TABLE public.order_detail;
       public         heap    postgres    false            �            1259    19173    reservation    TABLE     �   CREATE TABLE public.reservation (
    id integer NOT NULL,
    date timestamp without time zone NOT NULL,
    number_people integer NOT NULL,
    restaurant_id integer NOT NULL,
    pending boolean DEFAULT true NOT NULL
);
    DROP TABLE public.reservation;
       public         heap    postgres    false            �            1259    19183    reservation_group    TABLE     q   CREATE TABLE public.reservation_group (
    reservation_id integer NOT NULL,
    customer_id integer NOT NULL
);
 %   DROP TABLE public.reservation_group;
       public         heap    postgres    false            �            1259    19172    reservation_id_seq    SEQUENCE     �   ALTER TABLE public.reservation ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reservation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    224            �            1259    19156 
   restaurant    TABLE     �  CREATE TABLE public.restaurant (
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
    DROP TABLE public.restaurant;
       public         heap    postgres    false            �            1259    19155    restaurant_id_seq    SEQUENCE     �   ALTER TABLE public.restaurant ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.restaurant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    220            �            1259    19630    staff    TABLE     �   CREATE TABLE public.staff (
    id integer NOT NULL,
    restaurant_id integer NOT NULL,
    user_id integer NOT NULL,
    ruolo character varying DEFAULT 'staff'::character varying NOT NULL
);
    DROP TABLE public.staff;
       public         heap    postgres    false            �            1259    19629    staff_id_seq    SEQUENCE     �   CREATE SEQUENCE public.staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.staff_id_seq;
       public          postgres    false    228            W           0    0    staff_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;
          public          postgres    false    227            �           2604    19633    staff id    DEFAULT     d   ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);
 7   ALTER TABLE public.staff ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    227    228            B          0    19133    daysopen 
   TABLE DATA                 public          postgres    false    214   �E       F          0    19145    food 
   TABLE DATA                 public          postgres    false    218   �F       D          0    19139    menu 
   TABLE DATA                 public          postgres    false    216   �G       N          0    19375    order_detail 
   TABLE DATA                 public          postgres    false    226   H       L          0    19173    reservation 
   TABLE DATA                 public          postgres    false    224   �H       M          0    19183    reservation_group 
   TABLE DATA                 public          postgres    false    225   I       H          0    19156 
   restaurant 
   TABLE DATA                 public          postgres    false    220   �I       P          0    19630    staff 
   TABLE DATA                 public          postgres    false    228   �J       J          0    19167    user 
   TABLE DATA                 public          postgres    false    222   
K       X           0    0    customer_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.customer_id_seq', 2, true);
          public          postgres    false    221            Y           0    0    food_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.food_id_seq', 9, true);
          public          postgres    false    217            Z           0    0    menu_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.menu_id_seq', 3, true);
          public          postgres    false    215            [           0    0    reservation_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.reservation_id_seq', 9, true);
          public          postgres    false    223            \           0    0    restaurant_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.restaurant_id_seq', 3, true);
          public          postgres    false    219            ]           0    0    staff_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.staff_id_seq', 1, false);
          public          postgres    false    227            �           2606    19226 )   restaurant UQ_5a6420c3086d9d50d001cc01713 
   CONSTRAINT     i   ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT "UQ_5a6420c3086d9d50d001cc01713" UNIQUE (menu_id);
 U   ALTER TABLE ONLY public.restaurant DROP CONSTRAINT "UQ_5a6420c3086d9d50d001cc01713";
       public            postgres    false    220            �           2606    19171    user customer_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."user" DROP CONSTRAINT customer_pkey;
       public            postgres    false    222            �           2606    19318    daysopen daysopen_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.daysopen
    ADD CONSTRAINT daysopen_pkey PRIMARY KEY (restaurant_id, day_open, opening);
 @   ALTER TABLE ONLY public.daysopen DROP CONSTRAINT daysopen_pkey;
       public            postgres    false    214    214    214            �           2606    19254    food food_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.food
    ADD CONSTRAINT food_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.food DROP CONSTRAINT food_pkey;
       public            postgres    false    218            �           2606    19143    menu menu_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.menu
    ADD CONSTRAINT menu_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.menu DROP CONSTRAINT menu_pkey;
       public            postgres    false    216            �           2606    19380    order_detail order_detail_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT order_detail_pkey PRIMARY KEY (customer_id, reservation_id, food_id);
 H   ALTER TABLE ONLY public.order_detail DROP CONSTRAINT order_detail_pkey;
       public            postgres    false    226    226    226            �           2606    19187 (   reservation_group reservation_group_pkey 
   CONSTRAINT        ALTER TABLE ONLY public.reservation_group
    ADD CONSTRAINT reservation_group_pkey PRIMARY KEY (reservation_id, customer_id);
 R   ALTER TABLE ONLY public.reservation_group DROP CONSTRAINT reservation_group_pkey;
       public            postgres    false    225    225            �           2606    19177    reservation reservation_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.reservation DROP CONSTRAINT reservation_pkey;
       public            postgres    false    224            �           2606    19160    restaurant restaurant_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.restaurant DROP CONSTRAINT restaurant_pkey;
       public            postgres    false    220            �           2606    19636    staff staff_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.staff DROP CONSTRAINT staff_pkey;
       public            postgres    false    228            �           2606    19323 '   daysopen FK_0a42a99a85bac74cdc4154d38a1    FK CONSTRAINT     �   ALTER TABLE ONLY public.daysopen
    ADD CONSTRAINT "FK_0a42a99a85bac74cdc4154d38a1" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);
 S   ALTER TABLE ONLY public.daysopen DROP CONSTRAINT "FK_0a42a99a85bac74cdc4154d38a1";
       public          postgres    false    214    3230    220            �           2606    19402 +   order_detail FK_176c75e9405cb6cb95a6377af00    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_176c75e9405cb6cb95a6377af00" FOREIGN KEY (food_id) REFERENCES public.food(id);
 W   ALTER TABLE ONLY public.order_detail DROP CONSTRAINT "FK_176c75e9405cb6cb95a6377af00";
       public          postgres    false    3226    226    218            �           2606    19710 $   staff FK_1b1658ba3bb205874b325403b08    FK CONSTRAINT     �   ALTER TABLE ONLY public.staff
    ADD CONSTRAINT "FK_1b1658ba3bb205874b325403b08" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);
 P   ALTER TABLE ONLY public.staff DROP CONSTRAINT "FK_1b1658ba3bb205874b325403b08";
       public          postgres    false    220    3230    228            �           2606    19213 #   food FK_5149a648c96d6c3c7c670b500d6    FK CONSTRAINT     �   ALTER TABLE ONLY public.food
    ADD CONSTRAINT "FK_5149a648c96d6c3c7c670b500d6" FOREIGN KEY (menu_id) REFERENCES public.menu(id);
 O   ALTER TABLE ONLY public.food DROP CONSTRAINT "FK_5149a648c96d6c3c7c670b500d6";
       public          postgres    false    218    3224    216            �           2606    19227 )   restaurant FK_5a6420c3086d9d50d001cc01713    FK CONSTRAINT     �   ALTER TABLE ONLY public.restaurant
    ADD CONSTRAINT "FK_5a6420c3086d9d50d001cc01713" FOREIGN KEY (menu_id) REFERENCES public.menu(id);
 U   ALTER TABLE ONLY public.restaurant DROP CONSTRAINT "FK_5a6420c3086d9d50d001cc01713";
       public          postgres    false    216    220    3224            �           2606    19328 0   reservation_group FK_5e20008280cf4827cab610088b9    FK CONSTRAINT     �   ALTER TABLE ONLY public.reservation_group
    ADD CONSTRAINT "FK_5e20008280cf4827cab610088b9" FOREIGN KEY (reservation_id) REFERENCES public.reservation(id);
 \   ALTER TABLE ONLY public.reservation_group DROP CONSTRAINT "FK_5e20008280cf4827cab610088b9";
       public          postgres    false    225    224    3234            �           2606    19333 0   reservation_group FK_6c218069a2d6f54685067c744fc    FK CONSTRAINT     �   ALTER TABLE ONLY public.reservation_group
    ADD CONSTRAINT "FK_6c218069a2d6f54685067c744fc" FOREIGN KEY (customer_id) REFERENCES public."user"(id);
 \   ALTER TABLE ONLY public.reservation_group DROP CONSTRAINT "FK_6c218069a2d6f54685067c744fc";
       public          postgres    false    3232    225    222            �           2606    19412 +   order_detail FK_73c5df246d4307f6abb1071be42    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_73c5df246d4307f6abb1071be42" FOREIGN KEY (reservation_id) REFERENCES public.reservation(id);
 W   ALTER TABLE ONLY public.order_detail DROP CONSTRAINT "FK_73c5df246d4307f6abb1071be42";
       public          postgres    false    224    226    3234            �           2606    19428 *   reservation FK_b8e66a59e3500c7a85cde4fb020    FK CONSTRAINT     �   ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT "FK_b8e66a59e3500c7a85cde4fb020" FOREIGN KEY (restaurant_id) REFERENCES public.restaurant(id);
 V   ALTER TABLE ONLY public.reservation DROP CONSTRAINT "FK_b8e66a59e3500c7a85cde4fb020";
       public          postgres    false    224    220    3230            �           2606    19407 +   order_detail FK_c2a7f2de6b58c7c5ccf4303e1aa    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_detail
    ADD CONSTRAINT "FK_c2a7f2de6b58c7c5ccf4303e1aa" FOREIGN KEY (customer_id) REFERENCES public."user"(id);
 W   ALTER TABLE ONLY public.order_detail DROP CONSTRAINT "FK_c2a7f2de6b58c7c5ccf4303e1aa";
       public          postgres    false    226    3232    222            �           2606    19715 $   staff FK_cec9365d9fc3a3409158b645f2e    FK CONSTRAINT     �   ALTER TABLE ONLY public.staff
    ADD CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e" FOREIGN KEY (user_id) REFERENCES public."user"(id);
 P   ALTER TABLE ONLY public.staff DROP CONSTRAINT "FK_cec9365d9fc3a3409158b645f2e";
       public          postgres    false    222    3232    228            B   �   x�Ŕ;
�@E���u*13X���E@"�kCL	�I�|�=�7fA��]��8���n�ݓ��7���$�Qp��Li�Ai]�qdS}�����6�I��cD������бi��ZE�۠���O&�{��{����%0��L�&�9N+�RZ �[��+$�X�ܦX��X�܆XL\�)� K��%@��b��b�Q��Ɉbu�b�JL�$�XV,	*��-�ψb���HF�#��e= yT\]      F   �   x���MK1������� ���'�E���Z�$�l��̒M/��f�¢��ü��J�u�j6�v��=s3j%8�o�����@��a�-�Zݫ���n�'��=��_��ٹ��������H�]�`0��c@���u��_��C�TO�G{����MCώ[��e�JB�Y�4�w�>���͘�������z3��"ƌi�JHc�t<"8i����v�C��ɔ�j���H��C�6m      D   e   x���v
Q���W((M��L��M�+U��L�Q�K�M�T�s
�t��sW�q�Us�	u���
�:
� =���\��h3ЈJ�4�� D�      N   t   x���v
Q���W((M��L��/JI-�OI-I��Q�(,M�+�,��QH.-.��Je��(���%�d���i��)@��B��O�k�����iZsy��cZ�bd ��h ��d]      L   �   x����
�@�{�b�*pcv�׮�$�@-�*4�j�m��S��	j����s�0�D�젬�kqj�����⮠_�.䩑.��I}*彼ֵ^��ҩ2�fSJ��2��!�"���c�[8,7���c�sz��1�D�M����J����ޮC��}���
�l�����fll+lb+lڅ�-��:0>�6o`DȐ�.�c{]�� 4��      M   f   x���v
Q���W((M��L�+J-N-*K,��ϋO/�/-P�@�L�QH.-.��M-r4�}B]�4Lt5��<�g�)�M4����T7т�&ZBL�� b���      H   �   x�͑�j�0��y
�҂Mr�i�0k
Nة(�a�	�}X��rK���ȟ$�ò�KՀ��̡3Կ-�yZX� n8=���Y��چc��3��zD2���c��-�R)�)�/���C���S^c�L@���)�Ր������#�'y4�62�d��<��2p��{"_C*��W�=�S����^���G�<���h�ZŪU�<�ٝf:��g�VEz�J�3�NǍ      P   
   x���          J   �   x���Kk�@����KL@�:JB�y���#��r��ԩ�#&����B)]ws΁����BD`y�u��a:�Z֌`�g*T�d*�]s��y�BM۶?7_}s.�|���Z[�+�Ia���Ệ0F*(��B��/C�Q*k������k&6K�lln��<cG��P���A<M�#3O<j���"�p?�U&ϒ�$���?\Ft �b�8U��;k����;��'o<��y��V�A{�5/�~qK���'�$}UUz�     