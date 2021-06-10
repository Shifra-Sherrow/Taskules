<template>
	<section class="login flex f-col f-center">
		<form @submit.prevent="loginOrSignup" class="flex f-col f-center">
			<h2>{{ titleTxt }}:</h2>
			<h2 class="red">{{ msg }}</h2>
			<input
				v-if="isSignup"
				type="text"
				placeholder="Full name"
				v-model="userToEdit.username"
			/>

			<input type="text" placeholder="Email" v-model="userToEdit.email" />
			<input
				type="text"
				placeholder="Password"
				v-model="userToEdit.password"
			/>
			<button>{{ btnTxt }}</button>
		</form>
		OR
		<router-link :to="to">{{ linkTxt }}</router-link>
		<facebookLogin class="fb-btn connect" @loggedin="$router.push('/board')" />
	</section>
</template>

<script>
import facebookLogin from '@/cmps/facebook-login.cmp'
export default {
	data() {
		return {
			userToEdit: {},
			isSignup: false,
			msg: ''
		};
	},
	computed: {
		titleTxt() {
			return this.isSignup ? 'Sign up for your account' : 'Log in to your account';
		},
		btnTxt() {
			return this.isSignup ? 'Sign up' : 'Continue';
		},
		linkTxt() {
			return this.isSignup ? 'Already have a Trililo account? Log in' : 'Sign up for an account';
		},
		to() {
			return this.isSignup ? '/login' : '/signup';
		}
	},
	methods: {
		getUserToEdit() {
			return {
				username: 'Dadi Gamadi',
				email: "dadi@gamadi.com",
				password: "gAmadi123",
			};
		},
		loginOrSignup() {
			if (!this.isSignup) this.login();
			else this.signup();
		},
		async login() {
			try {
				delete this.userToEdit.username;
				const user = await this.$store.dispatch({
					type: "login",
					userCred: this.userToEdit,
				});
				if (user) this.$router.push('/board');
			} catch (err) {
				this.msg = 'Invalid email or password';
				this.$router.push("/login");
			}
		},
		async signup() {
			if (!this.userToEdit.username || !this.userToEdit.password || !this.userToEdit.email) {
				this.msg = 'Please enter full name, email and password!';
				// await setTimeout(() => {
				//     this.msg = '';
				// }, 3000);
				return;
			}
			const user = await this.$store.dispatch({
				type: 'signup',
				userCred: JSON.parse(JSON.stringify(this.userToEdit))
			});
			if (user) this.$router.push('/board');
		}
	},
	created() {
		const lastWord = this.$route.path.split('/');
		if (lastWord[lastWord.length - 1] === 'signup') this.isSignup = true;
		else this.isSignup = false;
		this.userToEdit = this.getUserToEdit();
		this.msg = '';
	},
	watch: {
		'$route.path'() {
			const lastWord = this.$route.path.split('/');
			if (lastWord[lastWord.length - 1] === 'signup') this.isSignup = true;
			else this.isSignup = false;
			this.userToEdit = this.getUserToEdit();
		}
	},
	components: {
		facebookLogin
	}
};
</script>