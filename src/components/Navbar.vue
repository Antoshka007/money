<template>
    <nav>
        <v-app-bar flat app class="custom-bar">
            <v-toolbar-title class="blue-grey--text text--lighten-4">
                <v-dialog width="400">
                    <template v-slot:activator="{ on }">
                        <span v-on="on" class="blue-grey--text text--lighten-4 custom-logo">
                            MyMoney
                        </span>
                    </template>

                    <Info/>
                </v-dialog>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-dialog v-if="!isLoggedIn" v-model="isDialogOpen" width="300">
                <template v-slot:activator="{ on }">
                    <v-btn text v-on="on" class="blue-grey--text text--lighten-4">
                        Войти
                        <v-icon right>mdi-exit-to-app</v-icon>
                    </v-btn>
                </template>

                <v-tabs grow>
                    <v-tab class="custom-tab" href="#tab-login">
                        Вход
                    </v-tab>

                    <v-tab class="custom-tab" href="#tab-reg">
                        Регистрация
                    </v-tab>

                    <v-tab-item value="tab-login">
                        <Login :onLogin="onLogin" />
                    </v-tab-item>

                    <v-tab-item value="tab-reg">
                        <SignIn :onSignIn="onSignIn"/>
                    </v-tab-item>
                </v-tabs>
            </v-dialog>

            <div v-if="isLoggedIn" class="blue-grey--text text--lighten-4">
                {{this.userEmail}}

                <v-btn text @click="logoutClickHandler" class="ml-1 blue-grey--text text--lighten-4">
                    Выйти
                    <v-icon right>mdi-logout-variant</v-icon>
                </v-btn>
            </div>
        </v-app-bar>
    </nav>
</template>

<script>
    import Info from '@/components/Info';
    import Login from '@/components/Login';
    import SignIn from '@/components/SignIn';
    import firebase from 'firebase/app';
	import 'firebase/auth';

    export default {
    	components: { Info, Login, SignIn },
        data() {
        	return {
        		isLoggedIn: false,
                userEmail: null,
        	    isDialogOpen: false,
            };
        },
        methods: {
        	onLogin() {
                this.isDialogOpen = false;
            },
            onSignIn() {
        	    this.isDialogOpen = false;
            },
            logoutClickHandler() {
        		firebase.auth().signOut().then(() => {
        			console.log('Выход выполнен успешно');
                });
            }
        },
        created() {
			firebase.auth().onAuthStateChanged((user) => {
				this.isLoggedIn = !!user;

				if (user) {
					this.userEmail = user.email;
                } else {
					this.userEmail = null;
                }
			});
        }
    };
</script>

<style>
    .custom-bar {
        background-color: #333959 !important;
    }

    .custom-logo {
        cursor: pointer;
    }

    .custom-tab {
        width: 50% !important;
        margin: 0 !important;
    }
</style>