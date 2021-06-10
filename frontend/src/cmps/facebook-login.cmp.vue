<template>
	<div>
		<span class="login-btn" @click="logInWithFacebook">
			Login with Facebook
		</span>
	</div>
</template>
<script>

export default {
	name: "facebookLogin",
	methods: {
		async logInWithFacebook() {
			window.FB.login((response) => {
				if (response.authResponse) {
					this.getInfo(response.authResponse.userID)
				} else {
					console.log('User cancelled login or did not fully authorize.');
				}
			}, { scope: 'public_profile,email', return_scopes: true })

		},
		getInfo(userId) {
			window.FB.api(
				`/${userId}`,
				'GET',
				{
					"fields": "name,email,picture.width(400).height(400)" },
						({ name, email, picture, id }) => {
				const userCred = { username: name, email, password: id, id, imgUrl: picture.data.url }
					this.$store.dispatch({ type: 'handleFacebook', userCred })
			}
            );
            this.$emit('loggedin')
		}
	}
};
</script>
<style>
.button {
	color: white;
	min-width: 150px;
	background-color: #000000a1;
	height: 2.5rem;
	border-radius: 2rem;
	font-weight: 400;
	font-size: 0.8rem;
}
</style>