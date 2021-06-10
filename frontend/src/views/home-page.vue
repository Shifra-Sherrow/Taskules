<template>
	<section class="home-page">
		<header>
			<div class="hero-container">
				<lottie-player
					src="https://assets7.lottiefiles.com/packages/lf20_atgjqorh.json"
					background="#FFF1F1"
					speed="1"
					style="width: 100%; height: 550px"
					loop
					autoplay
				></lottie-player>
			</div>
		</header>
		<main class="main-container flex f-col f-center">
			<h1>The strongest task manager</h1>
		<router-link class="boards-btn" to="/board">start here</router-link>
			<article class="home-page-card flex">
				<div class="img">
					<img src="@/assets/imgs/home-page1.jpg" alt="" />
				</div>
				<div class="flex f-col art">
					<h2>MANAGE ALL YOUR WORK IN ONE PLACE</h2>
					<p>
						Traditional project management systems focus only on project work and fail to recognise the other in-house and personal tasks that impact on your daily productivity. <span class="bold">Taskules</span> is the right tool for you whether you’re a consultant, contractor or freelancer, or small agency needing to track work across multiple in-house and client related projects.
					</p>
				</div>
			</article>
			<article class="home-page-card flex">
				<div class="flex f-col art">
					<h2>focus on your targerts</h2>
					<p>
						The simple, intuitive user interface is designed to help you see exactly what you need to focus on.
As a team member you can focus on your work and as a team leader, you can easily manage your team
					</p>
				</div>
				<div class="img">
					<img src="@/assets/animations/home-page2.gif" alt="" />
				</div>
			</article>
			<article class="home-page-card flex">
				<div class="img">
					<img src="@/assets/imgs/home-page2.jpg" alt="" />
				</div>
				<div class="flex f-col art">
					<h2>team work has never been so simple</h2>
					<p>
						An open, connected structure allows information to flow freely among everyone at the organization. With social features, employees at every level have a voice to contribute, share, and receive feedback.
					</p>
				</div>
			</article>
		</main>
	</section>
</template>


<script>


</script>

