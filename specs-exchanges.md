# Спецификация Веб-приложения: Crypta.Info Exchanges

## 1. Обзор

Данный документ описывает функциональные и нефункциональные требования к веб-приложению, предназначенному для сравнения и обзора криптовалютных бирж. Цель проекта - предоставить пользователям актуальную, объективную и удобную информацию для выбора подходящей биржи.

## 2. Функциональные Требования

### 2.1. Главная страница (`/exchanges`)

*   **Назначение:** Основная точка входа, предоставление общего обзора и быстрого доступа к информации.
*   **Компоненты:**
    *   **Блок поиска и фильтрации:**
        *   Поиск по названию биржи.
        *   Фильтры: страна регистрации/доступности, наличие лицензий (по юрисдикциям), тип KYC (обязательный, опциональный, нет), диапазон торговых комиссий (maker/taker), поддержка фиатных валют, наличие P2P-платформы, доступные языки интерфейса.
        *   Опции сортировки списка бирж: по рейтингу (общему), суточному объему, названию (А-Я).
    *   **Список бирж:**
        *   Отображение в виде карточек с пагинацией или бесконечной прокруткой.
        *   **Содержимое карточки:**
            *   Логотип биржи.
            *   Название биржи.
            *   Средний общий рейтинг (звезды/число).
            *   Количество отзывов.
            *   Суточный торговый объем (обновляемый).
            *   Краткая информация (год основания, страна).
            *   Кнопка/ссылка "Подробнее" (ведет на страницу биржи).
    *   **Блок "Топ Рейтингов":**
        *   Вывод лучших бирж по ключевым категориям (динамически обновляемый):
            *   Общая надежность (комплексный рейтинг).
            *   Самые низкие комиссии.
            *   Лучшая поддержка пользователей.
            *   Наивысшая ликвидность (на основе объема).
            *   Лучшие для новичков (на основе удобства интерфейса и отзывов).
    *   **Блок "Новости и События":**
        *   Краткие новостные заголовки, связанные с биржами (например, "Биржа X приостановила вывод средств", "Биржа Y добавила новую монету").
        *   Источник: Ручной ввод администратором или агрегация из доверенных источников (с указанием источника).
        *   Отображение даты новости.
    *   **Блок "Отзывы недели/месяца":**
        *   Выборка наиболее полезных или обсуждаемых отзывов за период.
        *   Отображение автора (никнейм), биржи, оценки, краткого текста отзыва.

### 2.2. Страница биржи (`/exchanges/{slug}`)

*   **Назначение:** Предоставление детальной информации о конкретной бирже.
*   **Компоненты:**
    *   **Основная информация:**
        *   Название, логотип.
        *   Год запуска.
        *   Страна регистрации / Штаб-квартира.
        *   Официальный веб-сайт (ссылка).
        *   Ссылки на социальные сети биржи (если применимо).
    *   **Юридическая информация:**
        *   Данные о лицензиях (номер, юрисдикция, статус).
        *   Политика KYC/AML (уровень верификации, требуемые документы).
    *   **Рейтинги по категориям:**
        *   Средний балл (звезды/число) и/или гистограмма распределения оценок по категориям:
            *   Удобство интерфейса (UI/UX).
            *   Качество и скорость поддержки.
            *   Безопасность (наличие 2FA, страховой фонд, история взломов).
            *   Торговые комиссии (Maker/Taker, комиссии на вывод).
            *   Ликвидность и выбор пар.
            *   Скорость ввода/вывода средств.
    *   **Торговая информация:**
        *   Актуальный суточный/недельный объем торгов.
        *   Основные торговые пары.
        *   Краткий обзор структуры комиссий.
        *   Поддерживаемые фиатные валюты.
    *   **Блок "Отзывы пользователей":**
        *   Список отзывов о данной бирже с пагинацией.
        *   Сортировка: по дате (новые/старые), по рейтингу (высокие/низкие), по полезности.
        *   Фильтры: по оценке (1-5 звезд), по наличию скриншота.
    *   **Форма "Оставить отзыв" (требуется авторизация):**
        *   Поля для оценки по категориям (шкала 1-5).
        *   Текстовое поле для комментария (с минимальной/максимальной длиной).
        *   Возможность прикрепить скриншот(ы) (с ограничением по размеру и формату файла).
