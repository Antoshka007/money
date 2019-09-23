<template>
    <div class="custom-background">
        <div class="custom-background__inner">
            <h1 class="text-center display-1 mb-10 blue-grey--text text--darken-2">Добро пожаловать в MyMoney!</h1>

            <p class="custom-description blue-grey--text text--darken-4">
                Данный сервис поможет Вам в управлении личными финансами. Записывайте свои доходы
                и расходы, распределяя их по категориям, а MyMoney наглядным образом визуализирует все данные,
                чтобы вы хорошо понимали своё финансовое положение.
            </p>
        </div>
    </div>
</template>

<style>
    .custom-background {
        display: flex;
        align-items: flex-start;
        height: 100vh;
        margin-top: -56px;
        padding-top: 56px;

        background-image: url(../assets/background.jpg);
        background-size: cover;
        background-repeat: no-repeat;
    }

    .custom-background__inner {
        max-width: 700px;
        padding: 50px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 100px;

        background-color: rgba(255, 255, 255, 0.8);
    }

    .custom-description {
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    @media screen and (min-width: 960px) {
        .custom-background {
            margin-top: -64px;
            padding-top: 64px;
        }
    }
</style>